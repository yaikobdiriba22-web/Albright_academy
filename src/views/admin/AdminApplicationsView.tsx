import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { api } from '../../lib/api.ts';
import { AdmissionApplication, ApplicationStatus } from '../../types/index.ts';
import { StatusBadge } from '../../components/ui/StatusBadge.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Modal } from '../../components/ui/Modal.tsx';

interface AdminApplicationsViewProps {
  onDataChanged: () => void;
}

export const AdminApplicationsView: React.FC<AdminApplicationsViewProps> = ({
  onDataChanged,
}) => {
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [gradeFilter, setGradeFilter] = useState<string>('All');

  // Modals state
  const [viewingApp, setViewingApp] = useState<AdmissionApplication | null>(null);
  const [deletingApp, setDeletingApp] = useState<AdmissionApplication | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchApps = async () => {
    setIsLoading(true);
    try {
      const data = await api.getApplications({
        status: statusFilter !== 'All' ? (statusFilter as ApplicationStatus) : undefined,
        grade: gradeFilter !== 'All' ? gradeFilter : undefined,
        search: search.trim() ? search.trim() : undefined,
      });
      setApplications(data);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [statusFilter, gradeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApps();
  };

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    setIsUpdating(true);
    try {
      const updated = await api.updateApplicationStatus(id, newStatus);
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
      if (viewingApp?.id === id) {
        setViewingApp(updated);
      }
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to update application status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingApp) return;
    try {
      await api.deleteApplication(deletingApp.id);
      setApplications((prev) => prev.filter((a) => a.id !== deletingApp.id));
      setDeletingApp(null);
      if (viewingApp?.id === deletingApp.id) {
        setViewingApp(null);
      }
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to delete application.');
    }
  };

  const exportCSV = () => {
    if (applications.length === 0) {
      alert('No application records to export.');
      return;
    }

    const headers = [
      'Reference Number',
      'Student Name',
      'Applying Grade',
      'Date of Birth',
      'Gender',
      'Guardian Name',
      'Guardian Phone',
      'Guardian Email',
      'Residential Address',
      'Emergency Contact',
      'Previous School',
      'Status',
      'Submitted Date',
    ];

    const rows = applications.map((a) => [
      `"${a.referenceNumber}"`,
      `"${a.firstName} ${a.middleName ? a.middleName + ' ' : ''}${a.lastName}"`,
      `"${a.applyingGrade}"`,
      `"${a.dateOfBirth}"`,
      `"${a.gender}"`,
      `"${a.guardianName}"`,
      `"${a.guardianPhone}"`,
      `"${a.guardianEmail}"`,
      `"${a.address.replace(/"/g, '""')}"`,
      `"${a.emergencyContact.replace(/"/g, '""')}"`,
      `"${(a.previousSchool || '').replace(/"/g, '""')}"`,
      `"${a.status}"`,
      `"${new Date(a.createdAt).toLocaleString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `albright-admissions-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f2444] font-display">
            Admission Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review, evaluate, and track student enrolment submissions from KG1 through Grade 8.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            icon={<Download className="w-4 h-4" />}
          >
            Export to CSV
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, guardian, or reference number..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Grade filter */}
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
          >
            <option value="All">All Grades</option>
            <option value="KG1">KG1</option>
            <option value="KG2">KG2</option>
            <option value="KG3">KG3</option>
            <option value="Grade 1">Grade 1</option>
            <option value="Grade 2">Grade 2</option>
            <option value="Grade 3">Grade 3</option>
            <option value="Grade 4">Grade 4</option>
            <option value="Grade 5">Grade 5</option>
            <option value="Grade 6">Grade 6</option>
            <option value="Grade 7">Grade 7</option>
            <option value="Grade 8">Grade 8</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-2xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4">Reference</th>
                <th className="px-5 py-4">Student Name</th>
                <th className="px-5 py-4">Grade</th>
                <th className="px-5 py-4">Parent / Guardian</th>
                <th className="px-5 py-4">Contact Phone</th>
                <th className="px-5 py-4">Date Submitted</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    Loading applications...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    No admission applications found matching the selected filters.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-[#0f2444]">
                      {app.referenceNumber}
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#0f2444]">
                      {app.firstName} {app.lastName}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 font-bold text-slate-800 text-xs">
                        {app.applyingGrade}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-700">{app.guardianName}</td>
                    <td className="px-5 py-4 text-slate-600 font-mono text-xs">
                      {app.guardianPhone}
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleStatusChange(app.id, e.target.value as ApplicationStatus)
                        }
                        disabled={isUpdating}
                        className="text-2xs font-bold rounded-lg border border-slate-200 px-2 py-1 bg-white cursor-pointer"
                      >
                        <option value="New">New</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => setViewingApp(app)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-[#0f2444] hover:bg-slate-100 transition-colors cursor-pointer"
                        title="View Full Application"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingApp(app)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW FULL DETAILS MODAL */}
      {viewingApp && (
        <Modal
          isOpen={true}
          onClose={() => setViewingApp(null)}
          title={`Admission Application: ${viewingApp.referenceNumber}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Status & Actions bar */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Current Status:
                </span>
                <StatusBadge status={viewingApp.status} />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600">Update to:</span>
                {(['New', 'Reviewing', 'Accepted', 'Rejected'] as ApplicationStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(viewingApp.id, st)}
                      disabled={viewingApp.status === st}
                      className={`text-2xs font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        viewingApp.status === st
                          ? 'bg-[#0f2444] text-white opacity-50'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Student details grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3">
                Student Profile
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-white border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Full Name</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {viewingApp.firstName} {viewingApp.middleName} {viewingApp.lastName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Applying Grade</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {viewingApp.applyingGrade}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Date of Birth & Gender</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {viewingApp.dateOfBirth} ({viewingApp.gender})
                  </span>
                </div>
                <div className="sm:col-span-3">
                  <span className="text-slate-400 block mb-0.5">Previous School</span>
                  <span className="text-slate-700">
                    {viewingApp.previousSchool || 'None / First-time enrollment'}
                  </span>
                </div>
              </div>
            </div>

            {/* Guardian & Emergency details */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3">
                Parent / Guardian & Contacts
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Guardian Name</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {viewingApp.guardianName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Phone Number</span>
                  <span className="font-mono text-slate-800 font-bold text-sm">
                    {viewingApp.guardianPhone}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Email Address</span>
                  <span className="text-slate-700">{viewingApp.guardianEmail}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Emergency Contact</span>
                  <span className="text-slate-700">{viewingApp.emergencyContact}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block mb-0.5">Residential Address</span>
                  <span className="text-slate-700">{viewingApp.address}</span>
                </div>
              </div>
            </div>

            {/* Additional info */}
            {viewingApp.additionalInformation && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
                  Special Notes / Accommodations
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {viewingApp.additionalInformation}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setViewingApp(null)}>
                Close Window
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingApp && (
        <Modal
          isOpen={true}
          onClose={() => setDeletingApp(null)}
          title="Confirm Application Deletion"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <p className="font-bold">Are you sure you want to delete this application?</p>
                <p className="mt-1">
                  This will permanently delete reference{' '}
                  <span className="font-mono font-bold">{deletingApp.referenceNumber}</span> for{' '}
                  <strong>
                    {deletingApp.firstName} {deletingApp.lastName}
                  </strong>{' '}
                  from the system.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setDeletingApp(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Permanently Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
