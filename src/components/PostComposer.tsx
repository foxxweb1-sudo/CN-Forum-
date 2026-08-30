import React, { useState } from 'react';
import { 
  User, 
  db, 
  collection, 
  addDoc, 
  serverTimestamp 
} from '../firebase';
import { 
  containsInsecureHttp, 
  getAvatarColor 
} from '../utils/securityAndFormat';
import { 
  Code2, 
  Send, 
  ShieldAlert, 
  Sparkles, 
  Terminal, 
  Tag, 
  AlertTriangle,
  LogIn,
  CheckCircle,
  Hash,
  X
} from 'lucide-react';

interface PostComposerProps {
  user: User | null;
  onRequireLogin: () => void;
  onSuccessPost?: () => void;
}

const SUPPORTED_LANGUAGES = [
  { id: 'python', name: 'Python' },
  { id: 'javascript', name: 'JavaScript / TypeScript' },
  { id: 'bash', name: 'Bash / Linux Shell' },
  { id: 'cpp', name: 'C / C++' },
  { id: 'html', name: 'HTML / CSS' },
  { id: 'sql', name: 'SQL Database' },
  { id: 'json', name: 'JSON / Config' },
  { id: 'go', name: 'Go / Golang' },
  { id: 'rust', name: 'Rust' }
];

export const PostComposer: React.FC<PostComposerProps> = ({
  user,
  onRequireLogin,
  onSuccessPost
}) => {
  const [message, setMessage] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  // Code snippet toggle
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeContent, setCodeContent] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('python');

  // Statuses
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!user) {
      onRequireLogin();
      return;
    }

    if (!message.trim() && !codeContent.trim()) {
      setErrorMessage('يرجى كتابة نص المشاركة أو إدراج كود برمجي.');
      return;
    }

    // Security Check: Block insecure http://
    if (containsInsecureHttp(message) || containsInsecureHttp(codeContent)) {
      setErrorMessage('⚠️ غير مسموح بنشر روابط غير مشفرة (http://). يرجى استخدام بروتوكول آمن (https://).');
      return;
    }

    setIsSubmitting(true);

    try {
      const newPostData: any = {
        name: user.displayName || 'مستخدم',
        uid: user.uid,
        avatar: user.photoURL || null,
        message: message.trim(),
        tags: tags.length > 0 ? tags : ['cybenode'],
        createdAt: serverTimestamp(),
        replies: [],
        likes: 0,
        likedBy: []
      };

      if (showCodeInput && codeContent.trim()) {
        newPostData.codeSnippet = {
          code: codeContent.trim(),
          language: codeLanguage
        };
      }

      await addDoc(collection(db, "forum_posts"), newPostData);

      // Reset form
      setMessage('');
      setCodeContent('');
      setShowCodeInput(false);
      setTags([]);
      setSuccessMessage('تم نشر مشاركتك بنجاح في المنتدى!');
      if (onSuccessPost) onSuccessPost();

      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (error: any) {
      console.error("Error creating post:", error);
      setErrorMessage('حدث خطأ أثناء النشر، يرجى التحقق من اتصالك والمحاولة لاحقاً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user not logged in, display the invite card
  if (!user) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 hover:border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 text-center sm:text-right">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>مجتمع CybeNode للمطورين والخبراء</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              انضم إلى حوارات البرمجة والأمن السيبراني
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl font-sans leading-relaxed">
              سجّل دخولك بحساب Google لمشاركة الأكواد والحلول، طرح الأسئلة التقنية، والرد المباشر مع خبراء المجتمع.
            </p>
          </div>

          <button
            onClick={onRequireLogin}
            className="shrink-0 flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-white/5 active:scale-95 transition-all"
          >
            <svg height="20" viewBox="0 0 24 24" width="20">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            <span>تسجيل الدخول بواسطة Google</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
      
      {/* Top Author bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-10 h-10 rounded-2xl object-cover border border-emerald-500/50"
            />
          ) : (
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${getAvatarColor(user.displayName || 'User')} flex items-center justify-center text-white font-bold text-sm`}>
              {(user.displayName || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{user.displayName || 'مستخدم'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                عضو معتمد
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-sans">
              اكتب موضوعاً جديداً أو شارك كوداً واستفساراً
            </span>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Text Area */}
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتب تفاصيل مشاركتك أو استفسارك هنا (تُقبل الروابط الآمنة https:// فقط)..."
            rows={4}
            className="w-full bg-slate-950 text-slate-100 text-sm placeholder-slate-500 rounded-2xl p-4 border border-slate-800 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-y min-h-[110px]"
          />
        </div>

        {/* Optional Code Snippet Drawer */}
        {showCodeInput ? (
          <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/30 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
                <Terminal className="w-4 h-4" />
                <span>إرفاق كود برمجي (Code Block):</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="bg-slate-900 text-xs font-mono text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 focus:outline-none focus:border-emerald-500"
                >
                  {SUPPORTED_LANGUAGES.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCodeInput(false)}
                  className="text-slate-400 hover:text-rose-400 p-1 text-xs"
                  title="إلغاء الكود"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <textarea
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              placeholder={`# الصق الكود البرمجي الخاص بك هنا (${codeLanguage})...`}
              rows={6}
              className="w-full bg-slate-900 font-mono text-xs text-emerald-300 placeholder-slate-600 rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-emerald-500/50 resize-y"
              dir="ltr"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCodeInput(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-emerald-300 border border-slate-700/60 transition-colors"
            >
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>+ إرفاق كود برمجي</span>
            </button>

            <span className="text-[11px] text-slate-500 hidden sm:inline">
              (يدعم بايثون، جافاسكريبت، أوامر لينكس، C++، إلخ)
            </span>
          </div>
        )}

        {/* Tags input */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Hash className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="أضف وسماً (مثال: python, dev, security)..."
              className="bg-transparent text-slate-200 placeholder-slate-500 text-xs focus:outline-none w-44"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
            >
              إضافة
            </button>
          </div>

          {tags.map((t, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700 text-xs font-mono"
            >
              #{t}
              <button
                type="button"
                onClick={() => handleRemoveTag(t)}
                className="hover:text-rose-400 text-slate-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-300 text-xs animate-shake">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-500/70" />
            <span>تشفير HTTPS نشط وفحص الأمان مفعل</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'جاري النشر...' : 'نشر المشاركة'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
