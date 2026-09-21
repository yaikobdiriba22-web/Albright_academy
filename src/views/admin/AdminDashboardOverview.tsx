import React from 'react';
import {
  FileSpreadsheet,
  Clock,
  Newspaper,
  Calendar,
  Mail,
  ArrowUpRight,
  CheckCircle2,
  Users,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { DashboardStats, AdmissionApplication, ContactMessage } from '../../types/index.ts';
import { StatusBadge } from '../../components/ui/StatusBadge.tsx';
import { Button } from '../../components/ui/Button.tsx';

interface AdminDashboardOverviewProps {
  stats: DashboardStats | null;
  recentApplications: AdmissionApplication[];
  recentMessages: ContactMessage[];
  setAdminTab: (tab: string) => void;
  onRefresh: () => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  stats,
  recentApplications,
  recentMessages,
  setAdminTab,
  onRefresh,
}) => {
  const statCards = [
    {
      title: 'Total Applications',
      value: stats?.totalApplications ?? 0,
      subtext: `${stats?.pendingApplications ?? 0} requiring review`,
      icon: <FileSpreadsheet className="w-5 h-5 text-blue-600" />,
      actionTab: 'applications',
      color: 'border-blue-200 bg-blue-50/40',
    },
    {
      title: 'Pending Applications',
      value: stats?.pendingApplications ?? 0,
      subtext: 'Awaiting admissions evaluation',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      actionTab: 'applications',
      color: 'border-amber-200 bg-amber-50/40',
    },
    {
      title: 'Published News',
      value: stats?.publishedNews ?? 0,
      subtext: 'Live public press announcements',
      icon: <Newspaper className="w-5 h-5 text-indigo-600" />,
      actionTab: 'news',
      color: 'border-indigo-200 bg-indigo-50/40',
    },
    {
      title: 'Upcoming Events',
      value: stats?.upcomingEvents ?? 0,
      subtext: 'Scheduled on academic calendar',
      icon: <Calendar className="w-5 h-5 text-emerald-600" />,
      actionTab: 'events',
      color: 'border-emerald-200 bg-emerald-50/40',
    },
    {
      title: 'Unread Messages',
      value: stats?.unreadMessages ?? 0,
      subtext: 'Parent & public inquiries',
      icon: <Mail className="w-5 h-5 text-rose-600" />,
      actionTab: 'messages',
      color: 'border-rose-200 bg-rose-50/40',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with Title & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f2444] font-display">
            Administrative Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time enrollment metrics, content governance, and communication flow.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
          >
            Refresh Metrics
          </Button>
          <Button
            variant="gold"
            size="sm"
            onClick={() => setAdminTab('applications')}
            icon={<ArrowUpRight className="w-4 h-4" />}
          >
            Review Admissions
          </Button>
        </div>
      </div>

      {/* Live Moving Announcement Banner Bar (Created by Admin) */}
      <div className="bg-gradient-to-r from-[#061224] via-[#0d2242] to-[#061224] border border-amber-500/30 rounded-2xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                Active Moving Marquee
              </span>
              <span className="text-xs text-slate-300 font-semibold">Created by Admin</span>
            </div>
            <p className="text-sm font-bold text-white mt-0.5 font-display line-clamp-1">
              "Albright Academy — Center of Excellence and Innovation"
            </p>
          </div>
        </div>
        <button
          onClick={() => setAdminTab('settings')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer self-start sm:self-center shrink-0 shadow-xs"
        >
          <span>Customize in Settings</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((c, i) => (
          <div
            key={i}
            onClick={() => setAdminTab(c.actionTab)}
            className={`p-5 rounded-2xl border ${c.color} bg-white shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 line-clamp-1">{c.title}</span>
              <div className="p-2 rounded-xl bg-white shadow-2xs border border-slate-100">
                {c.icon}
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#0f2444] font-display">
                {c.value}
              </div>
              <span className="text-2xs font-medium text-slate-500 mt-1 block">{c.subtext}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Recent Applications & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Applications */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-[#0f2444] font-display">
                Recent Admission Submissions
              </h2>
              <p className="text-xs text-slate-400">Newly received enrollment dossiers</p>
            </div>
            <button
              onClick={() => setAdminTab('applications')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentApplications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No admission applications found.
            </div>
          ) : (
            <div className="space-y-3">
              {recentApplications.slice(0, 5).map((app) => (
                <div
                  key={app.id}
                  onClick={() => setAdminTab('applications')}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#0f2444] truncate">
                        {app.firstName} {app.lastName}
                      </span>
                      <span className="text-2xs font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                        {app.applyingGrade}
                      </span>
                    </div>
                    <div className="text-2xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <span className="font-mono text-slate-400">{app.referenceNumber}</span>
                      <span>•</span>
                      <span>Guardian: {app.guardianName}</span>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <StatusBadge status={app.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent Inquiries */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-[#0f2444] font-display">
                Recent Inquiries
              </h2>
              <p className="text-xs text-slate-400">Incoming contact form submissions</p>
            </div>
            <button
              onClick={() => setAdminTab('messages')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View Inbox</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentMessages.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No inquiries in inbox.
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.slice(0, 4).map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setAdminTab('messages')}
                  className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    !msg.isRead || msg.status === 'Unread'
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-xs text-[#0f2444] truncate">
                      {msg.name}
                    </span>
                    <span className="text-2xs text-slate-400">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {msg.subject}
                  </p>
                  <p className="text-2xs text-slate-500 line-clamp-2 mt-0.5">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
