import React, { useState } from 'react';
import { 
  ForumPost, 
  ReplyItem 
} from '../types';
import { 
  User, 
  db, 
  doc, 
  updateDoc, 
  arrayUnion 
} from '../firebase';
import { 
  formatTimeAgo, 
  containsInsecureHttp, 
  getAvatarColor,
  escapeHTML 
} from '../utils/securityAndFormat';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Copy, 
  Check, 
  Terminal, 
  CornerDownLeft, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle,
  User as UserIcon,
  Tag,
  Clock,
  Pin
} from 'lucide-react';

interface PostCardProps {
  post: ForumPost;
  currentUser: User | null;
  onRequireLogin: () => void;
  onShowToast: (msg: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onRequireLogin,
  onShowToast
}) => {
  const [replyText, setReplyText] = useState('');
  const [replyToUser, setReplyToUser] = useState<string | null>(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [isCopiedCode, setIsCopiedCode] = useState(false);
  const [isExpandedReplies, setIsExpandedReplies] = useState(true);

  // Local like state for instant feedback
  const [liked, setLiked] = useState(() => {
    if (!currentUser || !post.likedBy) return false;
    return post.likedBy.includes(currentUser.uid);
  });
  const [likesCount, setLikesCount] = useState(post.likes || 0);

  // Copy code handler
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setIsCopiedCode(true);
    onShowToast('تم نسخ الكود البرمجي إلى الحافظة');
    setTimeout(() => setIsCopiedCode(false), 2000);
  };

  // Copy Post Link handler
  const handleCopyPostLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    onShowToast('تم نسخ رابط الموضوع');
  };

  // Handle Like
  const handleToggleLike = async () => {
    if (!currentUser) {
      onRequireLogin();
      return;
    }

    const newLiked = !liked;
    const newCount = newLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
    setLiked(newLiked);
    setLikesCount(newCount);

    try {
      const postRef = doc(db, "forum_posts", post.id);
      // We safely update Firestore
      await updateDoc(postRef, {
        likes: newCount
      });
    } catch (e) {
      console.error("Like update failed:", e);
    }
  };

  // Submit Reply
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setReplyError(null);

    if (!currentUser) {
      onRequireLogin();
      return;
    }

    if (!replyText.trim()) {
      setReplyError('يرجى كتابة نص الرد أولاً.');
      return;
    }

    if (containsInsecureHttp(replyText)) {
      setReplyError('⚠️ غير مسموح بنشر روابط غير آمنة (http://). يرجى استخدام (https://).');
      return;
    }

    setIsSubmittingReply(true);

    try {
      const newReply: ReplyItem = {
        userType: 'user',
        userName: currentUser.displayName || 'مستخدم',
        uid: currentUser.uid,
        avatar: currentUser.photoURL || undefined,
        text: replyText.trim(),
        replyTo: replyToUser,
        createdAt: new Date().toISOString()
      };

      const postRef = doc(db, "forum_posts", post.id);
      await updateDoc(postRef, {
        replies: arrayUnion(newReply)
      });

      setReplyText('');
      setReplyToUser(null);
      onShowToast('تم نشر ردك بنجاح');
    } catch (error) {
      console.error("Error sending reply:", error);
      setReplyError('حدث خطأ أثناء إضافة الرد.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Target a user for reply
  const handleTargetReply = (userName: string) => {
    setReplyToUser(userName);
    const textarea = document.getElementById(`reply-input-${post.id}`);
    if (textarea) {
      textarea.focus();
    }
  };

  // Helper to parse links safely
  const renderMessageContent = (text: string) => {
    if (!text) return null;
    
    // Convert safe https links
    const parts = text.split(/(https:\/\/[^\s]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('https://')) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 decoration-emerald-500/40 break-all inline-block"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const replies = post.replies || [];

  return (
    <article className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5 transition-all duration-200">
      
      {/* Header: Author Info, Timestamp */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
        
        <div className="flex items-center gap-3">
          {post.avatar ? (
            <img
              src={post.avatar}
              alt={post.name}
              className="w-10 h-10 rounded-2xl object-cover border border-emerald-500/40"
            />
          ) : (
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${getAvatarColor(post.name)} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
              {(post.name || 'U').charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm sm:text-base text-white">
                {post.name || 'مستخدم'}
              </span>

              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>عضو موثق</span>
              </span>

              {post.isPinned && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  <Pin className="w-3 h-3" />
                  <span>مثبت</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Share & Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyPostLink}
            title="مشاركة الموضوع"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Post Text Content (Preserving line breaks & spaces) */}
      <div className="text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words font-sans selection:bg-emerald-500 selection:text-slate-950">
        {renderMessageContent(post.message)}
      </div>

      {/* Attached Code Snippet (If Present) */}
      {post.codeSnippet && post.codeSnippet.code && (
        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              <span className="uppercase">{post.codeSnippet.language || 'CODE'}</span>
            </div>

            <button
              onClick={() => handleCopyCode(post.codeSnippet!.code)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              {isCopiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ الكود</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 overflow-x-auto" dir="ltr">
            <pre className="font-mono text-xs text-emerald-300/90 leading-relaxed tab-size-4">
              <code>{post.codeSnippet.code}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tags list */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {post.tags.map((t, idx) => (
            <span
              key={idx}
              className="text-[11px] font-mono text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Bar: Likes, Reply Count */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
        
        <div className="flex items-center gap-3">
          {/* Like Button */}
          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
              liked
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold'
                : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{likesCount} إعجاب</span>
          </button>

          {/* Replies count */}
          <button
            onClick={() => setIsExpandedReplies(!isExpandedReplies)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>{replies.length} ردود</span>
          </button>
        </div>

        <button
          onClick={() => {
            const input = document.getElementById(`reply-input-${post.id}`);
            if (input) input.focus();
          }}
          className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
          <span>كتابة رد</span>
        </button>

      </div>

      {/* Threaded Replies Section */}
      {isExpandedReplies && (
        <div className="space-y-3 pt-2">
          
          {replies.length > 0 && (
            <div className="space-y-2.5 pr-2 sm:pr-4 border-r-2 border-slate-800">
              {replies.map((reply, index) => {
                const isAdmin = reply.adminName || reply.userType === 'admin';
                const displayName = reply.adminName || reply.userName || 'مستخدم';

                return (
                  <div
                    key={index}
                    className={`rounded-2xl p-3.5 sm:p-4 text-xs transition-all ${
                      isAdmin
                        ? 'bg-emerald-950/40 border border-emerald-500/40 border-r-4 border-r-emerald-500 shadow-lg'
                        : 'bg-slate-950/80 border border-slate-800/80 border-r-4 border-r-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isAdmin ? 'text-emerald-300 font-mono' : 'text-slate-200'}`}>
                          {isAdmin ? '🛡️ ' : '💬 '} {displayName}
                        </span>

                        {isAdmin && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
                            مسؤول معتمد ✓
                          </span>
                        )}

                        {reply.replyTo && (
                          <span className="text-[11px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800/60 font-mono">
                            ردًا على @{reply.replyTo}
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-500">
                        {formatTimeAgo(reply.createdAt)}
                      </span>
                    </div>

                    <div className="text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                      {renderMessageContent(reply.text)}
                    </div>

                    {/* Quick reply-to button */}
                    <div className="mt-2 text-left">
                      <button
                        onClick={() => handleTargetReply(displayName)}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold hover:underline"
                      >
                        ↩ رد على {displayName}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Reply Form */}
          {currentUser ? (
            <form onSubmit={handleSendReply} className="pt-2 space-y-2">
              {replyToUser && (
                <div className="flex items-center justify-between text-xs bg-cyan-950/60 text-cyan-300 px-3 py-1.5 rounded-xl border border-cyan-800/60 font-mono">
                  <span>أنت ترد الآن على: @{replyToUser}</span>
                  <button
                    type="button"
                    onClick={() => setReplyToUser(null)}
                    className="text-rose-400 hover:text-rose-300 text-xs font-bold"
                  >
                    إلغاء الإشارة ×
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                <textarea
                  id={`reply-input-${post.id}`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={replyToUser ? `اكتب ردك على @${replyToUser}...` : "اكتب تعليقك أو إجابتك على هذا الموضوع..."}
                  rows={2}
                  className="flex-1 bg-slate-950 text-slate-200 text-xs placeholder-slate-500 rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 resize-y min-h-[60px]"
                />

                <button
                  type="submit"
                  disabled={isSubmittingReply}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50 transition-all self-end shrink-0"
                >
                  {isSubmittingReply ? '...' : 'إرسال الرد'}
                </button>
              </div>

              {replyError && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {replyError}
                </p>
              )}
            </form>
          ) : (
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-center">
              <p className="text-xs text-slate-400">
                🔒 التعليق والرد متاح للأعضاء المسجلين بحساب Google.{' '}
                <button
                  onClick={onRequireLogin}
                  className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-2"
                >
                  تسجيل الدخول للمشاركة
                </button>
              </p>
            </div>
          )}

        </div>
      )}

    </article>
  );
};
