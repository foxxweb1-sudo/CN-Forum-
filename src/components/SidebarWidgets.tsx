import React from 'react';
import { 
  CYBENODE_LOGO_URL 
} from '../types';
import { 
  ShieldCheck, 
  Terminal, 
  Lock, 
  Users, 
  Activity, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  Code,
  Cpu,
  Server,
  MessageSquare,
  Flame,
  Globe,
  Briefcase
} from 'lucide-react';

interface SidebarWidgetsProps {
  postsCount: number;
  repliesCount?: number;
}

export const SidebarWidgets: React.FC<SidebarWidgetsProps> = ({
  postsCount,
  repliesCount = 0
}) => {
  return (
    <aside className="space-y-6">
      
      {/* Official Portals Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>بوابات منصة CybeNode</span>
          </h4>
          <span className="text-[10px] text-slate-500 font-mono">
            Official Links
          </span>
        </div>

        <div className="space-y-2.5">
          {/* Main Website Link */}
          <a
            href="https://www.cybenode.site"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-950 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Globe className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-white block group-hover:text-emerald-300 transition-colors">
                  موقع المنصة الرسمي
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  www.cybenode.site
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </a>

          {/* CEO Portal Link */}
          <a
            href="https://ceo.cybenode.site"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 hover:border-amber-400/50 hover:bg-amber-500/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-200 block group-hover:text-amber-300 transition-colors">
                  بوابة الرئيس التنفيذي (CEO Hub)
                </span>
                <span className="text-[10px] text-amber-400/70 font-mono">
                  ceo.cybenode.site
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-amber-400/70 group-hover:text-amber-300 transition-colors" />
          </a>
        </div>
      </div>

      {/* CybeNode Brand Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-emerald-500/30 p-1 flex items-center justify-center shrink-0 shadow-lg">
            <img
              src={CYBENODE_LOGO_URL}
              alt="CybeNode"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white font-mono flex items-center gap-1.5">
              <span>منصة CybeNode</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>
            <span className="text-[11px] text-emerald-400 font-mono">
              النظام البيئي للمطورين والأمن
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
          ملتقى تقني عربي موحد متخصص في علوم الحماية الرقمية، هندسة البرمجيات، الأنظمة السحابية والذكاء الاصطناعي.
        </p>

        {/* Live sync indicator */}
        <div className="flex items-center justify-between p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-mono">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>المزامنة السحابية:</span>
          </div>
          <span className="text-white font-bold font-mono">مباشر ومُشفر 🟢</span>
        </div>
      </div>

      {/* Community Stats Widget */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Flame className="w-4 h-4 text-emerald-400" />
            <span>نشاط المنتدى المباشر</span>
          </h4>
          <span className="text-[10px] text-emerald-400 font-mono">
            Live Hub
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 text-center">
            <span className="text-xl font-extrabold text-emerald-400 font-mono block">
              {postsCount}
            </span>
            <span className="text-[11px] text-slate-400 font-sans">
              إجمالي المواضيع
            </span>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 text-center">
            <span className="text-xl font-extrabold text-teal-400 font-mono block">
              {repliesCount}
            </span>
            <span className="text-[11px] text-slate-400 font-sans">
              الردود والمناقشات
            </span>
          </div>
        </div>

        <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-800/60 text-center">
          <span className="text-xs text-slate-400">نظام موحد للمواضيع بدون تفريعات</span>
        </div>
      </div>

      {/* CybeNode Security & Community Guidelines */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3.5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase font-mono pb-2 border-b border-slate-800">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>ميثاق الأمان في CybeNode</span>
        </div>

        <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>يُمنع نشر أي روابط غير مشفرة (http://) لسلامة الجميع.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>نشر الأكواد والسكربتات للأغراض التعليمية والأخلاقية فقط.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>استخدم ميزة منسق الأكواد لعرض الحلول بوضوح للأعضاء.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>الردود الرسمية تحمل علامة التوثيق المعتمدة 🛡️.</span>
          </li>
        </ul>
      </div>

    </aside>
  );
};
