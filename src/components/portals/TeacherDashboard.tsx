import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  BookOpen,
  Calendar,
  Award,
  Users,
  Search,
  Save,
  Check,
} from 'lucide-react';
import { api } from '../../lib/api.ts';
import {
  AcademicClass,
  CurriculumSubject,
  StudentProfile,
  AttendanceRecord,
  CourseAssignment,
  SchoolExam,
  AcademicResult,
  AttendanceStatus,
} from '../../types/index.ts';

interface TeacherDashboardProps {
  portalUser: any;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ portalUser }) => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'assignments' | 'exams' | 'students'>('attendance');
  const [classes, setClasses] = useState<AcademicClass[]>([]);
  const [subjects, setSubjects] = useState<CurriculumSubject[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Attendance State
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceMarks, setAttendanceMarks] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});
  const [savingAttendance, setSavingAttendance] = useState(false);

  // Assignments State
  const [assignments, setAssignments] = useState<CourseAssignment[]>([]);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subjectId: '',
    dueDate: '',
    maxPoints: 20,
    description: '',
  });

  // Exams & Marks State
  const [exams, setExams] = useState<SchoolExam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [examResults, setExamResults] = useState<AcademicResult[]>([]);
  const [showAddExam, setShowAddExam] = useState(false);
  const [newExam, setNewExam] = useState({
    title: '',
    subjectId: '',
    term: 'Term 1 Midterm',
    date: new Date().toISOString().split('T')[0],
    maxMarks: 100,
  });
  const [marksInput, setMarksInput] = useState<Record<string, { marks: number; remarks: string }>>({});

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  // Initial Data Fetch
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [clsList, subList] = await Promise.all([
          api.getClasses(),
          api.getSubjects(),
        ]);
        setClasses(clsList);
        setSubjects(subList);

        if (clsList.length > 0) {
          // If teacher has assigned grades/classes, default to first matching
          setSelectedClassId(clsList[0].id);
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to initialize teacher dashboard', 'error');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Fetch students & data when selectedClassId changes
  useEffect(() => {
    if (!selectedClassId) return;

    const loadClassData = async () => {
      try {
        const [stuList, asgList, exmList] = await Promise.all([
          api.getStudents({ classId: selectedClassId }),
          api.getAssignments(),
          api.getExams(),
        ]);

        setStudents(stuList);
        setAssignments(asgList.filter((a) => a.classId === selectedClassId));
        setExams(exmList.filter((e) => e.classId === selectedClassId));

        if (exmList.filter((e) => e.classId === selectedClassId).length > 0) {
          setSelectedExamId(exmList.filter((e) => e.classId === selectedClassId)[0].id);
        }

        // Initialize attendance marks for students
        const initialMarks: Record<string, { status: AttendanceStatus; remarks: string }> = {};
        stuList.forEach((s) => {
          initialMarks[s.id] = { status: 'Present', remarks: '' };
        });

        // Load existing attendance if already marked today
        try {
          const existingAtt = await api.getAttendances({ classId: selectedClassId, date: attendanceDate });
          existingAtt.forEach((rec) => {
            initialMarks[rec.studentId] = { status: rec.status, remarks: rec.remarks || '' };
          });
        } catch {
          // fallback
        }

        setAttendanceMarks(initialMarks);
      } catch (err: any) {
        showToast(err.message || 'Error loading class information', 'error');
      }
    };

    loadClassData();
  }, [selectedClassId, attendanceDate]);

  // Load results when selectedExamId changes
  useEffect(() => {
    if (!selectedExamId) return;
    const loadResults = async () => {
      try {
        const results = await api.getResults({ examId: selectedExamId });
        setExamResults(results);
        const map: Record<string, { marks: number; remarks: string }> = {};
        results.forEach((r) => {
          map[r.studentId] = { marks: r.marksObtained, remarks: r.remarks || '' };
        });
        setMarksInput(map);
      } catch (err: any) {
        console.error(err);
      }
    };
    loadResults();
  }, [selectedExamId]);

  const handleSaveAttendance = async () => {
    if (!selectedClassId || students.length === 0) return;
    setSavingAttendance(true);
    try {
      const items = students.map((s) => ({
        studentId: s.id,
        classId: selectedClassId,
        sectionId: s.sectionId,
        date: attendanceDate,
        status: attendanceMarks[s.id]?.status || 'Present',
        remarks: attendanceMarks[s.id]?.remarks || '',
      }));

      await api.markAttendances(items);
      showToast(`Attendance recorded for ${items.length} students.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to save attendance', 'error');
    } finally {
      setSavingAttendance(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.subjectId || !newAssignment.dueDate) {
      showToast('Please fill in title, subject, and due date.', 'error');
      return;
    }

    try {
      const created = await api.createAssignment({
        classId: selectedClassId,
        subjectId: newAssignment.subjectId,
        title: newAssignment.title,
        description: newAssignment.description,
        dueDate: newAssignment.dueDate,
        maxPoints: Number(newAssignment.maxPoints) || 20,
      });

      setAssignments((prev) => [created, ...prev]);
      setShowAddAssignment(false);
      setNewAssignment({ title: '', subjectId: '', dueDate: '', maxPoints: 20, description: '' });
      showToast('Assignment posted successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to post assignment', 'error');
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await api.deleteAssignment(id);
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      showToast('Assignment removed.');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete assignment', 'error');
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExam.title || !newExam.subjectId) {
      showToast('Please fill all required exam fields.', 'error');
      return;
    }

    try {
      const created = await api.createExam({
        title: newExam.title,
        classId: selectedClassId,
        subjectId: newExam.subjectId,
        term: newExam.term,
        date: newExam.date,
        maxMarks: Number(newExam.maxMarks) || 100,
      });

      setExams((prev) => [created, ...prev]);
      setSelectedExamId(created.id);
      setShowAddExam(false);
      setNewExam({ title: '', subjectId: '', term: 'Term 1 Midterm', date: new Date().toISOString().split('T')[0], maxMarks: 100 });
      showToast('Exam scheduled successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to schedule exam', 'error');
    }
  };

  const handleSaveStudentMark = async (studentId: string) => {
    if (!selectedExamId) return;
    const input = marksInput[studentId];
    if (!input || input.marks === undefined) {
      showToast('Please enter marks first.', 'error');
      return;
    }

    try {
      const saved = await api.recordResult({
        examId: selectedExamId,
        studentId,
        marksObtained: Number(input.marks),
        remarks: input.remarks || '',
      });

      setExamResults((prev) => {
        const idx = prev.findIndex((r) => r.studentId === studentId && r.examId === selectedExamId);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = saved;
          return updated;
        }
        return [...prev, saved];
      });

      showToast(`Marks saved for student.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to save marks', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all shadow-md ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Class Selector Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Teaching Cohort</div>
            <div className="text-base font-bold text-slate-900">
              {classes.find((c) => c.id === selectedClassId)?.name || 'Select Class'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600">Select Class:</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3.5 py-2 text-sm font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'attendance'
              ? 'bg-white border-t-2 border-t-blue-600 border-x border-slate-200 text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Daily Attendance</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'assignments'
              ? 'bg-white border-t-2 border-t-blue-600 border-x border-slate-200 text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Assignments ({assignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('exams')}
          className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'exams'
              ? 'bg-white border-t-2 border-t-blue-600 border-x border-slate-200 text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Exams & Marks Grading</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'students'
              ? 'bg-white border-t-2 border-t-blue-600 border-x border-slate-200 text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Roster ({students.length})</span>
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 1. DAILY ATTENDANCE TAB */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Mark Classroom Attendance</h3>
              <p className="text-xs text-slate-500">Record daily presence, absences, or tardiness for this cohort.</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-800"
              />
              <button
                onClick={handleSaveAttendance}
                disabled={savingAttendance || students.length === 0}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingAttendance ? 'Saving...' : 'Save Attendance'}</span>
              </button>
            </div>
          </div>

          {students.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No students enrolled in this class yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {students.map((student) => {
                const currentStatus = attendanceMarks[student.id]?.status || 'Present';
                const remarks = attendanceMarks[student.id]?.remarks || '';

                return (
                  <div key={student.id} className="py-3.5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                        {student.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{student.fullName}</div>
                        <div className="text-xs text-slate-400">Code: {student.studentCode} • Sec: {student.sectionName || 'Main'}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {(['Present', 'Late', 'Absent', 'Excused'] as AttendanceStatus[]).map((st) => {
                        const isSelected = currentStatus === st;
                        let colorClass = 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100';
                        if (isSelected) {
                          if (st === 'Present') colorClass = 'bg-emerald-600 text-white border-emerald-600 shadow-sm';
                          if (st === 'Late') colorClass = 'bg-amber-500 text-white border-amber-500 shadow-sm';
                          if (st === 'Absent') colorClass = 'bg-rose-600 text-white border-rose-600 shadow-sm';
                          if (st === 'Excused') colorClass = 'bg-blue-600 text-white border-blue-600 shadow-sm';
                        }

                        return (
                          <button
                            key={st}
                            onClick={() =>
                              setAttendanceMarks((prev) => ({
                                ...prev,
                                [student.id]: {
                                  status: st,
                                  remarks: prev[student.id]?.remarks || '',
                                },
                              }))
                            }
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${colorClass}`}
                          >
                            {st}
                          </button>
                        );
                      })}

                      <input
                        type="text"
                        placeholder="Remarks..."
                        value={remarks}
                        onChange={(e) =>
                          setAttendanceMarks((prev) => ({
                            ...prev,
                            [student.id]: {
                              status: prev[student.id]?.status || 'Present',
                              remarks: e.target.value,
                            },
                          }))
                        }
                        className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 text-slate-700 w-32 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 2. ASSIGNMENTS TAB */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Homework & Assignments</h3>
              <p className="text-xs text-slate-500">Post new homework and projects for students in {classes.find((c) => c.id === selectedClassId)?.name}.</p>
            </div>
            <button
              onClick={() => setShowAddAssignment(!showAddAssignment)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddAssignment ? 'Close Form' : 'New Assignment'}</span>
            </button>
          </div>

          {/* New Assignment Form */}
          {showAddAssignment && (
            <form onSubmit={handleCreateAssignment} className="bg-white p-6 rounded-2xl border border-blue-200 shadow-md space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Create New Course Assignment</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assignment Title</label>
                  <input
                    type="text"
                    required
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    placeholder="e.g. Chapter 4 Fractions Practice"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject</label>
                  <select
                    required
                    value={newAssignment.subjectId}
                    onChange={(e) => setNewAssignment({ ...newAssignment, subjectId: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                  >
                    <option value="">-- Choose Subject --</option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name} ({sub.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Max Points</label>
                  <input
                    type="number"
                    value={newAssignment.maxPoints}
                    onChange={(e) => setNewAssignment({ ...newAssignment, maxPoints: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Instructions / Description</label>
                <textarea
                  rows={3}
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  placeholder="Detail instructions for scholars..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAssignment(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          )}

          {/* Assignments List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((asg) => (
              <div key={asg.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      {asg.subjectName || 'Subject'}
                    </span>
                    <button
                      onClick={() => handleDeleteAssignment(asg.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Delete assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">{asg.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4">{asg.description || 'No special instructions.'}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1 font-semibold text-amber-700">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Due: {asg.dueDate}</span>
                  </div>
                  <div className="font-bold text-slate-700">{asg.maxPoints} pts max</div>
                </div>
              </div>
            ))}

            {assignments.length === 0 && (
              <div className="col-span-2 py-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                No assignments posted for this class yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 3. EXAMS & MARKS TAB */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Exams & Academic Marks Entry</h3>
              <p className="text-xs text-slate-500">Enter marks for scheduled assessments. Grades are calculated automatically.</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900"
              >
                {exams.map((exm) => (
                  <option key={exm.id} value={exm.id}>
                    {exm.title} ({exm.subjectName})
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowAddExam(!showAddExam)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule Exam</span>
              </button>
            </div>
          </div>

          {/* New Exam Form */}
          {showAddExam && (
            <form onSubmit={handleCreateExam} className="bg-white p-6 rounded-2xl border border-blue-200 shadow-md space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Schedule New Examination</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Exam Title</label>
                  <input
                    type="text"
                    required
                    value={newExam.title}
                    onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                    placeholder="e.g. Semester 1 Final Exam"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject</label>
                  <select
                    required
                    value={newExam.subjectId}
                    onChange={(e) => setNewExam({ ...newExam, subjectId: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                  >
                    <option value="">-- Choose Subject --</option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assessment Term</label>
                  <input
                    type="text"
                    value={newExam.term}
                    onChange={(e) => setNewExam({ ...newExam, term: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={newExam.maxMarks}
                    onChange={(e) => setNewExam({ ...newExam, maxMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExam(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Save Exam
                </button>
              </div>
            </form>
          )}

          {/* Student Marks Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <h4 className="text-sm font-bold text-slate-900 mb-4">
              Enter Student Scores — {exams.find((e) => e.id === selectedExamId)?.title || 'No Exam Selected'}
            </h4>

            {students.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">No students available in this cohort.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Marks (100)</th>
                      <th className="py-3 px-4">Grade</th>
                      <th className="py-3 px-4">Teacher Feedback</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {students.map((student) => {
                      const input = marksInput[student.id] || { marks: 0, remarks: '' };
                      const recorded = examResults.find((r) => r.studentId === student.id);

                      return (
                        <tr key={student.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-bold text-slate-900">{student.fullName}</td>
                          <td className="py-3 px-4 text-slate-500">{student.studentCode}</td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={input.marks}
                              onChange={(e) =>
                                setMarksInput({
                                  ...marksInput,
                                  [student.id]: {
                                    ...input,
                                    marks: Number(e.target.value),
                                  },
                                })
                              }
                              className="w-20 px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 text-slate-900"
                            />
                          </td>
                          <td className="py-3 px-4 font-bold">
                            {recorded ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px]">
                                {recorded.grade} ({recorded.percentage}%)
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              placeholder="Feedback..."
                              value={input.remarks}
                              onChange={(e) =>
                                setMarksInput({
                                  ...marksInput,
                                  [student.id]: {
                                    ...input,
                                    remarks: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200"
                            />
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleSaveStudentMark(student.id)}
                              className="px-3 py-1 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              Save
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 4. STUDENT ROSTER TAB */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Enrolled Scholars Roster</h3>
            <p className="text-xs text-slate-500">Contact information and enrollment status for your assigned class.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <div key={student.id} className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all bg-slate-50/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">
                    {student.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">{student.fullName}</div>
                    <div className="text-xs text-slate-500">{student.studentCode}</div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-200">
                  <div>Gender: <span className="font-semibold text-slate-800">{student.gender}</span></div>
                  <div>Guardian: <span className="font-semibold text-slate-800">{student.guardianName}</span></div>
                  <div>Phone: <span className="font-semibold text-slate-800">{student.guardianPhone}</span></div>
                  <div>Status: <span className="font-semibold text-emerald-700">{student.status}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
