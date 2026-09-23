import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Award,
  BookOpen,
  CreditCard,
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Plus,
} from 'lucide-react';
import { api } from '../../lib/api.ts';
import {
  StudentProfile,
  AttendanceRecord,
  AcademicResult,
  CourseAssignment,
  TeacherProfile,
  SchoolFee,
  TuitionPayment,
  SchoolAnnouncement,
} from '../../types/index.ts';

interface ParentDashboardProps {
  portalUser: any;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ portalUser }) => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'results' | 'assignments' | 'teachers' | 'fees' | 'announcements'>('attendance');
  const [children, setChildren] = useState<StudentProfile[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Child Data
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [results, setResults] = useState<AcademicResult[]>([]);
  const [assignments, setAssignments] = useState<CourseAssignment[]>([]);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [fees, setFees] = useState<SchoolFee[]>([]);
  const [payments, setPayments] = useState<TuitionPayment[]>([]);
  const [announcements, setAnnouncements] = useState<SchoolAnnouncement[]>([]);

  // Payment Form
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFeeId, setSelectedFeeId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(12000);
  const [paymentMethod, setPaymentMethod] = useState<'Telebirr' | 'CBE Birr' | 'Bank Transfer' | 'Cash'>('Telebirr');
  const [receiptNumber, setReceiptNumber] = useState('');

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // Fetch children linked to this parent (server strictly restricts by parent's linkage)
        const stuList = await api.getStudents();
        setChildren(stuList);
        if (stuList.length > 0) {
          setSelectedChildId(stuList[0].id);
        }

        const [feeList, payList, ancList, tchList] = await Promise.all([
          api.getFees(),
          api.getPayments(),
          api.getAnnouncements(),
          api.getTeachers(),
        ]);
        setFees(feeList);
        setPayments(payList);
        setAnnouncements(ancList);
        setTeachers(tchList);
      } catch (err: any) {
        showToast(err.message || 'Error loading parent data', 'error');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // When selected child changes, load their records
  useEffect(() => {
    if (!selectedChildId) return;
    const loadChildRecords = async () => {
      try {
        const [attList, resList, asgList] = await Promise.all([
          api.getAttendances({ studentId: selectedChildId }),
          api.getResults({ studentId: selectedChildId }),
          api.getAssignments(),
        ]);
        setAttendances(attList);
        setResults(resList);

        const currentChild = children.find((c) => c.id === selectedChildId);
        if (currentChild) {
          setAssignments(asgList.filter((a) => a.classId === currentChild.classId));
        }
      } catch (err: any) {
        console.error(err);
      }
    };
    loadChildRecords();
  }, [selectedChildId, children]);

  const selectedChild = children.find((c) => c.id === selectedChildId) || children[0];

  // Calculate attendance rate
  const totalAtt = attendances.length;
  const presentCount = attendances.filter((a) => a.status === 'Present').length;
  const attRate = totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : 100;

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeeId || !selectedChildId) {
      showToast('Please select a fee invoice to pay.', 'error');
      return;
    }

    try {
      const created = await api.recordPayment({
        feeId: selectedFeeId,
        studentId: selectedChildId,
        amountPaid: Number(paymentAmount),
        paymentMethod,
        receiptNumber: receiptNumber.trim() || undefined,
      });

      setPayments((prev) => [created, ...prev]);
      setShowPaymentModal(false);
      setReceiptNumber('');
      showToast('Payment receipt recorded! Awaiting admin verification.');
    } catch (err: any) {
      showToast(err.message || 'Payment submission failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2.5 shadow-md ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Child Selector & Quick Stat Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white p-5 rounded-2xl border border-amber-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500 text-white rounded-xl shadow-sm">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">Registered Scholar</div>
            <div className="text-lg font-bold text-slate-900">
              {selectedChild?.fullName || 'Child Profile'}
            </div>
            <div className="text-xs text-slate-500">
              ID: {selectedChild?.studentCode} • Enrolled: {selectedChild?.className} ({selectedChild?.sectionName || 'A'})
            </div>
          </div>
        </div>

        {/* Switch Child if multiple */}
        {children.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-700">Switch Child:</label>
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold rounded-lg border border-amber-300 bg-white text-slate-900"
            >
              {children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} ({c.className})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'attendance'
              ? 'bg-white border-t-2 border-t-amber-500 border-x border-slate-200 text-amber-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Attendance ({attRate}%)</span>
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'results'
              ? 'bg-white border-t-2 border-t-amber-500 border-x border-slate-200 text-amber-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Report Card & Marks</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'assignments'
              ? 'bg-white border-t-2 border-t-amber-500 border-x border-slate-200 text-amber-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Homework ({assignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'teachers'
              ? 'bg-white border-t-2 border-t-amber-500 border-x border-slate-200 text-amber-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Teachers</span>
        </button>

        <button
          onClick={() => setActiveTab('fees')}
          className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'fees'
              ? 'bg-white border-t-2 border-t-amber-500 border-x border-slate-200 text-amber-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Fees & Invoices</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'announcements'
              ? 'bg-white border-t-2 border-t-amber-500 border-x border-slate-200 text-amber-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Announcements ({announcements.length})</span>
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 1. ATTENDANCE TAB */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase">Overall Attendance</div>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1">{attRate}%</div>
              <p className="text-[11px] text-slate-500 mt-1">Total marked days: {totalAtt}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase">Present Days</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{presentCount}</div>
              <p className="text-[11px] text-slate-500 mt-1">On-time classroom arrival</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase">Late / Excused</div>
              <div className="text-3xl font-extrabold text-amber-600 mt-1">
                {attendances.filter((a) => a.status === 'Late' || a.status === 'Excused').length}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Absences recorded: {attendances.filter((a) => a.status === 'Absent').length}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h4 className="text-sm font-bold text-slate-900 mb-4">Detailed Attendance History</h4>
            {attendances.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">No attendance marked yet.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {attendances.map((att) => (
                  <div key={att.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-800">{att.date}</div>
                      <div className="text-slate-500 text-[11px]">{att.remarks || 'Standard session'} • Marked by {att.markedBy}</div>
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
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 2. RESULTS TAB */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Term Academic Performance</h3>
              <p className="text-xs text-slate-500">Official grades validated by Albright faculty.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-100">
              Grade 4 Term 1
            </span>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">No examination grades recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Assessment / Exam</th>
                    <th className="py-3 px-4">Marks (100)</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4">Instructor Feedback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {results.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">{res.subjectName}</td>
                      <td className="py-3 px-4 text-slate-600">{res.examTitle}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{res.marksObtained} / {res.maxMarks}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[11px]">
                          {res.grade} ({res.percentage}%)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 italic">{res.remarks || 'Good progress'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 3. HOMEWORK & ASSIGNMENTS TAB */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">Active Course Homework</h3>
            <p className="text-xs text-slate-500">Upcoming tasks assigned by teachers for {selectedChild?.className}.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((asg) => (
              <div key={asg.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-block mb-2">
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
                  <span className="text-[11px] text-slate-400">Teacher: {asg.teacherName}</span>
                </div>
              </div>
            ))}

            {assignments.length === 0 && (
              <div className="col-span-2 py-8 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200 text-xs">
                No outstanding assignments for this grade.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 4. TEACHERS TAB */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'teachers' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Faculty & Subject Instructors</h3>
            <p className="text-xs text-slate-500">Contact information for educators teaching your scholar.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teachers.map((tch) => (
              <div key={tch.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="font-bold text-sm text-slate-900">{tch.fullName}</div>
                <div className="text-xs text-slate-600">Qualification: {tch.qualification}</div>
                <div className="text-xs text-slate-600">Email: <span className="text-blue-600 font-medium">{tch.email}</span></div>
                <div className="text-xs text-slate-600">Office Phone: <span className="font-medium text-slate-800">{tch.phone}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 5. FEES & PAYMENTS TAB */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">School Tuition & Fee Schedule</h3>
              <p className="text-xs text-slate-500">Manage term tuition fees and register Telebirr/CBE Birr payment slips.</p>
            </div>

            <button
              onClick={() => {
                if (fees.length > 0) setSelectedFeeId(fees[0].id);
                setShowPaymentModal(true);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Record Fee Payment</span>
            </button>
          </div>

          {/* Payment Modal */}
          {showPaymentModal && (
            <div className="bg-white p-6 rounded-2xl border border-amber-300 shadow-lg space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Submit Payment Transaction Reference</h4>
              <form onSubmit={handleRecordPayment} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Fee Invoice</label>
                  <select
                    value={selectedFeeId}
                    onChange={(e) => {
                      setSelectedFeeId(e.target.value);
                      const f = fees.find((fee) => fee.id === e.target.value);
                      if (f) setPaymentAmount(f.amount);
                    }}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                  >
                    {fees.map((fee) => (
                      <option key={fee.id} value={fee.id}>
                        {fee.title} ({fee.amount.toLocaleString()} ETB)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Amount Paid (ETB)</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                  >
                    <option value="Telebirr">Telebirr Mobile Payment</option>
                    <option value="CBE Birr">CBE Birr</option>
                    <option value="Bank Transfer">Bank Transfer (CBE / Awash)</option>
                    <option value="Cash">Cash at Registrar Desk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Transaction / Receipt No.</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TXN-TELE-98421"
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>

                <div className="col-span-full flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg shadow-sm"
                  >
                    Submit Receipt Slip
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Payment Receipts List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h4 className="text-sm font-bold text-slate-900 mb-4">Payment Receipts & Billing History</h4>
            {payments.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">No payments submitted yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Receipt Ref</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Amount Paid</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {payments.map((p) => (
                      <tr key={p.id}>
                        <td className="py-3 px-4 font-bold text-slate-900">{p.receiptNumber}</td>
                        <td className="py-3 px-4">{p.feeTitle}</td>
                        <td className="py-3 px-4 font-bold text-emerald-700">{p.amountPaid.toLocaleString()} ETB</td>
                        <td className="py-3 px-4">{p.paymentMethod}</td>
                        <td className="py-3 px-4 text-slate-500">{p.paymentDate}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              p.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 6. ANNOUNCEMENTS TAB */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">Official Parent Bulletins</h3>
            <p className="text-xs text-slate-500">Schoolwide alerts and notices for Albright families.</p>
          </div>

          <div className="space-y-3">
            {announcements.map((anc) => (
              <div key={anc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{anc.title}</h4>
                  {anc.isPinned && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Pinned Alert
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{anc.content}</p>
                <div className="text-[11px] text-slate-400 pt-1">
                  Posted by {anc.author} • {new Date(anc.publishedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
