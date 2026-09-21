import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Menu,
  X,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { SchoolSettings } from '../../types/index.ts';
import { Button } from '../ui/Button.tsx';

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Academics', path: '/academics' },
    { label: 'Admissions', path: '/admissions' },
    { label: 'News', path: '/news' },
    { label: 'Events', path: '/events' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      {/* Top utility bar */}
      <div className="hidden lg:block bg-[#081528] text-slate-300 text-xs py-2 px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings?.phone || '+251 911 234 567'}</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings?.email || 'info@albrightacademy.edu'}</span>
            </div>
            <div className="text-amber-400/90 font-medium">
              KG1 – Grade 8 • Center of Excellence and Innovation
            </div>
          </div>
          <div className="flex items-center space-x-4">
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
                <span>Admin Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation */}
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
              className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0f2444] text-amber-400 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-150">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-black tracking-tight text-[#0f2444] font-display">
                  {settings?.schoolName || 'ALBRIGHT ACADEMY'}
                </span>
                <span className="block text-xs font-semibold text-amber-600 tracking-wider uppercase -mt-0.5">
                  Center of Excellence & Innovation
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map((item) => {
                const isActive = currentRoute === item.path;
                return (
                  <button
                    key={item.path}
                    id={`nav-link-${item.label.toLowerCase()}`}
                    onClick={() => handleNavClick(item.path)}
                    className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? 'text-[#0f2444] bg-slate-100 font-bold'
                        : 'text-slate-600 hover:text-[#0f2444] hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Right Action CTA */}
            <div className="hidden sm:flex items-center space-x-3">
              <Button
                id="nav-apply-now-btn"
                variant="gold"
                size="md"
                onClick={() => handleNavClick('/admissions')}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Apply Now
              </Button>
            </div>

            {/* Mobile menu toggle button */}
            <div className="flex lg:hidden items-center space-x-2">
              <Button
                id="nav-apply-now-mobile-btn"
                variant="gold"
                size="sm"
                className="text-xs px-2.5 py-1.5"
                onClick={() => handleNavClick('/admissions')}
              >
                Apply
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
          <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl animate-in slide-in-from-top-2 duration-150">
            <div className="px-4 pt-3 pb-6 space-y-1">
              {navLinks.map((item) => {
                const isActive = currentRoute === item.path;
                return (
                  <button
                    key={item.path}
                    id={`mobile-nav-${item.label.toLowerCase()}`}
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors cursor-pointer ${
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

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <Button
                  id="mobile-nav-apply-full"
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={() => handleNavClick('/admissions')}
                >
                  Start Online Admission
                </Button>
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
    </header>
  );
};
