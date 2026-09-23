import React, { useState, useEffect, useCallback } from 'react';
import { api, DEFAULT_SCHOOL_SETTINGS } from './lib/api.ts';
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
import { TeachersView } from './views/TeachersView.tsx';
import { FacilitiesView } from './views/FacilitiesView.tsx';
import { StudentLifeView } from './views/StudentLifeView.tsx';
import { FAQView } from './views/FAQView.tsx';
import { PortalsView } from './views/PortalsView.tsx';
import { NotFoundView } from './views/NotFoundView.tsx';

// Admin Views
import { AdminLoginView } from './views/admin/AdminLoginView.tsx';
import { AdminDashboardOverview } from './views/admin/AdminDashboardOverview.tsx';
import { AdminApplicationsView } from './views/admin/AdminApplicationsView.tsx';
import { AdminNewsView } from './views/admin/AdminNewsView.tsx';
import { AdminEventsView } from './views/admin/AdminEventsView.tsx';
import { AdminGalleryView } from './views/admin/AdminGalleryView.tsx';
import { AdminMessagesView } from './views/admin/AdminMessagesView.tsx';
import { AdminSettingsView } from './views/admin/AdminSettingsView.tsx';
import { AdminUsersView } from './views/admin/AdminUsersView.tsx';

// Gemini Multi-turn Chatbot
import { GeminiChatbot } from './components/chat/GeminiChatbot.tsx';

// i18n Provider
import { LanguageProvider } from './i18n/LanguageContext.tsx';

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}

function normalizePath(rawPath: string): string {
  if (!rawPath) return '/';
  const clean = rawPath.split('?')[0].split('#')[0].replace(/\/+$/, '');
  return clean === '' ? '/' : clean;
}

function MainApp() {
  // Current route state
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return normalizePath(window.location.pathname);
  });

  // Admin user state
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  // Shared application data
  const [settings, setSettings] = useState<SchoolSettings>(DEFAULT_SCHOOL_SETTINGS);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<AdmissionApplication[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);

  // Selected article for News reader modal/detail
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Synchronize browser history and popstate
  const navigate = useCallback((route: string) => {
    const cleanRoute = normalizePath(route);
    setCurrentRoute(cleanRoute);
    window.history.pushState({}, '', cleanRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // If navigating to admin sub-tabs
    if (cleanRoute.startsWith('/admin/')) {
      const sub = cleanRoute.replace('/admin/', '');
      if (sub && sub !== 'login') {
        setAdminTab(sub);
      }
    } else if (cleanRoute === '/admin') {
      setAdminTab('dashboard');
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync document.title for SEO and clear user context
  useEffect(() => {
    const routeTitles: Record<string, string> = {
      '/': 'Albright Academy | KG1 – Grade 8 — Center of Excellence and Innovation',
      '/about': 'About Albright Academy | Vision, Mission & Values',
      '/academics': 'Academic Programs (KG1 – Grade 8) | Albright Academy',
      '/admissions': 'Admissions & Online Application | Albright Academy',
      '/teachers': 'Faculty & Academic Staff | Albright Academy',
      '/facilities': 'Campus & Modern Facilities | Albright Academy',
      '/student-life': 'Student Life & Co-Curricular | Albright Academy',
      '/gallery': 'Campus Gallery & Student Activities | Albright Academy',
      '/news': 'Latest News & School Announcements | Albright Academy',
      '/events': 'Upcoming School Events | Albright Academy',
      '/faq': 'Frequently Asked Questions | Albright Academy',
      '/contact': 'Contact & Campus Location | Albright Academy',
      '/admin/login': 'Administrator Portal Login | Albright Academy',
      '/parent/login': 'Parent & Guardian Portal | Albright Academy',
      '/teacher/login': 'Teacher & Faculty Portal | Albright Academy',
      '/student/login': 'Student Information Portal | Albright Academy',
      '/portals': 'School Information Portals | Albright Academy',
    };
    const title = routeTitles[currentRoute] || 'Albright Academy — Center of Excellence and Innovation';
    document.title = title;
  }, [currentRoute]);

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
      <>
        <AdminLoginView
          navigate={navigate}
          onLoginSuccess={(user) => {
            setAdminUser(user);
            loadAdminDashboardData();
          }}
          currentUser={adminUser}
        />
        <GeminiChatbot />
      </>
    );
  }

  // Admin section with layout
  if (isAdminRoute && currentRoute !== '/admin/login' && adminUser) {
    return (
      <>
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
          {adminTab === 'users' && (
            <AdminUsersView
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
        <GeminiChatbot />
      </>
    );
  }

  if (currentRoute === '/admin/login') {
    return (
      <>
        <AdminLoginView
          navigate={navigate}
          onLoginSuccess={(user) => {
            setAdminUser(user);
            loadAdminDashboardData();
          }}
          currentUser={adminUser}
        />
        <GeminiChatbot />
      </>
    );
  }

  // Check for portal routes
  const isPortalRoute =
    currentRoute.startsWith('/parent') ||
    currentRoute.startsWith('/teacher') ||
    currentRoute.startsWith('/student') ||
    currentRoute === '/portals';

  const initialPortalRole = currentRoute.startsWith('/parent')
    ? 'parent'
    : currentRoute.startsWith('/teacher')
    ? 'teacher'
    : currentRoute.startsWith('/student')
    ? 'student'
    : 'parent';

  const isKnownPublicRoute =
    currentRoute === '/' ||
    currentRoute === '/about' ||
    currentRoute === '/academics' ||
    currentRoute === '/admissions' ||
    currentRoute === '/teachers' ||
    currentRoute === '/facilities' ||
    currentRoute === '/student-life' ||
    currentRoute === '/gallery' ||
    currentRoute === '/news' ||
    currentRoute === '/events' ||
    currentRoute === '/faq' ||
    currentRoute === '/contact' ||
    isPortalRoute;

  // Render Public Website with Navbar & Footer
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-amber-400 selection:text-slate-950 font-sans">
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
        {currentRoute === '/teachers' && (
          <TeachersView navigate={navigate} />
        )}
        {currentRoute === '/facilities' && (
          <FacilitiesView navigate={navigate} />
        )}
        {currentRoute === '/student-life' && (
          <StudentLifeView navigate={navigate} />
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
        {currentRoute === '/faq' && <FAQView navigate={navigate} />}
        {currentRoute === '/contact' && <ContactView settings={settings} />}
        {isPortalRoute && (
          <PortalsView
            initialRole={initialPortalRole as 'parent' | 'teacher' | 'student'}
            navigate={navigate}
          />
        )}
        {!isKnownPublicRoute && (
          <NotFoundView navigate={navigate} />
        )}
      </main>

      <Footer navigate={navigate} settings={settings} />
      <GeminiChatbot />
    </div>
  );
}
