import React, { useState, useEffect, useMemo } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { 
  PostComposer 
} from './components/PostComposer';
import { 
  PostCard 
} from './components/PostCard';
import { 
  SidebarWidgets 
} from './components/SidebarWidgets';
import { 
  CreatePostModal 
} from './components/CreatePostModal';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  User 
} from './firebase';
import { 
  ForumPost, 
  CYBENODE_LOGO_URL 
} from './types';
import { 
  FALLBACK_TECH_POSTS 
} from './data/mockPosts';
import { 
  ShieldAlert, 
  Terminal, 
  Search, 
  SlidersHorizontal, 
  CheckCircle, 
  AlertCircle, 
  Flame, 
  Clock, 
  MessageSquareCode, 
  Sparkles, 
  HelpCircle,
  RefreshCw,
  Globe,
  Briefcase,
  ExternalLink
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Posts State
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [firestoreConnected, setFirestoreConnected] = useState(false);

  // Search & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  // Modals & UI
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore Realtime Collection
  useEffect(() => {
    setIsLoadingPosts(true);

    try {
      const q = query(collection(db, "forum_posts"), orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          setFirestoreConnected(true);
          setIsLoadingPosts(false);

          if (snapshot.empty) {
            // If empty, set empty array
            setPosts([]);
            return;
          }

          const fetchedPosts: ForumPost[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            fetchedPosts.push({
              id: docSnap.id,
              name: data.name || 'مستخدم مجهول',
              uid: data.uid || '',
              avatar: data.avatar || null,
              message: data.message || '',
              tags: data.tags || [],
              codeSnippet: data.codeSnippet || undefined,
              createdAt: data.createdAt,
              replies: Array.isArray(data.replies) ? data.replies : [],
              likes: typeof data.likes === 'number' ? data.likes : 0,
              likedBy: Array.isArray(data.likedBy) ? data.likedBy : [],
              isPinned: data.isPinned || false
            });
          });

          setPosts(fetchedPosts);
        },
        (error) => {
          console.warn("Firestore listener error or permission check:", error);
          setFirestoreConnected(false);
          setIsLoadingPosts(false);
          // Fallback to sample posts if collection permissions need bootstrap
          setPosts(FALLBACK_TECH_POSTS);
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.error("Firestore setup error:", e);
      setIsLoadingPosts(false);
      setPosts(FALLBACK_TECH_POSTS);
    }
  }, []);

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      setIsAuthLoading(true);
      await signInWithPopup(auth, googleProvider);
      showToast('مرحباً بك! تم تسجيل الدخول بنجاح', 'success');
    } catch (error: any) {
      console.error("Google login error:", error);
      showToast('تعذر تسجيل الدخول، يرجى المحاولة مرة أخرى أو التحقق من الإعدادات.', 'error');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToast('تم تسجيل الخروج بنجاح', 'info');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Filtered & Sorted Posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchMsg = (post.message || '').toLowerCase().includes(q);
        const matchName = (post.name || '').toLowerCase().includes(q);
        const matchCode = (post.codeSnippet?.code || '').toLowerCase().includes(q);
        const matchTags = (post.tags || []).some(t => t.toLowerCase().includes(q));
        const matchReplies = (post.replies || []).some(r => 
          (r.text || '').toLowerCase().includes(q) || 
          (r.userName || '').toLowerCase().includes(q)
        );

        if (!matchMsg && !matchName && !matchCode && !matchTags && !matchReplies) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Pin priority
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (sortBy === 'popular') {
        const aScore = (a.likes || 0) + (a.replies?.length || 0) * 2;
        const bScore = (b.likes || 0) + (b.replies?.length || 0) * 2;
        return bScore - aScore;
      }

      return 0; // Default already sorted by Firestore createdAt desc
    });
  }, [posts, searchQuery, sortBy]);

  const totalReplies = useMemo(() => {
    return posts.reduce((acc, p) => acc + (p.replies?.length || 0), 0);
  }, [posts]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-sans">
      
      {/* Toast alert banner */}
      {toastMessage && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2.5 animate-bounce ${
          toastType === 'error'
            ? 'bg-rose-600 text-white'
            : toastType === 'info'
            ? 'bg-slate-800 text-slate-200 border border-slate-700'
            : 'bg-emerald-500 text-slate-950'
        }`}>
          {toastType === 'error' ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header / Navbar */}
      <Navbar
        user={currentUser}
        onLogin={handleGoogleLogin}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCreatePost={() => setIsCreateModalOpen(true)}
        postsCount={posts.length}
        isAuthLoading={isAuthLoading}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Hero & Announcement Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                منتدى <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">CybeNode</span> التقني
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                المساحة التفاعلية الموحدة للمطورين وخبراء الحماية والأمن السيبراني، لطرح الأسئلة التقنية، استعراض الأكواد، ومشاركة الحلول البرمجية والسحابية.
              </p>

              {/* Official Portals Direct Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="https://www.cybenode.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-500/20 active:scale-95 transition-all group"
                >
                  <Globe className="w-4 h-4 text-slate-900 group-hover:rotate-12 transition-transform" />
                  <span>زيارة موقع المنصة (CybeNode)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                </a>

                <a
                  href="https://ceo.cybenode.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-400 active:scale-95 transition-all group"
                >
                  <Briefcase className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>بوابة الرئيس التنفيذي (CEO Hub)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400/70" />
                </a>
              </div>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-4 bg-slate-950/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800 shrink-0 w-full sm:w-auto justify-around sm:justify-start">
              <div className="text-center px-4 border-l border-slate-800">
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-400 block">
                  {posts.length}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">موضوع تقني</span>
              </div>
              <div className="text-center px-4">
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-teal-400 block">
                  {totalReplies}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">رد ونقاش</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Feed (Left 2 columns on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Post Composer Section */}
            <PostComposer
              user={currentUser}
              onRequireLogin={handleGoogleLogin}
              onSuccessPost={() => showToast('تم نشر موضوعك في المنتدى بنجاح!', 'success')}
            />

            {/* Filter & Sorting Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">المحادثات والمواضيع:</span>
                <span className="text-xs font-bold text-white bg-slate-800 px-2.5 py-1 rounded-xl font-mono">
                  {filteredPosts.length} مشاركة
                </span>
                {searchQuery && (
                  <span className="text-xs text-emerald-400">
                    (نتائج البحث: "{searchQuery}")
                  </span>
                )}
              </div>

              {/* Sorting buttons */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs text-slate-400">الترتيب:</span>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setSortBy('latest')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      sortBy === 'latest'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    الأحدث
                  </button>
                  <button
                    onClick={() => setSortBy('popular')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      sortBy === 'popular'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    الأكثر تفاعلاً
                  </button>
                </div>
              </div>
            </div>

            {/* Posts List */}
            {isLoadingPosts ? (
              <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-4">
                <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-mono">جاري تحميل المحادثات السحابية المباشرة...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 mx-auto flex items-center justify-center text-slate-500">
                  <MessageSquareCode className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white">لا توجد مشاركات مطابقة حالياً</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
                  كن أول من يبدأ النقاش أو يطرح سؤالاً تقنياً في المنتدى.
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs"
                >
                  طرح موضوع جديد الآن
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onRequireLogin={handleGoogleLogin}
                    onShowToast={showToast}
                  />
                ))}
              </div>
            )}

          </div>

          {/* Right Sidebar Widgets */}
          <div className="lg:col-span-1">
            <SidebarWidgets
              postsCount={posts.length}
              repliesCount={totalReplies}
            />
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 mt-20 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-emerald-500/30 p-1 flex items-center justify-center">
              <img
                src={CYBENODE_LOGO_URL}
                alt="CybeNode Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-slate-300 block font-mono">
                منتدى منصة CybeNode للتقنية والأمن السيبراني
              </span>
              <span className="text-[11px] text-slate-600">
                منصة رقمية موحدة لتعزيز المحتوى التقني العربي والحلول البرمجية
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <a
              href="https://www.cybenode.site"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>موقع المنصة (cybenode.site)</span>
            </a>

            <span className="text-slate-700 hidden sm:inline">•</span>

            <a
              href="https://ceo.cybenode.site"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-amber-300/90 hover:text-amber-300 transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>بوابة الرئيس التنفيذي (CEO)</span>
            </a>
          </div>

          <p className="text-[11px] text-slate-600 font-mono">
            جميع الحقوق محفوظة لمنصة CybeNode © {new Date().getFullYear()}
          </p>

        </div>
      </footer>

      {/* Modal for creating a post */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        user={currentUser}
        onRequireLogin={handleGoogleLogin}
      />

    </div>
  );
}
