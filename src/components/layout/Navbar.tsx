import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  Menu,
  X,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Users,
  Briefcase,
  ChevronDown,
} from 'lucide-react';
import { SchoolSettings } from '../../types/index.ts';
import { Button } from '../ui/Button.tsx';
import { LanguageSwitcher } from '../ui/LanguageSwitcher.tsx';
import { useTranslation } from '../../i18n/LanguageContext.tsx';
import { MovingBanner } from '../ui/MovingBanner.tsx';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  settings: SchoolSettings | null;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  navigate,
  settings,
  isAdminLoggedIn = false,
}) => {
  const { d } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalsDropdownOpen, setPortalsDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPortalsDropdownOpen(false);
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryNavLinks = [
    { label: d.nav.home, path: '/' },
    { label: d.nav.about, path: '/about' },
    { label: d.nav.academics, path: '/academics' },
    { label: d.nav.admissions, path: '/admissions' },
    { label: d.nav.teachers, path: '/teachers' },
    { label: d.nav.facilities, path: '/facilities' },
    { label: d.nav.studentLife, path: '/student-life' },
  ];

  const secondaryNavLinks = [
    { label: d.nav.gallery, path: '/gallery' },
    { label: d.nav.news, path: '/news' },
    { label: d.nav.events, path: '/events' },
    { label: d.nav.faq, path: '/faq' },
    { label: d.nav.contact, path: '/contact' },
  ];

  const portalLinks = [
    {
      title: d.common.parentPortal,
      desc: 'Attendance, report cards, fees & teacher chats',
      path: '/parent/login',
      icon: <Users className="w-4 h-4 text-amber-500" />,
    },
    {
      title: d.common.teacherPortal,
      desc: 'Class attendance, gradebooks & assignments',
      path: '/teacher/login',
      icon: <Briefcase className="w-4 h-4 text-blue-500" />,
    },
    {
      title: d.common.studentPortal,
      desc: 'Timetables, homework & achievements',
      path: '/student/login',
      icon: <GraduationCap className="w-4 h-4 text-emerald-500" />,
    },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setPortalsDropdownOpen(false);
    setMoreDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      {/* Top Utility Bar with Language Switcher and Contact Info */}
      <div className="hidden md:block bg-[#071324] text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Contact Info & Tagline */}
          <div className="flex items-center space-x-6">
            <a
              href={`tel:${settings?.phone || '0923014132'}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings?.phone || '0923014132'}</span>
            </a>
            <a
              href={`mailto:${settings?.email || 'dinigaatrading@gmail.com'}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings?.email || 'dinigaatrading@gmail.com'}</span>
            </a>
            <div className="text-amber-400/90 font-medium hidden lg:inline">
              {d.common.schoolTagline}
            </div>
          </div>

          {/* Right: Language Switcher and Admin Link */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher variant="dark" />

            <div className="h-4 w-px bg-slate-700" />

            {isAdminLoggedIn ? (
              <button
                id="top-admin-dashboard-btn"
                onClick={() => handleNavClick('/admin/dashboard')}
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Dashboard</span>
              </button>
            ) : (
              <button
                id="top-admin-login-btn"
                onClick={() => handleNavClick('/admin/login')}
                className="flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full bg-white transition-shadow duration-200 ${
          isScrolled ? 'shadow-md border-b border-slate-200' : 'border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo / Brand */}
            <button
              id="navbar-brand-logo"
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none shrink-0"
            >
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white p-0.5 shadow-sm border border-slate-200 group-hover:scale-105 transition-transform duration-150 shrink-0 overflow-hidden flex items-center justify-center">
                <img
                  src={settings?.logoUrl || '/logo.png'}
                  alt="Albright Academy Logo"
                  className="w-full h-full object-contain rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="block text-lg sm:text-xl font-black tracking-tight text-[#0f2444] font-display">
                  {d.common.schoolName}
                </span>
                <span className="block text-[11px] font-semibold text-amber-600 tracking-wider uppercase -mt-0.5">
                  Center of Excellence & Innovation
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center space-x-1" ref={dropdownRef}>
              {primaryNavLinks.map((item) => {
                const isActive = currentRoute === item.path;
                return (
                  <button
                    key={item.path}
                    id={`nav-link-${item.path.replace('/', '') || 'home'}`}
                    onClick={() => handleNavClick(item.path)}
                    className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? 'text-[#0f2444] bg-slate-100 font-extrabold shadow-2xs'
                        : 'text-slate-600 hover:text-[#0f2444] hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              {/* More Dropdown (Gallery, News, Events, FAQ, Contact) */}
              <div className="relative">
                <button
                  id="nav-more-dropdown-btn"
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    secondaryNavLinks.some((l) => l.path === currentRoute)
                      ? 'text-[#0f2444] bg-slate-100 font-extrabold'
                      : 'text-slate-600 hover:text-[#0f2444] hover:bg-slate-50'
                  }`}
                >
                  <span>More</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    {secondaryNavLinks.map((item) => {
                      const isActive = currentRoute === item.path;
                      return (
                        <button
                          key={item.path}
                          onClick={() => handleNavClick(item.path)}
                          className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-amber-50 text-amber-900 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Action CTAs: Portals & Apply Now */}
            <div className="hidden sm:flex items-center space-x-3">
              {/* Portals Button with Dropdown */}
              <div className="relative">
                <button
                  id="nav-portals-btn"
                  onClick={() => setPortalsDropdownOpen(!portalsDropdownOpen)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#0f2444] bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200/80"
                >
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>{d.nav.portals}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {portalsDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-1">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-900">
                        Albright Information Portals
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Select your school role to sign in
                      </p>
                    </div>
                    {portalLinks.map((p) => (
                      <button
                        key={p.path}
                        onClick={() => handleNavClick(p.path)}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer group"
                      >
                        <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-amber-50 transition-colors shrink-0">
                          {p.icon}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#0f2444]">
                            {p.title}
                          </div>
                          <div className="text-[11px] text-slate-500 leading-tight">
                            {p.desc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Apply Now Primary Button */}
              <Button
                id="nav-apply-now-btn"
                variant="gold"
                size="md"
                onClick={() => handleNavClick('/admissions')}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {d.common.applyNow}
              </Button>
            </div>

            {/* Mobile Controls */}
            <div className="flex xl:hidden items-center space-x-2">
              <Button
                id="nav-apply-now-mobile-btn"
                variant="gold"
                size="sm"
                className="text-xs px-2.5 py-1.5"
                onClick={() => handleNavClick('/admissions')}
              >
                {d.common.applyNow}
              </Button>
              <button
                id="nav-mobile-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-white shadow-xl animate-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto">
            {/* Mobile Language Switcher */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Select Language:</span>
              <LanguageSwitcher variant="light" />
            </div>

            <div className="px-4 pt-3 pb-6 space-y-1">
              {[...primaryNavLinks, ...secondaryNavLinks].map((item) => {
                const isActive = currentRoute === item.path;
                return (
                  <button
                    key={item.path}
                    id={`mobile-nav-${item.path.replace('/', '') || 'home'}`}
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#0f2444] text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </button>
                );
              })}

              {/* Portals in Mobile */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                  School Portals
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleNavClick('/parent/login')}
                    className="p-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold text-center"
                  >
                    Parent
                  </button>
                  <button
                    onClick={() => handleNavClick('/teacher/login')}
                    className="p-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold text-center"
                  >
                    Teacher
                  </button>
                  <button
                    onClick={() => handleNavClick('/student/login')}
                    className="p-2 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold text-center"
                  >
                    Student
                  </button>
                </div>

                <div className="pt-2">
                  <Button
                    id="mobile-nav-apply-full"
                    variant="gold"
                    size="lg"
                    className="w-full"
                    onClick={() => handleNavClick('/admissions')}
                  >
                    {d.common.applyNow}
                  </Button>
                </div>

                <button
                  id="mobile-nav-admin"
                  onClick={() => handleNavClick('/admin/login')}
                  className="w-full text-center py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  Admin Portal Login
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Moving Marquee Ribbon: "Albright Academy — Center of Excellence and Innovation" (Configured by Admin) */}
      <MovingBanner variant="dark" showControls={true} settings={settings} />
    </header>
  );
};
