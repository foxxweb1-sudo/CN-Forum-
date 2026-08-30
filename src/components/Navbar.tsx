import React from 'react';
import { 
  CYBENODE_LOGO_URL 
} from '../types';
import { 
  ShieldCheck, 
  Search, 
  Plus, 
  LogOut, 
  LogIn,
  Globe,
  Briefcase,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { User } from '../firebase';
import { getAvatarColor } from '../utils/securityAndFormat';

interface NavbarProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCreatePost: () => void;
  postsCount: number;
  isAuthLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogin,
  onLogout,
  searchQuery,
  onSearchChange,
  onOpenCreatePost,
  postsCount,
  isAuthLoading
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-sm opacity-50 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-900 border border-emerald-500/30 overflow-hidden flex items-center justify-center p-1 shadow-md">
                <img
                  src={CYBENODE_LOGO_URL}
                  alt="CybeNode Logo"
                  className="w-full h-full object-contain filter drop-shadow"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-white font-mono">
                  Cybe<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Node</span>
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>المنتدى</span>
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-sans hidden md:block">
                مجتمع المطورين والأمن السيبراني
              </span>
            </div>
          </div>

          {/* Quick External Portals (Desktop & Tablet) */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href="https://www.cybenode.site"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 hover:text-emerald-400 border border-slate-800 hover:border-emerald-500/40 transition-all group shadow-sm"
              title="زيارة موقع منصة CybeNode الرسمي"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span>موقع المنصة</span>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
            </a>

            <a
              href="https://ceo.cybenode.site"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-400 transition-all group shadow-sm"
              title="بوابة الرئيس التنفيذي لمنصة CybeNode"
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>بوابة الرئيس التنفيذي (CEO)</span>
              <ExternalLink className="w-3 h-3 text-amber-400/70" />
            </a>
          </div>

          {/* Search Box in Header */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-2">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث في المواضيع والأكواد..."
                className="w-full bg-slate-900/90 text-slate-100 text-xs placeholder-slate-500 rounded-xl pl-8 pr-9 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action & User Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Create Post Button */}
            <button
              onClick={onOpenCreatePost}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all duration-200"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
              <span className="hidden sm:inline">طرح موضوع جديد</span>
              <span className="sm:hidden">نشر</span>
            </button>

            {/* User Auth Section */}
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3 bg-slate-900 border border-slate-800 p-1 sm:p-1.5 rounded-2xl">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover border border-emerald-500/40"
                  />
                ) : (
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br ${getAvatarColor(user.displayName || 'User')} flex items-center justify-center text-white font-bold text-xs`}>
                    {(user.displayName || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                
                <div className="hidden xl:flex flex-col text-right">
                  <span className="text-xs font-bold text-white max-w-[100px] truncate">
                    {user.displayName || 'مستخدم'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    عضو موثق ✓
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  title="تسجيل الخروج"
                  className="p-1 sm:p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                disabled={isAuthLoading}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/40 transition-all shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <span className="hidden sm:inline">{isAuthLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}</span>
                <span className="sm:hidden">دخول</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Portals Bar & Search */}
        <div className="pb-3 pt-1 space-y-2 lg:hidden">
          
          {/* Quick links on mobile & tablet */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href="https://www.cybenode.site"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 active:bg-emerald-500/20 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>موقع المنصة</span>
              <ExternalLink className="w-3 h-3 text-emerald-400/70" />
            </a>

            <a
              href="https://ceo.cybenode.site"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-semibold text-amber-200 bg-amber-500/10 border border-amber-500/30 active:bg-amber-500/20 transition-all"
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>بوابة الـ CEO</span>
              <ExternalLink className="w-3 h-3 text-amber-400/70" />
            </a>
          </div>

          {/* Mobile Search Input */}
          <div className="md:hidden">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث في المواضيع والأكواد..."
                className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl pl-8 pr-9 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/60"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
