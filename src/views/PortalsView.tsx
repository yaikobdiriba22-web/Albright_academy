import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  Briefcase,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  BookOpen,
  Award,
  Bell,
  Download,
  Clock,
  LogOut,
  Sparkles,
  ChevronRight,
  FileText,
  CreditCard,
  UserCheck,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.tsx';
import { Button } from '../components/ui/Button.tsx';
import { PortalUser } from '../types/index.ts';
import { api } from '../lib/api.ts';
import { TeacherDashboard } from '../components/portals/TeacherDashboard.tsx';
import { ParentDashboard } from '../components/portals/ParentDashboard.tsx';
import { StudentDashboard } from '../components/portals/StudentDashboard.tsx';

type PortalRole = 'parent' | 'teacher' | 'student';

interface PortalsViewProps {
  initialRole?: PortalRole;
  navigate: (route: string) => void;
}

export const PortalsView: React.FC<PortalsViewProps> = ({ initialRole = 'parent', navigate }) => {
  const { d, language } = useTranslation();
  const [activeRole, setActiveRole] = useState<PortalRole>(initialRole);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [portalUser, setPortalUser] = useState<PortalUser | null>(() => api.getStoredPortalUser());
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!api.getStoredPortalUser());
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (initialRole) {
      setActiveRole(initialRole);
    }
  }, [initialRole]);

  // If already logged in, set default student name if parent
  useEffect(() => {
    if (portalUser) {
      if (portalUser.role === 'TEACHER') {
        setActiveRole('teacher');
      } else if (portalUser.role === 'PARENT') {
        setActiveRole('parent');
        if (portalUser.studentName) {
          setSelectedStudent(`${portalUser.studentName} (${portalUser.studentGrade || 'Grade 4'})`);
        }
      }
    }
  }, [portalUser]);

  // Role metadata
  const rolesMeta = {
    parent: {
      title: d.portals.parentTitle,
      icon: <Users className="w-5 h-5 text-amber-500" />,
      tag: 'Parents & Guardians',
      color: 'border-amber-400 bg-amber-500/10 text-amber-500',
      desc: 'View real-time child attendance, term grades, fee payment receipts, teacher messages, and school announcements.',
    },
    teacher: {
      title: d.portals.teacherTitle,
      icon: <Briefcase className="w-5 h-5 text-blue-500" />,
      tag: 'Faculty & Educators',
      color: 'border-blue-400 bg-blue-500/10 text-blue-500',
      desc: 'Log classroom daily attendance, submit term report cards, publish homework assignments, and manage lesson plans.',
    },
    student: {
      title: d.portals.studentTitle,
      icon: <GraduationCap className="w-5 h-5 text-emerald-500" />,
      tag: 'Scholars (Grades 1–8)',
      color: 'border-emerald-400 bg-emerald-500/10 text-emerald-500',
      desc: 'Access daily timetables, homework checklists, digital library catalog, exam schedules, and learning achievements.',
    },
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      if (!userId.trim() || !password) {
        throw new Error('Please enter both your username/email and password.');
      }

      const res = await api.portalLogin({
        usernameOrEmail: userId.trim(),
        password,
        role: activeRole.toUpperCase(),
      });

      setPortalUser(res.user);
      setIsLoggedIn(true);
      if (res.user.studentName) {
        setSelectedStudent(`${res.user.studentName} (${res.user.studentGrade || 'Grade 4'})`);
      }
      setNotification(`Welcome back, ${res.user.fullName}!`);
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    api.portalLogout();
    setPortalUser(null);
    setIsLoggedIn(false);
    setUserId('');
    setPassword('');
    setLoginError(null);
    setNotification('You have been signed out.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl border border-amber-400/40 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white p-0.5 shadow-sm border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Albright Academy Logo"
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#0f2444] font-display">
                Albright Academy • School Information Portal
              </h1>
              <p className="text-xs text-slate-500">
                PostgreSQL / ERP Architecture Ready • Secure Access
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                icon={<LogOut className="w-4 h-4 text-rose-500" />}
                className="text-xs text-slate-700"
              >
                Sign Out
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="text-xs text-slate-600"
              >
                Return to Public Website
              </Button>
            )}
          </div>
        </div>

        {/* IF NOT LOGGED IN: SHOW AUTHENTICATION READY LOGIN SCREEN */}
        {!isLoggedIn ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Role Switcher & Explainer */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#0f2444] text-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Role-Based Access Control (RBAC)</span>
                </div>
                <h2 className="text-2xl font-bold font-display text-white">
                  {d.portals.loginHeadline}
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {d.portals.loginSubheadline}
                </p>

                {/* Role Tabs */}
                <div className="pt-2 space-y-2.5">
                  {(['parent', 'teacher', 'student'] as PortalRole[]).map((role) => {
                    const meta = rolesMeta[role];
                    const isCurrent = activeRole === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setActiveRole(role)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isCurrent
                            ? 'bg-white/10 border-amber-400 text-white shadow-sm'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${meta.color}`}>{meta.icon}</div>
                          <div>
                            <div className="font-bold text-sm text-white">{meta.title}</div>
                            <div className="text-xs text-slate-400">{meta.tag}</div>
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 ${isCurrent ? 'text-amber-400' : 'text-slate-500'}`}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-700/60 text-xs text-slate-400">
                  <p>{d.portals.erpNotice}</p>
                </div>
              </div>

              {/* Right: Authentication Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-lg">
                <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                  <div className={`p-2.5 rounded-xl ${rolesMeta[activeRole].color}`}>
                    {rolesMeta[activeRole].icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {rolesMeta[activeRole].title} Login
                    </h3>
                    <p className="text-xs text-slate-500">{rolesMeta[activeRole].desc}</p>
                  </div>
                </div>

                {/* Error Banner */}
                {loginError && (
                  <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Authentication Notice</div>
                      <div>{loginError}</div>
                    </div>
                  </div>
                )}

                <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs">
                  Accounts are created and managed by the Albright Academy administration. Use the credentials issued to you by the school.
                </div>

                <form onSubmit={handleLogin} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Username or Email Address
                    </label>
                    <input
                      type="text"
                      required
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Username or email"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        {d.portals.passwordPlaceholder}
                      </label>
                      <button
                        type="button"
                        onClick={() => alert('For password resets, please contact the Albright Academy Administrator or Registrar Office.')}
                        className="text-xs text-amber-600 hover:underline cursor-pointer"
                      >
                        Need Password Reset?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-[#0f2444] rounded border-slate-300 focus:ring-[#0f2444]"
                      />
                      <span>Keep me signed in on this device</span>
                    </label>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isLoggingIn}
                      className="w-full cursor-pointer bg-[#0f2444] hover:bg-[#16335d] text-amber-400 font-bold"
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      {isLoggingIn ? 'Authenticating...' : `${rolesMeta[activeRole].title} Login`}
                    </Button>
                  </div>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Need new credentials?</span>
                  <button
                    onClick={() => navigate('/contact')}
                    className="text-amber-600 font-semibold hover:underline cursor-pointer"
                  >
                    Contact Academy Registrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* IF LOGGED IN: SHOW ROLE SPECIFIC INTERACTIVE DASHBOARD PREVIEW */
          <div className="space-y-6">
            {/* Top Portal Banner */}
            <div className="bg-gradient-to-r from-[#0a182e] via-[#0f2444] to-[#142d54] text-white p-6 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3.5 rounded-2xl ${rolesMeta[activeRole].color}`}>
                  {rolesMeta[activeRole].icon}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>
                      Active Session • {portalUser ? `@${portalUser.username}` : 'Authenticated'}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display">
                    {activeRole === 'parent' &&
                      `${portalUser ? portalUser.fullName : 'Parent Guardian'} Portal`}
                    {activeRole === 'teacher' &&
                      `${portalUser ? portalUser.fullName : 'Teacher'} Portal`}
                    {activeRole === 'student' &&
                      `${portalUser ? portalUser.fullName : 'Student'} — Scholar Student Portal`}
                  </h2>
                  <p className="text-xs text-slate-300">
                    Albright Academy Integrated School Management System • {portalUser?.role || activeRole.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs text-rose-300 hover:text-white border-rose-400/40 hover:bg-rose-500/20 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>

            {/* DASHBOARD CONTENT ACCORDING TO ROLE */}
            {activeRole === 'parent' && <ParentDashboard portalUser={portalUser} />}
            {activeRole === 'teacher' && <TeacherDashboard portalUser={portalUser} />}
            {activeRole === 'student' && <StudentDashboard portalUser={portalUser} />}

          </div>
        )}
      </div>
    </div>
  );
};
