import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Newspaper,
  Calendar,
  Image as ImageIcon,
  Mail,
  Settings,
  LogOut,
  GraduationCap,
  ExternalLink,
  Menu,
  X,
  User,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { DashboardStats } from '../../types/index.ts';

interface AdminLayoutProps {
  currentAdminTab: string;
  setAdminTab: (tab: string) => void;
  adminUser: any;
  stats: DashboardStats | null;
  onLogout: () => void;
  onNavigatePublic: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentAdminTab,
  setAdminTab,
  adminUser,
  stats,
  onLogout,
  onNavigatePublic,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    {
      id: 'applications',
      label: 'Applications',
      icon: <FileSpreadsheet className="w-5 h-5" />,
      badge: stats?.pendingApplications ? `${stats.pendingApplications} new` : undefined,
      badgeColor: 'bg-amber-500 text-slate-950',
    },
    {
      id: 'users',
      label: 'User Accounts',
      icon: <Users className="w-5 h-5" />,
    },
    { id: 'news', label: 'News Management', icon: <Newspaper className="w-5 h-5" /> },
    { id: 'events', label: 'Events Calendar', icon: <Calendar className="w-5 h-5" /> },
    { id: 'gallery', label: 'Gallery Media', icon: <ImageIcon className="w-5 h-5" /> },
    {
      id: 'messages',
      label: 'Messages',
      icon: <Mail className="w-5 h-5" />,
      badge: stats?.unreadMessages ? `${stats.unreadMessages}` : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'settings', label: 'School Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-[#0a182e] text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white p-0.5 shadow-xs shrink-0 overflow-hidden flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Albright Academy Logo"
                  className="w-full h-full object-contain rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight font-display">
                  Albright Academy
                </h1>
                <span className="text-2xs text-amber-400 font-semibold uppercase tracking-wider block -mt-0.5">
                  Admin Command Console
                </span>
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center space-x-3">
            <button
              id="admin-view-public-site-btn"
              onClick={onNavigatePublic}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>

            <div className="h-4 w-px bg-slate-700 hidden sm:block" />

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-amber-400 font-bold text-2xs">
                <User className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline font-medium">
                {adminUser?.name || 'Administrator'}
              </span>
            </div>

            <button
              id="admin-logout-btn"
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-20 w-64 bg-[#0d1e3d] text-slate-300 pt-16 lg:pt-0 lg:static transition-transform duration-200 ease-in-out border-r border-slate-800/80 flex flex-col justify-between ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-4 space-y-1">
            <div className="px-3 py-2 text-2xs font-bold text-slate-400 uppercase tracking-wider">
              Management Modules
            </div>

            {menuItems.map((item) => {
              const isActive = currentAdminTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-tab-${item.id}`}
                  onClick={() => {
                    setAdminTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-slate-950 text-amber-400' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-800 text-2xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Encrypted Session Active</span>
            </div>
            <p>© 2026 Albright Academy System</p>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-10 bg-slate-900/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Content View Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
