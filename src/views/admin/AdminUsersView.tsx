import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Shield,
  Briefcase,
  GraduationCap,
  BookOpen,
  KeyRound,
  Copy,
  Check,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  Phone,
  Mail,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  School,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Calendar,
  User,
} from 'lucide-react';
import { PortalUser, UserRole } from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { Button } from '../../components/ui/Button.tsx';

interface AdminUsersViewProps {
  onDataChanged?: () => void;
}

const AVAILABLE_GRADES = [
  'KG1',
  'KG2',
  'KG3',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
];

const PRESET_SUBJECTS = [
  'Mathematics',
  'English Language',
  'Amharic (አማርኛ)',
  'Afaan Oromoo',
  'General Science',
  'Social Studies',
  'ICT & Robotics',
  'Physical Education',
  'Art & Music',
];

const SECTIONS = ['A', 'B', 'C', 'D'];

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({ onDataChanged }) => {
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'TEACHER' | 'PARENT' | 'STUDENT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<PortalUser | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formRole, setFormRole] = useState<'TEACHER' | 'PARENT' | 'STUDENT'>('TEACHER');
  const [formFullName, setFormFullName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStatus, setFormStatus] = useState<'ACTIVE' | 'SUSPENDED'>('ACTIVE');

  // Teacher specific form fields
  const [formEmployeeId, setFormEmployeeId] = useState('');
  const [formAssignedGrades, setFormAssignedGrades] = useState<string[]>([]);
  const [formSubjects, setFormSubjects] = useState<string[]>([]);

  // Parent specific form fields
  const [formStudentName, setFormStudentName] = useState('');
  const [formStudentGrade, setFormStudentGrade] = useState('');
  const [formStudentRef, setFormStudentRef] = useState('');
  const [formRelationship, setFormRelationship] = useState('Father');
  const [formAddress, setFormAddress] = useState('');

  // Student specific form fields
  const [formEnrolledGrade, setFormEnrolledGrade] = useState('Grade 4');
  const [formSection, setFormSection] = useState('A');
  const [formGuardianName, setFormGuardianName] = useState('');
  const [formGuardianPhone, setFormGuardianPhone] = useState('');
  const [formGender, setFormGender] = useState<'Male' | 'Female'>('Male');
  const [formDateOfBirth, setFormDateOfBirth] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers({
        role: roleFilter,
        search: searchQuery,
      });
      setUsers(data);
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to load user accounts.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers();
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormPassword(result);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormRole('TEACHER');
    setFormFullName('');
    setFormUsername('');
    setFormPassword('');
    setFormEmail('');
    setFormPhone('');
    setFormStatus('ACTIVE');
    setFormEmployeeId('');
    setFormAssignedGrades([]);
    setFormSubjects([]);
    setFormStudentName('');
    setFormStudentGrade('');
    setFormStudentRef('');
    setFormRelationship('Father');
    setFormAddress('');
    setFormEnrolledGrade('Grade 4');
    setFormSection('A');
    setFormGuardianName('');
    setFormGuardianPhone('');
    setFormGender('Male');
    setFormDateOfBirth('');
    setShowPassword(false);
  };

  const openCreateModal = (role: 'TEACHER' | 'PARENT' | 'STUDENT' = 'TEACHER') => {
    resetForm();
    setFormRole(role);
    handleGeneratePassword();
    setIsModalOpen(true);
  };

  const openEditModal = (user: PortalUser) => {
    setEditingUser(user);
    const resolvedRole = (user.role === 'TEACHER' || user.role === 'PARENT' || user.role === 'STUDENT')
      ? user.role
      : 'TEACHER';
    setFormRole(resolvedRole);
    setFormFullName(user.fullName);
    setFormUsername(user.username);
    setFormPassword(user.plainPasswordHint || '');
    setFormEmail(user.email || '');
    setFormPhone(user.phone || '');
    setFormStatus(user.status);

    // Teacher
    setFormEmployeeId(user.employeeId || '');
    setFormAssignedGrades(user.assignedGrades || []);
    setFormSubjects(user.subjects || []);

    // Parent
    setFormStudentName(user.studentName || '');
    setFormStudentGrade(user.studentGrade || '');
    setFormStudentRef(user.studentReference || '');
    setFormRelationship(user.relationship || 'Father');
    setFormAddress(user.address || '');

    // Student
    setFormEnrolledGrade(user.enrolledGrade || user.studentGrade || 'Grade 4');
    setFormSection(user.section || 'A');
    setFormGuardianName(user.guardianName || '');
    setFormGuardianPhone(user.guardianPhone || '');
    setFormGender((user.gender as 'Male' | 'Female') || 'Male');
    setFormDateOfBirth(user.dateOfBirth || '');

    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleGradeToggle = (grade: string) => {
    setFormAssignedGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );
  };

  const handleSubjectToggle = (subj: string) => {
    setFormSubjects((prev) =>
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formFullName.trim()) {
      showToast('Please enter the user full name.', 'error');
      return;
    }
    if (!formUsername.trim()) {
      showToast('Please enter a username.', 'error');
      return;
    }
    if (!editingUser && (!formPassword || formPassword.length < 6)) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const payload: any = {
        fullName: formFullName.trim(),
        username: formUsername.trim().toLowerCase(),
        role: formRole,
        email: formEmail.trim() || undefined,
        phone: formPhone.trim() || undefined,
        status: formStatus,
      };

      if (formPassword.trim()) {
        payload.password = formPassword.trim();
      }

      if (formRole === 'TEACHER') {
        payload.employeeId = formEmployeeId.trim() || undefined;
        payload.assignedGrades = formAssignedGrades;
        payload.subjects = formSubjects;
      } else if (formRole === 'PARENT') {
        payload.studentName = formStudentName.trim() || undefined;
        payload.studentGrade = formStudentGrade.trim() || undefined;
        payload.studentReference = formStudentRef.trim() || undefined;
        payload.relationship = formRelationship;
        payload.address = formAddress.trim() || undefined;
      } else if (formRole === 'STUDENT') {
        payload.enrolledGrade = formEnrolledGrade || undefined;
        payload.studentGrade = formEnrolledGrade || undefined;
        payload.section = formSection || undefined;
        payload.studentReference = formStudentRef.trim() || undefined;
        payload.guardianName = formGuardianName.trim() || undefined;
        payload.guardianPhone = formGuardianPhone.trim() || undefined;
        payload.gender = formGender;
        payload.dateOfBirth = formDateOfBirth || undefined;
      }

      if (editingUser) {
        await api.updateUser(editingUser.id, payload);
        showToast(`User @${payload.username} updated successfully.`);
      } else {
        await api.createUser(payload);
        const roleLabel = formRole === 'TEACHER' ? 'Teacher' : formRole === 'PARENT' ? 'Parent' : 'Student';
        showToast(`${roleLabel} account for "@${payload.username}" created successfully!`);
      }

      setIsModalOpen(false);
      resetForm();
      loadUsers();
      onDataChanged?.();
    } catch (err: any) {
      showToast(err.message || 'Operation failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await api.deleteUser(id);
      showToast('User account deleted successfully.');
      setDeleteConfirmId(null);
      loadUsers();
      onDataChanged?.();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete user.', 'error');
    }
  };

  const handleCopyCredentials = (user: PortalUser) => {
    const roleTitle = user.role === 'TEACHER' ? 'Teacher' : user.role === 'PARENT' ? 'Parent' : 'Student';
    const loginUrl = `${window.location.origin}/portal`;
    const passwordText = user.plainPasswordHint || '[Encrypted Password]';

    let extraInfo = '';
    if (user.role === 'TEACHER') {
      extraInfo = `Employee ID: ${user.employeeId || 'N/A'}\nAssigned Grades: ${(user.assignedGrades || []).join(', ') || 'N/A'}`;
    } else if (user.role === 'PARENT') {
      extraInfo = `Enrolled Child: ${user.studentName || 'N/A'} (${user.studentGrade || 'Grade 4'})\nAdmission Ref: ${user.studentReference || 'N/A'}`;
    } else if (user.role === 'STUDENT') {
      extraInfo = `Grade & Section: ${user.enrolledGrade || user.studentGrade || 'Grade 4'} ${user.section ? `(${user.section})` : ''}\nStudent ID/Ref: ${user.studentReference || 'N/A'}\nGuardian: ${user.guardianName || 'N/A'}`;
    }

    const slip = `==============================
ALBRIGHT ACADEMY
${roleTitle.toUpperCase()} PORTAL ACCESS CREDENTIALS
==============================
Name: ${user.fullName}
Role: ${roleTitle}
Username: @${user.username}
Password: ${passwordText}
${extraInfo}
Portal URL: ${loginUrl}
------------------------------
For security, please keep these credentials private.
Office Phone: 0923014132
Location: Sheggar city, Gefarsa Gujjee, kella
==============================`;

    navigator.clipboard.writeText(slip);
    setCopiedId(user.id);
    showToast(`Credentials slip for ${user.fullName} copied to clipboard!`);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const totalTeachers = users.filter((u) => u.role === 'TEACHER').length;
  const totalParents = users.filter((u) => u.role === 'PARENT').length;
  const totalStudents = users.filter((u) => u.role === 'STUDENT').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between shadow-lg border text-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2.5 font-medium">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:bg-black/5 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
            <Shield className="w-4 h-4" />
            <span>Role-Based User Administration</span>
          </div>
          <h2 className="text-2xl font-black text-[#0f2444] font-display mt-1">
            Teacher, Parent & Student Accounts
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Provision distinct role credentials for faculty instructors, student guardians, and enrolled scholars.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Add Student Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => openCreateModal('STUDENT')}
            className="flex items-center gap-1.5 cursor-pointer border-emerald-300 text-emerald-800 hover:bg-emerald-50"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>+ Add Student</span>
          </Button>

          {/* Add Parent Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => openCreateModal('PARENT')}
            className="flex items-center gap-1.5 cursor-pointer border-amber-300 text-amber-800 hover:bg-amber-50"
          >
            <GraduationCap className="w-4 h-4 text-amber-600" />
            <span>+ Add Parent</span>
          </Button>

          {/* Add Teacher Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => openCreateModal('TEACHER')}
            className="flex items-center gap-1.5 cursor-pointer bg-[#0f2444] hover:bg-[#16335d] text-amber-400 font-bold"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Teacher</span>
          </Button>
        </div>
      </div>

      {/* Stats Summary - 4 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#0f2444] font-display">{users.length}</div>
            <div className="text-xs font-medium text-slate-500">Total Accounts</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-blue-700 font-display">{totalTeachers}</div>
            <div className="text-xs font-medium text-slate-500">Faculty Teachers</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-700 font-display">{totalParents}</div>
            <div className="text-xs font-medium text-slate-500">Parent Guardians</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700 font-display">{totalStudents}</div>
            <div className="text-xs font-medium text-slate-500">Enrolled Students</div>
          </div>
        </div>
      </div>

      {/* Toolbar: Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Role Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto">
          <button
            type="button"
            onClick={() => setRoleFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Accounts ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('TEACHER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              roleFilter === 'TEACHER'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-700'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Teachers ({totalTeachers})</span>
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('PARENT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              roleFilter === 'PARENT'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Parents ({totalParents})</span>
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('STUDENT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              roleFilter === 'STUDENT'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Students ({totalStudents})</span>
          </button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, username, grade, ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
            />
          </div>
          <button
            type="button"
            onClick={loadUsers}
            title="Refresh list"
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </form>
      </div>

      {/* User Accounts List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-[#0f2444]" />
            <p className="text-sm font-medium">Loading user accounts...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No user accounts found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Get started by creating credentials for a Teacher, Parent, or Student.
            </p>
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openCreateModal('STUDENT')}
                className="cursor-pointer border-emerald-300 text-emerald-800"
              >
                + Add Student
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => openCreateModal('TEACHER')}
                className="bg-[#0f2444] text-amber-400 cursor-pointer"
              >
                + Add Teacher
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">User & Role</th>
                  <th className="py-3.5 px-4">Login Username</th>
                  <th className="py-3.5 px-4">Role Details & Class Linkage</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const isTeacher = u.role === 'TEACHER';
                  const isParent = u.role === 'PARENT';
                  const isStudent = u.role === 'STUDENT';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Name & Role */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                              isTeacher
                                ? 'bg-blue-100 text-blue-800'
                                : isParent
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isTeacher ? (
                              <Briefcase className="w-4 h-4" />
                            ) : isParent ? (
                              <GraduationCap className="w-4 h-4" />
                            ) : (
                              <BookOpen className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{u.fullName}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  isTeacher
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : isParent
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                }`}
                              >
                                {u.role}
                              </span>
                              {u.employeeId && (
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ID: {u.employeeId}
                                </span>
                              )}
                              {isStudent && u.studentReference && (
                                <span className="text-[10px] text-emerald-700 font-mono font-medium">
                                  Ref: {u.studentReference}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-md inline-block">
                          @{u.username}
                        </div>
                        {u.plainPasswordHint && (
                          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                            <span>Key:</span>
                            <span className="font-semibold text-slate-600">
                              {u.plainPasswordHint}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Assigned Info */}
                      <td className="py-3.5 px-4">
                        {isTeacher && (
                          <div className="space-y-1">
                            {u.assignedGrades && u.assignedGrades.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {u.assignedGrades.map((g) => (
                                  <span
                                    key={g}
                                    className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-medium"
                                  >
                                    {g}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">No grade assigned</span>
                            )}
                            {u.subjects && u.subjects.length > 0 && (
                              <div className="text-[11px] text-slate-500 truncate max-w-xs">
                                {u.subjects.join(', ')}
                              </div>
                            )}
                          </div>
                        )}

                        {isParent && (
                          <div className="space-y-0.5">
                            <div className="font-medium text-slate-800">
                              Child: {u.studentName || 'Not specified'}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Grade: {u.studentGrade || '—'}
                              {u.studentReference && ` (${u.studentReference})`}
                            </div>
                          </div>
                        )}

                        {isStudent && (
                          <div className="space-y-0.5">
                            <div className="font-semibold text-emerald-950">
                              {u.enrolledGrade || u.studentGrade || 'Grade 4'}
                              {u.section ? ` — Section ${u.section}` : ''}
                            </div>
                            {u.guardianName && (
                              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                <span>Guardian: {u.guardianName}</span>
                                {u.guardianPhone && (
                                  <span className="font-mono text-[10px] text-slate-400">
                                    ({u.guardianPhone})
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 text-slate-600">
                        {u.phone && (
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{u.phone}</span>
                          </div>
                        )}
                        {u.email && (
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] truncate max-w-xs mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{u.email}</span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          {u.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Copy Credential Slip */}
                          <button
                            type="button"
                            onClick={() => handleCopyCredentials(u)}
                            title="Copy credentials slip to send to user"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50 transition-colors cursor-pointer"
                          >
                            {copiedId === u.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => openEditModal(u)}
                            title="Edit user details or reset password"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#0f2444] hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(u.id)}
                            title="Delete user"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Confirm Account Deletion</h3>
            <p className="text-xs text-slate-500 mt-2">
              Are you sure you want to permanently delete this user account? The user will no longer be able to log into their portal.
            </p>
            <div className="flex gap-2 justify-center mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmId(null)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleDeleteUser(deleteConfirmId)}
                className="bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-[#0f2444] text-white p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {editingUser ? 'Edit User Credentials' : 'Create New Portal Account'}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display mt-0.5">
                  {editingUser
                    ? `Update Account: ${editingUser.fullName}`
                    : `New ${
                        formRole === 'TEACHER'
                          ? 'Teacher'
                          : formRole === 'PARENT'
                          ? 'Parent'
                          : 'Student'
                      } Account`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Role Selector Tabs (Only allowed when creating) */}
              {!editingUser && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Account Role *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Teacher Role */}
                    <button
                      type="button"
                      onClick={() => setFormRole('TEACHER')}
                      className={`p-3 rounded-2xl border flex flex-col items-start gap-2 transition-all cursor-pointer ${
                        formRole === 'TEACHER'
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          formRole === 'TEACHER'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-xs">Teacher Role</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Grading, attendance & lesson plans
                        </div>
                      </div>
                    </button>

                    {/* Parent Role */}
                    <button
                      type="button"
                      onClick={() => setFormRole('PARENT')}
                      className={`p-3 rounded-2xl border flex flex-col items-start gap-2 transition-all cursor-pointer ${
                        formRole === 'PARENT'
                          ? 'border-amber-500 bg-amber-50/70 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          formRole === 'PARENT'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-xs">Parent Role</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Child report cards & tuition receipts
                        </div>
                      </div>
                    </button>

                    {/* Student Role */}
                    <button
                      type="button"
                      onClick={() => setFormRole('STUDENT')}
                      className={`p-3 rounded-2xl border flex flex-col items-start gap-2 transition-all cursor-pointer ${
                        formRole === 'STUDENT'
                          ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          formRole === 'STUDENT'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-xs">Student Scholar</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Class timetables, homework & marks
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Core Credentials Section */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-500" />
                  <span>Login Credentials</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={
                        formRole === 'TEACHER'
                          ? 'e.g. Teacher Alemayehu Tadesse'
                          : formRole === 'PARENT'
                          ? 'e.g. Dawit Bekele (Parent)'
                          : 'e.g. Abebe Dawit (Student)'
                      }
                      value={formFullName}
                      onChange={(e) => setFormFullName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0f2444] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Username * (for login)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                        @
                      </span>
                      <input
                        type="text"
                        required
                        placeholder={
                          formRole === 'TEACHER'
                            ? 'teacher.alem'
                            : formRole === 'PARENT'
                            ? 'parent.dawit'
                            : 'student.abebe'
                        }
                        value={formUsername}
                        onChange={(e) =>
                          setFormUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))
                        }
                        className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0f2444] font-mono bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        {editingUser ? 'New Password (Optional)' : 'Password *'}
                      </label>
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="text-[11px] font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Generate</span>
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required={!editingUser}
                        placeholder={
                          editingUser ? 'Leave blank to keep current' : 'Min 6 characters'
                        }
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        className="w-full pl-3 pr-10 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0f2444] font-mono bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Account Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as 'ACTIVE' | 'SUSPENDED')}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0f2444] bg-white"
                    >
                      <option value="ACTIVE">ACTIVE (Authorized to log in)</option>
                      <option value="SUSPENDED">SUSPENDED (Temporarily disabled)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 0911223344"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0f2444] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. user@example.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0f2444] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Role-Specific Fields */}
              {formRole === 'TEACHER' && (
                /* Teacher Details */
                <div className="border border-blue-200 bg-blue-50/30 p-4 rounded-2xl space-y-3">
                  <div className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>Teacher Role Details</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. EMP-T-2026-04"
                      value={formEmployeeId}
                      onChange={(e) => setFormEmployeeId(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>

                  {/* Assigned Grades Multi-select */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Assigned Grades (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {AVAILABLE_GRADES.map((grade) => {
                        const isSelected = formAssignedGrades.includes(grade);
                        return (
                          <button
                            key={grade}
                            type="button"
                            onClick={() => handleGradeToggle(grade)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {grade}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Teaching Subjects */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Teaching Subjects
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_SUBJECTS.map((subj) => {
                        const isSelected = formSubjects.includes(subj);
                        return (
                          <button
                            key={subj}
                            type="button"
                            onClick={() => handleSubjectToggle(subj)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {subj}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {formRole === 'PARENT' && (
                /* Parent Details */
                <div className="border border-amber-200 bg-amber-50/30 p-4 rounded-2xl space-y-3">
                  <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-amber-600" />
                    <span>Parent Role Details (Student Linkage)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Child's Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Abebe Dawit"
                        value={formStudentName}
                        onChange={(e) => setFormStudentName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Child's Grade / Section
                      </label>
                      <select
                        value={formStudentGrade}
                        onChange={(e) => setFormStudentGrade(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      >
                        <option value="">Select Grade Level</option>
                        {AVAILABLE_GRADES.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Student Reference #
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ALB-2026-0001"
                        value={formStudentRef}
                        onChange={(e) => setFormStudentRef(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Relationship to Student
                      </label>
                      <select
                        value={formRelationship}
                        onChange={(e) => setFormRelationship(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Guardian">Legal Guardian</option>
                        <option value="Relative">Other Relative</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Residential Address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sheggar City, Gefarsa Gujjee, Zone 3"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>
                </div>
              )}

              {formRole === 'STUDENT' && (
                /* Student Details */
                <div className="border border-emerald-200 bg-emerald-50/30 p-4 rounded-2xl space-y-3">
                  <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>Student Scholar Profile Details</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Enrolled Grade *
                      </label>
                      <select
                        value={formEnrolledGrade}
                        onChange={(e) => setFormEnrolledGrade(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                      >
                        {AVAILABLE_GRADES.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Section / Stream
                      </label>
                      <select
                        value={formSection}
                        onChange={(e) => setFormSection(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                      >
                        {SECTIONS.map((sec) => (
                          <option key={sec} value={sec}>
                            Section {sec}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Student Admission ID #
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ALB-2026-0001"
                        value={formStudentRef}
                        onChange={(e) => setFormStudentRef(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Gender
                      </label>
                      <div className="flex gap-2">
                        {['Male', 'Female'].map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setFormGender(g as 'Male' | 'Female')}
                            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              formGender === g
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white text-slate-700 border-slate-200'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formDateOfBirth}
                        onChange={(e) => setFormDateOfBirth(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Primary Guardian Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dawit Bekele"
                        value={formGuardianName}
                        onChange={(e) => setFormGuardianName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Guardian Emergency Phone
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 0922334455"
                        value={formGuardianPhone}
                        onChange={(e) => setFormGuardianPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={submitting}
                  className="bg-[#0f2444] text-amber-400 font-bold hover:bg-[#16335d] cursor-pointer"
                >
                  {submitting
                    ? 'Saving...'
                    : editingUser
                    ? 'Update Account'
                    : `Create ${
                        formRole === 'TEACHER'
                          ? 'Teacher'
                          : formRole === 'PARENT'
                          ? 'Parent'
                          : 'Student'
                      } Account`}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
