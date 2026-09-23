import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Calendar,
  BookOpen,
  Award,
  Bell,
  Clock,
  CheckCircle2,
  FileText,
  User,
} from 'lucide-react';
import { api } from '../../lib/api.ts';
import {
  StudentProfile,
  AttendanceRecord,
  AcademicResult,
  CourseAssignment,
  SchoolAnnouncement,
  CurriculumSubject,
} from '../../types/index.ts';

interface StudentDashboardProps {
  portalUser: any;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ portalUser }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'results' | 'attendance' | 'announcements'>('overview');
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [results, setResults] = useState<AcademicResult[]>([]);
  const [assignments, setAssignments] = useState<CourseAssignment[]>([]);
  const [subjects, setSubjects] = useState<CurriculumSubject[]>([]);
  const [announcements, setAnnouncements] = useState<SchoolAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [stuList, attList, resList, asgList, subList, ancList] = await Promise.all([
          api.getStudents(),
          api.getAttendances(),
          api.getResults(),
          api.getAssignments(),
          api.getSubjects(),
          api.getAnnouncements(),
        ]);

        if (stuList.length > 0) {
          setStudent(stuList[0]);
        }
        setAttendances(attList);
        setResults(resList);
        setAssignments(asgList);
        setSubjects(subList);
        setAnnouncements(ancList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const totalAtt = attendances.length;
  const presentCount = attendances.filter((a) => a.status === 'Present').length;
  const attRate = totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Student Profile Card */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
            <GraduationCap className="w-7 h-7 text-emerald-300" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-semibold mb-1">
              <span>Active Scholar • Grade 4 Section B</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              {student?.fullName || portalUser?.fullName || 'Scholar Student'}
            </h2>
            <p className="text-xs text-slate-300">
              ID: <span className="font-mono font-bold text-white">{student?.studentCode || 'ALB-STU-2026-001'}</span> • Guardian: {student?.guardianName || 'Dawit Bekele'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold">Attendance Rate</div>
            <div className="text-2xl font-black text-emerald-300">{attRate}%</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-white border-t-2 border-t-emerald-600 border-x border-slate-200 text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>My Classes & Subjects</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'assignments'
              ? 'bg-white border-t-2 border-t-emerald-600 border-x border-slate-200 text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Homework ({assignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'results'
              ? 'bg-white border-t-2 border-t-emerald-600 border-x border-slate-200 text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Report Card & Grades</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'attendance'
              ? 'bg-white border-t-2 border-t-emerald-600 border-x border-slate-200 text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Attendance Log</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'announcements'
              ? 'bg-white border-t-2 border-t-emerald-600 border-x border-slate-200 text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notices ({announcements.length})</span>
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 1. OVERVIEW & SUBJECTS */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((sub) => (
              <div key={sub.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all">
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mb-2">
                  {sub.code}
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">{sub.name}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{sub.description || 'Core academic curriculum subject.'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 2. ASSIGNMENTS */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">My Homework Tasks</h3>
            <p className="text-xs text-slate-500">Upcoming assignments submitted by your classroom teachers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((asg) => (
              <div key={asg.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block mb-2">
                    {asg.subjectName}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{asg.title}</h4>
                  <p className="text-xs text-slate-600 mb-3">{asg.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1 font-bold text-amber-700">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Due: {asg.dueDate}</span>
                  </div>
                  <span className="font-bold text-slate-700">{asg.maxPoints} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 3. REPORT CARD & RESULTS */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Term 1 Assessment Report</h3>
            <p className="text-xs text-slate-500">Your examination scores and educator remarks.</p>
          </div>

          {results.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">No exam scores released yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Exam</th>
                    <th className="py-3 px-4">Marks</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4">Teacher Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {results.map((res) => (
                    <tr key={res.id}>
                      <td className="py-3 px-4 font-bold text-slate-900">{res.subjectName}</td>
                      <td className="py-3 px-4 text-slate-600">{res.examTitle}</td>
                      <td className="py-3 px-4 font-bold">{res.marksObtained} / {res.maxMarks}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[11px]">
                          {res.grade} ({res.percentage}%)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 italic">{res.remarks || 'Great effort!'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 4. ATTENDANCE LOG */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">My Daily Attendance Record</h3>
            <p className="text-xs text-slate-500">Recorded sessions for the current semester.</p>
          </div>

          <div className="divide-y divide-slate-100">
            {attendances.map((att) => (
              <div key={att.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">{att.date}</div>
                  <div className="text-slate-400 text-[11px]">Marked by {att.markedBy}</div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                    att.status === 'Present'
                      ? 'bg-emerald-100 text-emerald-800'
                      : att.status === 'Late'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {att.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 5. ANNOUNCEMENTS */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'announcements' && (
        <div className="space-y-3">
          {announcements.map((anc) => (
            <div key={anc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">{anc.title}</h4>
                {anc.isPinned && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Pinned
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{anc.content}</p>
              <div className="text-[11px] text-slate-400 pt-1">
                {new Date(anc.publishedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
