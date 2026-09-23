import React from 'react';
import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Send,
  Youtube,
  Lock,
  ArrowUpRight,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { SchoolSettings } from '../../types/index.ts';
import { useTranslation } from '../../i18n/LanguageContext.tsx';
import { LanguageSwitcher } from '../ui/LanguageSwitcher.tsx';

interface FooterProps {
  navigate: (route: string) => void;
  settings: SchoolSettings | null;
}

export const Footer: React.FC<FooterProps> = ({ navigate, settings }) => {
  const { d } = useTranslation();

  const quickLinks = [
    { label: d.nav.home, path: '/' },
    { label: d.nav.about, path: '/about' },
    { label: d.nav.academics, path: '/academics' },
    { label: d.nav.admissions, path: '/admissions' },
    { label: d.nav.teachers, path: '/teachers' },
    { label: d.nav.facilities, path: '/facilities' },
    { label: d.nav.studentLife, path: '/student-life' },
    { label: d.nav.gallery, path: '/gallery' },
    { label: d.nav.news, path: '/news' },
    { label: d.nav.faq, path: '/faq' },
    { label: d.nav.contact, path: '/contact' },
  ];

  const portalLinks = [
    { label: d.common.parentPortal, path: '/parent/login' },
    { label: d.common.teacherPortal, path: '/teacher/login' },
    { label: d.common.studentPortal, path: '/student/login' },
    { label: d.common.adminPortal, path: '/admin/login' },
  ];

  const handleLinkClick = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#071324] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: School Identity (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-13 h-13 rounded-full bg-white p-0.5 shadow-md shrink-0 overflow-hidden flex items-center justify-center">
                <img
                  src={settings?.logoUrl || '/logo.png'}
                  alt="Albright Academy Logo"
                  className="w-full h-full object-contain rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
                  {d.common.schoolName}
                </h3>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  {d.footer.accreditedSubtitle || d.common.schoolTagline}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              {d.footer.aboutSchool}
            </p>

            {/* Language Switcher in Footer */}
            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium">{d.footer.languageLabel || 'Language:'}</span>
              <LanguageSwitcher variant="dark" />
            </div>

            {/* Social icons */}
            <div className="pt-2 flex items-center space-x-3">
              <a
                id="footer-social-facebook"
                href={settings?.facebookUrl || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/90 hover:bg-amber-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                id="footer-social-telegram"
                href={settings?.telegramUrl || 'https://t.me'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/90 hover:bg-amber-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                id="footer-social-youtube"
                href={settings?.youtubeUrl || 'https://youtube.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/90 hover:bg-amber-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              {d.footer.quickLinks}
            </h4>
            <ul className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-xs sm:text-sm">
              {quickLinks.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => handleLinkClick(item.path)}
                    className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer text-left"
                  >
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Portals & ERP (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              {d.nav.portals}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {portalLinks.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => handleLinkClick(item.path)}
                    className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Information (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-xs sm:text-sm">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              {d.footer.contactInfo}
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  {settings?.address || 'Sheggar city, Gefarsa Gujjee, kella'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href={`tel:${settings?.phone || '0923014132'}`}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  {settings?.phone || '0923014132'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href={`mailto:${settings?.email || 'dinigaatrading@gmail.com'}`}
                  className="text-slate-300 hover:text-white transition-colors break-all"
                >
                  {settings?.email || 'dinigaatrading@gmail.com'}
                </a>
              </div>
            </div>

            <div className="pt-4">
              <button
                id="footer-admin-link"
                onClick={() => handleLinkClick('/admin/login')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{d.footer.adminLogin || 'Admin Login'}</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Albright Academy. {d.footer.allRightsReserved}</p>
          <div className="flex items-center space-x-6">
            <span className="text-slate-400">{d.footer.taglineValues || 'Excellence • Integrity • Innovation'}</span>
            <span>{d.footer.accreditedBadge || 'Accredited KG1 – Grade 8'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
