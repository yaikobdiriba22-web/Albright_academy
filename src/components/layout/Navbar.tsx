import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, GraduationCap, Menu, ShieldCheck, X, Users, Briefcase, Phone, Mail, ArrowRight } from 'lucide-react';
import { SchoolSettings } from '../../types/index.ts';
import { LanguageSwitcher } from '../ui/LanguageSwitcher.tsx';
import { useTranslation } from '../../i18n/LanguageContext.tsx';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  settings: SchoolSettings | null;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, navigate, settings, isAdminLoggedIn = false }) => {
  const { d } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setPortalOpen(false); setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const primary = [
    [d.nav.home, '/'], [d.nav.about, '/about'], [d.nav.academics, '/academics'],
    [d.nav.admissions, '/admissions'], [d.nav.teachers, '/teachers'], [d.nav.facilities, '/facilities'],
  ];
  const more = [
    [d.nav.studentLife, '/student-life'], [d.nav.gallery, '/gallery'], [d.nav.news, '/news'],
    [d.nav.events, '/events'], [d.nav.faq, '/faq'], [d.nav.contact, '/contact'],
  ];

  const go = (path: string) => {
    navigate(path); setMobileOpen(false); setPortalOpen(false); setMoreOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden md:block bg-[#071324] text-slate-300">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 h-9 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-5">
            <a href={`tel:${settings?.phone || ''}`} className="flex items-center gap-1.5 hover:text-white"><Phone className="w-3 h-3 text-amber-400" />{settings?.phone || 'Contact school'}</a>
            <a href={`mailto:${settings?.email || ''}`} className="flex items-center gap-1.5 hover:text-white"><Mail className="w-3 h-3 text-amber-400" />{settings?.email || 'School email'}</a>
          </div>
          <div className="flex items-center gap-4"><span className="text-amber-300 font-semibold">{d.common.schoolTagline}</span><LanguageSwitcher variant="dark" /><span className="h-4 w-px bg-slate-700" /><button onClick={() => go('/admin/login')} className="hover:text-amber-300 flex items-center gap-1"><ShieldCheck className="w-3 h-3" />{isAdminLoggedIn ? 'Dashboard' : 'Admin'}</button></div>
        </div>
      </div>
      <nav className={`bg-white/95 backdrop-blur border-b transition-shadow ${scrolled ? 'shadow-lg border-slate-200' : 'border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="h-[76px] flex items-center justify-between gap-4">
            <button onClick={() => go('/')} className="flex items-center gap-3 text-left shrink-0">
              <span className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm p-1 flex items-center justify-center overflow-hidden"><img src={settings?.logoUrl || '/logo.png'} alt="Albright Academy" className="w-full h-full object-contain rounded-xl" /></span>
              <span className="hidden sm:block"><span className="block text-lg font-black tracking-tight text-[#0f2444]">Albright Academy</span><span className="block text-[9px] font-black uppercase tracking-[.16em] text-amber-600">Center of Excellence & Innovation</span></span>
            </button>

            <div className="hidden xl:flex items-center gap-1" ref={menuRef}>
              {primary.map(([label, path]) => <button key={path} onClick={() => go(path)} className={`px-3 py-2 rounded-lg text-xs font-bold transition ${currentRoute === path ? 'bg-slate-100 text-[#0f2444]' : 'text-slate-600 hover:bg-slate-50 hover:text-[#0f2444]'}`}>{label}</button>)}
              <div className="relative">
                <button onClick={() => setMoreOpen(v => !v)} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 ${more.some(([,p]) => currentRoute === p) ? 'bg-slate-100 text-[#0f2444]' : 'text-slate-600 hover:bg-slate-50'}`}>More <ChevronDown className="w-3.5 h-3.5" /></button>
                {moreOpen && <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white shadow-2xl p-2">{more.map(([label,path]) => <button key={path} onClick={() => go(path)} className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-[#0f2444]">{label}</button>)}</div>}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <div className="relative" ref={menuRef}>
                <button onClick={() => setPortalOpen(v => !v)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-black text-[#0f2444] hover:bg-slate-100"><Users className="w-4 h-4" /> Portals <ChevronDown className="w-3.5 h-3.5" /></button>
                {portalOpen && <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white shadow-2xl p-2">
                  {[['Parent Portal','/parent/login',Users],['Teacher Portal','/teacher/login',Briefcase],['Student Portal','/student/login',GraduationCap]].map(([label,path,Icon]: any) => <button key={path} onClick={() => go(path)} className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-slate-50"><span className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center"><Icon className="w-4 h-4 text-[#0f2444]" /></span><span className="flex-1 text-xs font-black text-[#0f2444]">{label}</span><ArrowRight className="w-4 h-4 text-slate-300" /></button>)}
                </div>}
              </div>
              <button onClick={() => go('/admissions')} className="rounded-xl bg-[#0f2444] px-4 py-2.5 text-xs font-black text-white hover:bg-[#173e6d] transition">Apply Now</button>
            </div>

            <button onClick={() => setMobileOpen(v => !v)} className="md:hidden w-11 h-11 rounded-xl border border-slate-200 flex items-center justify-center text-[#0f2444]" aria-label="Toggle menu">{mobileOpen ? <X /> : <Menu />}</button>
          </div>

          {mobileOpen && <div className="md:hidden pb-4 border-t border-slate-100 pt-3 space-y-1">
            {[...primary, ...more].map(([label,path]) => <button key={path} onClick={() => go(path)} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold ${currentRoute === path ? 'bg-amber-50 text-[#0f2444]' : 'text-slate-700 hover:bg-slate-50'}`}>{label}</button>)}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button onClick={() => go('/parent/login')} className="rounded-xl border border-slate-200 p-3 text-xs font-black text-[#0f2444]">Parent Portal</button>
              <button onClick={() => go('/teacher/login')} className="rounded-xl border border-slate-200 p-3 text-xs font-black text-[#0f2444]">Teacher Portal</button>
              <button onClick={() => go('/student/login')} className="rounded-xl border border-slate-200 p-3 text-xs font-black text-[#0f2444]">Student Portal</button>
              <button onClick={() => go('/admissions')} className="rounded-xl bg-[#0f2444] p-3 text-xs font-black text-white">Apply Now</button>
            </div>
          </div>}
        </div>
      </nav>
    </header>
  );
};
