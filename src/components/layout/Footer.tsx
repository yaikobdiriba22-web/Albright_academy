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
} from 'lucide-react';
import { SchoolSettings } from '../../types/index.ts';

interface FooterProps {
  navigate: (route: string) => void;
  settings: SchoolSettings | null;
}

export const Footer: React.FC<FooterProps> = ({ navigate, settings }) => {
  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Our Academy', path: '/about' },
    { label: 'Academic Programs', path: '/academics' },
    { label: 'Online Admissions', path: '/admissions' },
    { label: 'Campus Gallery', path: '/gallery' },
    { label: 'News & Announcements', path: '/news' },
    { label: 'Upcoming Events', path: '/events' },
    { label: 'Contact Us', path: '/contact' },
  ];

  const academicPrograms = [
    { label: 'Early Years (KG1 – KG3)', path: '/academics' },
    { label: 'Lower Primary (Grade 1 – 4)', path: '/academics' },
    { label: 'Upper Primary & Junior (Grade 5 – 8)', path: '/academics' },
    { label: 'STEM & Robotics Hub', path: '/academics' },
    { label: 'Holistic Student Development', path: '/about' },
  ];

  const handleLinkClick = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0a1529] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight font-display">
                  {settings?.schoolName || 'Albright Academy'}
                </h3>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  KG1 – Grade 8
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {settings?.slogan || 'Center of Excellence and Innovation'} — Nurturing curious minds,
              resilient character, and transformative 21st-century leadership from early childhood
              through junior secondary.
            </p>
            {/* Social icons */}
            <div className="pt-2 flex items-center space-x-3">
              <a
                id="footer-social-facebook"
                href={settings?.facebookUrl || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                id="footer-social-telegram"
                href={settings?.telegramUrl || 'https://t.me'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                id="footer-social-youtube"
                href={settings?.youtubeUrl || 'https://youtube.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((item) => (
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

          {/* Column 3: Academic Programs */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Programs
            </h4>
            <ul className="space-y-2.5 text-sm">
              {academicPrograms.map((item, idx) => (
                <li key={idx}>
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

          {/* Column 4: Contact Information */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Get in Touch
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <span className="text-slate-300">
                  {settings?.address || 'Bole Sub-City, Addis Ababa, Ethiopia'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-300">
                  {settings?.phone || '+251 911 234 567'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-300">
                  {settings?.email || 'info@albrightacademy.edu'}
                </span>
              </li>
            </ul>

            <div className="mt-6 pt-5 border-t border-slate-800">
              <button
                id="footer-admin-link"
                onClick={() => handleLinkClick('/admin/login')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Authorized Staff & Admin Login</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Albright Academy. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="text-slate-400">Excellence • Integrity • Innovation</span>
            <span>Accredited KG1 – Grade 8</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
