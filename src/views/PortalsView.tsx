import React, { useState } from 'react';
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
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.tsx';
import { Button } from '../components/ui/Button.tsx';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('Abebe Dawit (Grade 4B)');
  const [demoNotification, setDemoNotification] = useState<string | null>(null);

  // Role metadata
  const rolesMeta = {
    parent: {
      title: d.portals.parentTitle,
      icon: <Users className="w-5 h-5 text-amber-500" />,
      tag: 'Parents & Guardians',
      color: 'border-amber-400 bg-amber-500/10 text-amber-500',
      demoUser: 'parent.dawit@albright.family',
      desc: 'View real-time child attendance, term grades, fee payment receipts, teacher messages, and school announcements.',
    },
    teacher: {
      title: d.portals.teacherTitle,
      icon: <Briefcase className="w-5 h-5 text-blue-500" />,
      tag: 'Faculty & Educators',
      color: 'border-blue-400 bg-blue-500/10 text-blue-500',
      demoUser: 'teacher.alemayehu@albrightacademy.edu',
      desc: 'Log classroom daily attendance, submit term report cards, publish homework assignments, and manage lesson plans.',
    },
    student: {
      title: d.portals.studentTitle,
      icon: <GraduationCap className="w-5 h-5 text-emerald-500" />,
      tag: 'Scholars (Grades 1–8)',
      color: 'border-emerald-400 bg-emerald-500/10 text-emerald-500',
      demoUser: 'student.abebe@albright.student',
      desc: 'Access daily timetables, homework checklists, digital library catalog, exam schedules, and learning achievements.',
    },
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoggedIn(true);
    setDemoNotification(`Logged in successfully to ${rolesMeta[activeRole].title}`);
    setTimeout(() => setDemoNotification(null), 4000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId('');
    setPassword('');
  };

  const handleQuickDemo = (role: PortalRole) => {
    setActiveRole(role);
    setUserId(rolesMeta[role].demoUser);
    setPassword('DemoPass2026!');
    setIsLoggedIn(true);
    setDemoNotification(`Demo session active for ${rolesMeta[role].title}`);
    setTimeout(() => setDemoNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {demoNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl border border-amber-400/40 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{demoNotification}</span>
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

              {/* Quick Demo Launchers */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Instant Demo Preview</span>
                </div>
                <p className="text-xs text-slate-600">
                  Click below to immediately preview the fully simulated portal dashboard:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleQuickDemo('parent')}
                    className="px-3 py-2 text-xs font-semibold rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors text-center cursor-pointer"
                  >
                    Parent Demo
                  </button>
                  <button
                    onClick={() => handleQuickDemo('teacher')}
                    className="px-3 py-2 text-xs font-semibold rounded-lg bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 transition-colors text-center cursor-pointer"
                  >
                    Teacher Demo
                  </button>
                  <button
                    onClick={() => handleQuickDemo('student')}
                    className="px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition-colors text-center cursor-pointer"
                  >
                    Student Demo
                  </button>
                </div>
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

                <form onSubmit={handleLogin} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {d.portals.idPlaceholder}
                    </label>
                    <input
                      type="text"
                      required
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder={rolesMeta[activeRole].demoUser}
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
                        onClick={() => alert('Password reset link sent to your registered guardian/staff email address.')}
                        className="text-xs text-amber-600 hover:underline cursor-pointer"
                      >
                        Forgot Password?
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
                      className="w-full"
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      {d.portals.loginBtn}
                    </Button>
                  </div>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Need help accessing your portal?</span>
                  <button
                    onClick={() => navigate('/contact')}
                    className="text-amber-600 font-semibold hover:underline cursor-pointer"
                  >
                    Contact Registrar Office
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
                    <span>Active Session • Term 2 (2026)</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display">
                    {activeRole === 'parent' && 'Parent Guardian Portal — Dawit Family'}
                    {activeRole === 'teacher' && 'Teacher Portal — Mr. Dawit Alemayehu'}
                    {activeRole === 'student' && 'Student Portal — Abebe Dawit (Grade 4B)'}
                  </h2>
                  <p className="text-xs text-slate-300">
                    Albright Academy Integrated School Management System
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
                  {(['parent', 'teacher', 'student'] as PortalRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setActiveRole(r)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                        activeRole === r ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* DASHBOARD CONTENT ACCORDING TO ROLE */}
            {activeRole === 'parent' && (
              <div className="space-y-6">
                {/* Child Switcher */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Select Scholar:
                    </span>
                    <div className="flex gap-2">
                      {['Abebe Dawit (Grade 4B)', 'Liya Dawit (KG2)'].map((child) => (
                        <button
                          key={child}
                          onClick={() => setSelectedStudent(child)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            selectedStudent === child
                              ? 'bg-[#0f2444] text-white shadow-sm'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {child}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Attendance Rate: <strong>98.4% Present</strong></span>
                  </div>
                </div>

                {/* Parent Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-500 uppercase">Term Average</div>
                    <div className="text-2xl font-black text-[#0f2444] mt-1">94.2%</div>
                    <div className="text-xs text-emerald-600 font-semibold mt-1">Top 5% in Grade 4</div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-500 uppercase">Days Attended</div>
                    <div className="text-2xl font-black text-emerald-600 mt-1">68 / 70</div>
                    <div className="text-xs text-slate-500 mt-1">2 Excused Absences</div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-500 uppercase">Tuition Fees</div>
                    <div className="text-2xl font-black text-amber-600 mt-1">Cleared</div>
                    <div className="text-xs text-slate-500 mt-1">Receipt #ALB-2026-8921</div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-500 uppercase">Active Clubs</div>
                    <div className="text-2xl font-black text-indigo-600 mt-1">Robotics & Soccer</div>
                    <div className="text-xs text-slate-500 mt-1">Wed & Fri Sessions</div>
                  </div>
                </div>

                {/* Report Card Table & Notices */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {selectedStudent} — Term 1 Academic Report Card
                        </h3>
                        <p className="text-xs text-slate-500">Official Gradebook Assessment</p>
                      </div>
                      <button
                        onClick={() => alert('Downloading official PDF transcript...')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto mt-4">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200">
                            <th className="py-2.5 px-3">Subject</th>
                            <th className="py-2.5 px-3">Homework (20%)</th>
                            <th className="py-2.5 px-3">Mid-Term (30%)</th>
                            <th className="py-2.5 px-3">Final (50%)</th>
                            <th className="py-2.5 px-3">Total</th>
                            <th className="py-2.5 px-3">Grade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                          <tr>
                            <td className="py-2.5 px-3 font-bold">Mathematics</td>
                            <td className="py-2.5 px-3">19/20</td>
                            <td className="py-2.5 px-3">29/30</td>
                            <td className="py-2.5 px-3">48/50</td>
                            <td className="py-2.5 px-3 font-bold text-emerald-600">96%</td>
                            <td className="py-2.5 px-3 font-black">A+</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-bold">Inquiry Science & STEM</td>
                            <td className="py-2.5 px-3">18/20</td>
                            <td className="py-2.5 px-3">28/30</td>
                            <td className="py-2.5 px-3">48/50</td>
                            <td className="py-2.5 px-3 font-bold text-emerald-600">94%</td>
                            <td className="py-2.5 px-3 font-black">A</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-bold">English Language & Phonics</td>
                            <td className="py-2.5 px-3">19/20</td>
                            <td className="py-2.5 px-3">27/30</td>
                            <td className="py-2.5 px-3">46/50</td>
                            <td className="py-2.5 px-3 font-bold text-emerald-600">92%</td>
                            <td className="py-2.5 px-3 font-black">A</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-bold">Afaan Oromoo</td>
                            <td className="py-2.5 px-3">20/20</td>
                            <td className="py-2.5 px-3">29/30</td>
                            <td className="py-2.5 px-3">47/50</td>
                            <td className="py-2.5 px-3 font-bold text-emerald-600">96%</td>
                            <td className="py-2.5 px-3 font-black">A+</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-bold">Social Studies & Civics</td>
                            <td className="py-2.5 px-3">18/20</td>
                            <td className="py-2.5 px-3">27/30</td>
                            <td className="py-2.5 px-3">45/50</td>
                            <td className="py-2.5 px-3 font-bold text-emerald-600">90%</td>
                            <td className="py-2.5 px-3 font-black">A</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-bold">Visual Arts & Music</td>
                            <td className="py-2.5 px-3">20/20</td>
                            <td className="py-2.5 px-3">30/30</td>
                            <td className="py-2.5 px-3">48/50</td>
                            <td className="py-2.5 px-3 font-bold text-emerald-600">98%</td>
                            <td className="py-2.5 px-3 font-black">A+</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Teacher Feedback & Announcements */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span>Lead Teacher Commentary</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        “Abebe is a stellar scholar who consistently shows leadership in science experiments and mathematical problem-solving. He treats peers with exceptional respect and kindness.”
                      </p>
                      <div className="text-xs font-semibold text-[#0f2444]">
                        — Mr. Dawit Alemayehu, Grade 4 Lead
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Upcoming Deadlines
                        </span>
                        <Calendar className="w-4 h-4 text-slate-400" />
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700">
                        <li className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                          <span>Science Fair Proposal</span>
                          <span className="text-amber-600 font-bold">Oct 12</span>
                        </li>
                        <li className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                          <span>Parent-Teacher Meeting</span>
                          <span className="text-amber-600 font-bold">Oct 24</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Term 2 Mid-Exams</span>
                          <span className="text-amber-600 font-bold">Nov 10</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TEACHER DASHBOARD */}
            {activeRole === 'teacher' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-500 uppercase">Assigned Classes</div>
                    <div className="text-2xl font-black text-[#0f2444] mt-1">Grade 4B, 6A</div>
                    <div className="text-xs text-slate-500 mt-1">42 Enrolled Scholars</div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-500 uppercase">Today's Attendance</div>
                    <div className="text-2xl font-black text-emerald-600 mt-1">41 / 42 Present</div>
                    <div className="text-xs text-slate-500 mt-1">1 Student on Medical Leave</div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-500 uppercase">Gradebook Status</div>
                    <div className="text-2xl font-black text-blue-600 mt-1">Up to Date</div>
                    <div className="text-xs text-slate-500 mt-1">Quiz 3 scores submitted</div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-500 uppercase">Lesson Plan</div>
                    <div className="text-2xl font-black text-amber-600 mt-1">Week 6 Ready</div>
                    <div className="text-xs text-slate-500 mt-1">Aligned to Curriculum</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Classroom Roster & Attendance Log (Grade 4B — Today)
                      </h3>
                      <p className="text-xs text-slate-500">Instant Teacher Submission Sheet</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => alert('All students marked present.')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                      >
                        Mark All Present
                      </button>
                      <button
                        onClick={() => alert('Attendance submitted to central registrar database.')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0f2444] text-white hover:bg-[#132c52] cursor-pointer"
                      >
                        Save Attendance
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200">
                          <th className="py-2.5 px-3">Roll #</th>
                          <th className="py-2.5 px-3">Student Full Name</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Homework Check</th>
                          <th className="py-2.5 px-3">Recent Score</th>
                          <th className="py-2.5 px-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                        <tr>
                          <td className="py-2.5 px-3">01</td>
                          <td className="py-2.5 px-3 font-bold">Abebe Dawit</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                              Present
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-emerald-600 font-semibold">Completed</td>
                          <td className="py-2.5 px-3 font-bold">96%</td>
                          <td className="py-2.5 px-3">
                            <button
                              onClick={() => alert('Viewing student academic file')}
                              className="text-amber-600 hover:underline cursor-pointer"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3">02</td>
                          <td className="py-2.5 px-3 font-bold">Bethlehem Getachew</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                              Present
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-emerald-600 font-semibold">Completed</td>
                          <td className="py-2.5 px-3 font-bold">98%</td>
                          <td className="py-2.5 px-3">
                            <button
                              onClick={() => alert('Viewing student academic file')}
                              className="text-amber-600 hover:underline cursor-pointer"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3">03</td>
                          <td className="py-2.5 px-3 font-bold">Eyob Samuel</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                              Late (10 min)
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-emerald-600 font-semibold">Completed</td>
                          <td className="py-2.5 px-3 font-bold">89%</td>
                          <td className="py-2.5 px-3">
                            <button
                              onClick={() => alert('Viewing student academic file')}
                              className="text-amber-600 hover:underline cursor-pointer"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3">04</td>
                          <td className="py-2.5 px-3 font-bold">Kalkidan Tesfaye</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                              Present
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-emerald-600 font-semibold">Completed</td>
                          <td className="py-2.5 px-3 font-bold">95%</td>
                          <td className="py-2.5 px-3">
                            <button
                              onClick={() => alert('Viewing student academic file')}
                              className="text-amber-600 hover:underline cursor-pointer"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* STUDENT DASHBOARD */}
            {activeRole === 'student' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-500 uppercase">Today's Schedule</div>
                    <div className="text-2xl font-black text-[#0f2444] mt-1">6 Periods</div>
                    <div className="text-xs text-slate-500 mt-1">Current: Robotics & STEM</div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-500 uppercase">Homework Checklist</div>
                    <div className="text-2xl font-black text-emerald-600 mt-1">2 Pending</div>
                    <div className="text-xs text-slate-500 mt-1">Due Tomorrow 8:00 AM</div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-500 uppercase">Library Books</div>
                    <div className="text-2xl font-black text-blue-600 mt-1">2 Borrowed</div>
                    <div className="text-xs text-slate-500 mt-1">Return in 4 days</div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-500 uppercase">Badges Earned</div>
                    <div className="text-2xl font-black text-amber-500 mt-1">5 Badges</div>
                    <div className="text-xs text-slate-500 mt-1">STEM Innovator Star</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Daily Schedule */}
                  <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-base font-bold text-slate-900">Today’s Timetable (Grade 4B)</h3>
                      <Clock className="w-4 h-4 text-slate-400" />
                    </div>

                    <div className="space-y-2 text-xs">
                      {[
                        { time: '08:00 – 08:45 AM', subject: 'Mathematics (Fractions & Decimals)', teacher: 'Mr. Dawit', room: 'Room 12' },
                        { time: '08:50 – 09:35 AM', subject: 'Inquiry Science (Plant Ecosystems)', teacher: 'Ms. Hanan', room: 'Science Lab' },
                        { time: '09:35 – 10:00 AM', subject: 'Morning Break & Nutrition Snack', teacher: 'Cafeteria Staff', room: 'Cafeteria' },
                        { time: '10:00 – 10:45 AM', subject: 'English Reading & Creative Writing', teacher: 'Ms. Senait', room: 'Room 12' },
                        { time: '10:50 – 11:35 AM', subject: 'Afaan Oromoo Language & Heritage', teacher: 'Mr. Tolosa', room: 'Room 12' },
                        { time: '11:40 – 12:25 PM', subject: 'Robotics & Block Coding', teacher: 'Mr. Yohannes', room: 'Computer Lab' },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-amber-50/60 transition-colors"
                        >
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-900">{item.subject}</span>
                            <div className="text-slate-500 text-[11px]">{item.teacher} • {item.room}</div>
                          </div>
                          <span className="font-mono text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                            {item.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Homework & Badges */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="text-base font-bold text-slate-900">Homework Checklist</h3>
                        <BookOpen className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="space-y-2.5 text-xs">
                        <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer">
                          <input type="checkbox" className="mt-0.5 w-4 h-4 text-[#0f2444] rounded" />
                          <div>
                            <span className="font-bold text-slate-800">Math Practice Book page 42</span>
                            <p className="text-slate-500 text-[11px]">Due tomorrow at 8:00 AM</p>
                          </div>
                        </label>
                        <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer">
                          <input type="checkbox" className="mt-0.5 w-4 h-4 text-[#0f2444] rounded" />
                          <div>
                            <span className="font-bold text-slate-800">Science Journal: Leaf Sketches</span>
                            <p className="text-slate-500 text-[11px]">Due Wednesday</p>
                          </div>
                        </label>
                        <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200 cursor-pointer">
                          <input type="checkbox" defaultChecked className="mt-0.5 w-4 h-4 text-emerald-600 rounded" />
                          <div>
                            <span className="font-bold text-slate-800 line-through">English Vocabulary Sentences</span>
                            <p className="text-emerald-700 text-[11px]">Completed & Submitted</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                      <h3 className="text-base font-bold text-slate-900">Academic Achievements</h3>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                          🏆 Math Olympiad Silver
                        </span>
                        <span className="px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-900 font-bold border border-indigo-300">
                          🤖 Robotics Master
                        </span>
                        <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                          ⭐ 100% Attendance Star
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
