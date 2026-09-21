import React, { useState, useEffect, useCallback } from 'react';
import { api } from './lib/api.ts';
import {
  SchoolSettings,
  NewsItem,
  SchoolEvent,
  DashboardStats,
  AdmissionApplication,
  ContactMessage,
} from './types/index.ts';

// Layout Components
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { AdminLayout } from './components/admin/AdminLayout.tsx';

// Public Views
import { HomeView } from './views/HomeView.tsx';
import { AboutView } from './views/AboutView.tsx';
import { AcademicsView } from './views/AcademicsView.tsx';
import { AdmissionsView } from './views/AdmissionsView.tsx';
import { GalleryView } from './views/GalleryView.tsx';
import { NewsView } from './views/NewsView.tsx';
import { EventsView } from './views/EventsView.tsx';
import { ContactView } from './views/ContactView.tsx';

// Admin Views
import { AdminLoginView } from './views/admin/AdminLoginView.tsx';
import { AdminDashboardOverview } from './views/admin/AdminDashboardOverview.tsx';
import { AdminApplicationsView } from './views/admin/AdminApplicationsView.tsx';
import { AdminNewsView } from './views/admin/AdminNewsView.tsx';
import { AdminEventsView } from './views/admin/AdminEventsView.tsx';
import { AdminGalleryView } from './views/admin/AdminGalleryView.tsx';
import { AdminMessagesView } from './views/admin/AdminMessagesView.tsx';
import { AdminSettingsView } from './views/admin/AdminSettingsView.tsx';

export default function App() {
  // Current route state
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const path = window.location.pathname;
    return path || '/';
  });

  // Admin user state
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  // Shared application data
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<AdmissionApplication[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);

  // Selected article for News reader modal/detail
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Synchronize browser history and popstate
  const navigate = useCallback((route: string) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // If navigating to admin sub-tabs
    if (route.startsWith('/admin/')) {
      const sub = route.replace('/admin/', '');
      if (sub && sub !== 'login') {
        setAdminTab(sub);
      }
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch initial public & school data
  const loadInitialData = async () => {
    try {
      const [settingsData, newsData, eventsData] = await Promise.all([
        api.getSettings(),
        api.getNews(),
        api.getEvents(),
      ]);
      setSettings(settingsData);
      setNews(newsData);
      setEvents(eventsData);
    } catch (err) {
      console.error('Failed to load initial school data', err);
    }
  };

  // Check admin auth state
  const checkAdminAuth = async () => {
    setIsCheckingAuth(true);
    try {
      const res = await api.checkAuth();
      if (res.authenticated && res.user) {
        setAdminUser(res.user);
        loadAdminDashboardData();
      } else {
        setAdminUser(null);
      }
    } catch (err) {
      setAdminUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Load metrics & admin feeds
  const loadAdminDashboardData = async () => {
    try {
      const [statsData, appsData, messagesData] = await Promise.all([
        api.getStats(),
        api.getApplications({}),
        api.getMessages(),
      ]);
      setStats(statsData);
      setRecentApplications(appsData);
      setRecentMessages(messagesData);
    } catch (err) {
      console.error('Failed to load admin dashboard feeds', err);
    }
  };

  useEffect(() => {
    loadInitialData();
    checkAdminAuth();
  }, []);

  const handleAdminLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout error', err);
    }
    setAdminUser(null);
    navigate('/admin/login');
  };

  // Handle route matching
  const isAdminRoute = currentRoute.startsWith('/admin');

  // If user is accessing /admin and not logged in, show login page
  if (isAdminRoute && currentRoute !== '/admin/login' && !isCheckingAuth && !adminUser) {
    return (
      <AdminLoginView
        navigate={navigate}
        onLoginSuccess={(user) => {
          setAdminUser(user);
          loadAdminDashboardData();
        }}
      />
    );
  }

  // Admin section with layout
  if (isAdminRoute && currentRoute !== '/admin/login' && adminUser) {
    return (
      <AdminLayout
        currentAdminTab={adminTab}
        setAdminTab={(tab) => {
          setAdminTab(tab);
          navigate(`/admin/${tab}`);
        }}
        adminUser={adminUser}
        stats={stats}
        onLogout={handleAdminLogout}
        onNavigatePublic={() => navigate('/')}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboardOverview
            stats={stats}
            recentApplications={recentApplications}
            recentMessages={recentMessages}
            setAdminTab={(tab) => {
              setAdminTab(tab);
              navigate(`/admin/${tab}`);
            }}
            onRefresh={loadAdminDashboardData}
          />
        )}
        {adminTab === 'applications' && (
          <AdminApplicationsView
            onDataChanged={() => {
              loadAdminDashboardData();
            }}
          />
        )}
        {adminTab === 'news' && (
          <AdminNewsView
            news={news}
            onDataChanged={() => {
              api.getNews().then(setNews);
              loadAdminDashboardData();
            }}
          />
        )}
        {adminTab === 'events' && (
          <AdminEventsView
            events={events}
            onDataChanged={() => {
              api.getEvents().then(setEvents);
              loadAdminDashboardData();
            }}
          />
        )}
        {adminTab === 'gallery' && (
          <AdminGalleryView
            onDataChanged={() => {
              loadAdminDashboardData();
            }}
          />
        )}
        {adminTab === 'messages' && (
          <AdminMessagesView
            onDataChanged={() => {
              loadAdminDashboardData();
            }}
          />
        )}
        {adminTab === 'settings' && (
          <AdminSettingsView
            settings={settings}
            onSettingsUpdated={(newSettings) => {
              setSettings(newSettings);
            }}
          />
        )}
      </AdminLayout>
    );
  }

  if (currentRoute === '/admin/login') {
    return (
      <AdminLoginView
        navigate={navigate}
        onLoginSuccess={(user) => {
          setAdminUser(user);
          loadAdminDashboardData();
        }}
      />
    );
  }

  // Render Public Website with Navbar & Footer
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      <Navbar
        currentRoute={currentRoute}
        navigate={navigate}
        settings={settings}
        isAdminLoggedIn={!!adminUser}
      />

      <main className="flex-1">
        {currentRoute === '/' && (
          <HomeView
            navigate={navigate}
            settings={settings}
            news={news}
            events={events}
            setSelectedNews={(n) => {
              setSelectedNews(n);
              navigate('/news');
            }}
          />
        )}
        {currentRoute === '/about' && (
          <AboutView navigate={navigate} settings={settings} />
        )}
        {currentRoute === '/academics' && (
          <AcademicsView navigate={navigate} />
        )}
        {currentRoute === '/admissions' && (
          <AdmissionsView navigate={navigate} />
        )}
        {currentRoute === '/gallery' && <GalleryView />}
        {currentRoute === '/news' && (
          <NewsView
            news={news}
            selectedNews={selectedNews}
            setSelectedNews={setSelectedNews}
          />
        )}
        {currentRoute === '/events' && <EventsView events={events} />}
        {currentRoute === '/contact' && <ContactView settings={settings} />}
      </main>

      <Footer navigate={navigate} settings={settings} />
    </div>
  );
}
