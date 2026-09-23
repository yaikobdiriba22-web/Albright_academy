// Albright Academy Shared Types

export type UserRole = 'TEACHER' | 'PARENT' | 'STUDENT' | 'ADMIN';

export interface PortalUser {
  id: string;
  fullName: string;
  username: string; // unique, e.g. "teacher.alem" or "parent.dawit"
  email?: string;
  role: UserRole;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt?: string;
  // Role-specific fields
  // For Teacher:
  employeeId?: string;
  phone?: string;
  assignedGrades?: string[]; // e.g. ["Grade 3", "Grade 4"]
  subjects?: string[]; // e.g. ["Mathematics", "Science"]
  // For Parent:
  studentName?: string;
  studentReference?: string;
  studentGrade?: string;
  relationship?: string; // "Father" | "Mother" | "Guardian"
  address?: string;
  // For Student:
  enrolledGrade?: string;
  section?: string;
  guardianName?: string;
  guardianPhone?: string;
  gender?: 'Male' | 'Female' | string;
  dateOfBirth?: string;
  // Optional credential hint for administrative issuance slip
  plainPasswordHint?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export type ApplicationStatus = 'New' | 'Reviewing' | 'Accepted' | 'Rejected';

export interface AdmissionApplication {
  id: string;
  referenceNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  applyingGrade: string; // e.g. "KG1", "KG2", "KG3", "Grade 1" ... "Grade 8"
  previousSchool?: string;
  guardianName: string;
  guardianRelationship?: string;
  guardianPhone: string;
  guardianEmail: string;
  address: string;
  emergencyContact: string;
  additionalInformation?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export type NewsStatus = 'Draft' | 'Published';

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category?: string;
  summary: string;
  content: string;
  imageUrl: string;
  author: string;
  status: NewsStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type EventStatus = 'Upcoming' | 'Completed' | 'Cancelled';

export interface SchoolEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "09:00 AM"
  endTime: string; // e.g. "02:00 PM"
  location: string;
  imageUrl?: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export type GalleryCategory =
  | 'All'
  | 'School'
  | 'Classrooms'
  | 'Students'
  | 'Events'
  | 'Sports'
  | 'Activities';

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: GalleryCategory;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  status?: 'Unread' | 'Read';
  createdAt: string;
  updatedAt: string;
}

export interface SchoolSettings {
  id: string;
  schoolName: string;
  slogan: string;
  logoUrl: string;
  phone: string;
  email: string;
  address: string;
  mapsUrl: string;
  latitude: number;
  longitude: number;
  facebookUrl: string;
  telegramUrl: string;
  youtubeUrl: string;
  facebook?: string;
  telegram?: string;
  youtube?: string;
  mission: string;
  vision: string;
  about: string;
  principalName: string;
  principalRole: string;
  principalMessage: string;
  principalPhotoUrl: string;
  // Moving Announcement Banner / Animation (Created and Managed by Admin)
  tickerEnabled?: boolean;
  tickerText?: string;
  tickerBadge?: string;
  tickerSubtext?: string;
  tickerSecondaryText?: string;
  tickerSpeed?: 'fast' | 'normal' | 'slow';
  tickerCreatedBy?: string;
  tickerUpdatedAt?: string;
  updatedAt: string;
}

export interface AcademicLevel {
  id: string;
  title: string;
  subtitle: string;
  grades: string[];
  description: string;
  focusAreas: string[];
  imageUrl: string;
}

export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  publishedNews: number;
  upcomingEvents: number;
  unreadMessages: number;
  totalGalleryImages: number;
}

// ---------------------------------------------------------------------------
// SCHOOL MANAGEMENT SYSTEM (SMS) CORE DOMAIN MODELS
// ---------------------------------------------------------------------------

export interface AcademicClass {
  id: string;
  name: string; // e.g. "KG1", "Grade 1", ..., "Grade 8"
  gradeLevel: number; // 0 for KG, 1..8
  sections?: ClassSection[];
  createdAt: string;
}

export interface ClassSection {
  id: string;
  classId: string;
  className?: string;
  name: string; // "A", "B", "C"
  roomNumber?: string;
  classTeacherId?: string;
  classTeacherName?: string;
  studentCount?: number;
}

export interface CurriculumSubject {
  id: string;
  code: string; // e.g. "MATH-G4"
  name: string; // e.g. "Mathematics", "Afaan Oromoo", "Amharic"
  description?: string;
  gradeLevels: number[];
}

export interface StudentProfile {
  id: string;
  userId: string;
  studentCode: string; // e.g. "ALB-STU-2026-001"
  fullName: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  classId: string;
  className?: string;
  sectionId: string;
  sectionName?: string;
  parentId?: string;
  parentName?: string;
  guardianName: string;
  guardianPhone: string;
  status: 'Active' | 'Transferred' | 'Graduated';
  createdAt: string;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  teacherCode: string; // e.g. "ALB-TEA-001"
  fullName: string;
  email: string;
  phone: string;
  qualification: string;
  assignedClassIds: string[]; // Class IDs
  assignedSubjectIds: string[]; // Subject IDs
  createdAt: string;
}

export interface ParentProfile {
  id: string;
  userId: string;
  fullName: string;
  relationship: string; // "Father", "Mother", "Guardian"
  phone: string;
  email?: string;
  address?: string;
  studentIds: string[];
  students?: StudentProfile[];
  createdAt: string;
}

export interface StudentEnrollment {
  id: string;
  studentId: string;
  studentName?: string;
  studentCode?: string;
  classId: string;
  className?: string;
  sectionId: string;
  sectionName?: string;
  academicYear: string;
  status: 'Active' | 'Completed' | 'Transferred';
  createdAt: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  studentCode?: string;
  classId: string;
  className?: string;
  sectionId: string;
  sectionName?: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
  markedBy: string;
  createdAt: string;
}

export interface CourseAssignment {
  id: string;
  teacherId: string;
  teacherName?: string;
  classId: string;
  className?: string;
  sectionId?: string;
  sectionName?: string;
  subjectId: string;
  subjectName?: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  maxPoints: number;
  createdAt: string;
}

export interface SchoolExam {
  id: string;
  title: string;
  classId: string;
  className?: string;
  subjectId: string;
  subjectName?: string;
  term: string; // "Term 1", "Term 2", "Midterm", "Final"
  date: string; // YYYY-MM-DD
  maxMarks: number;
  createdAt: string;
}

export interface AcademicResult {
  id: string;
  examId: string;
  examTitle?: string;
  studentId: string;
  studentName?: string;
  studentCode?: string;
  subjectId: string;
  subjectName?: string;
  classId: string;
  className?: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  grade: string; // "A+", "A", "B+", "B", "C", "D", "F"
  remarks?: string;
  enteredBy: string;
  updatedAt: string;
}

export interface SchoolFee {
  id: string;
  title: string; // e.g. "Term 1 Tuition 2026"
  feeType: 'Tuition' | 'Registration' | 'Uniform' | 'Transport' | 'Materials';
  classId?: string; // Optional class filter
  className?: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  createdAt: string;
}

export interface TuitionPayment {
  id: string;
  feeId: string;
  feeTitle?: string;
  studentId: string;
  studentName?: string;
  studentCode?: string;
  parentId?: string;
  amountPaid: number;
  totalFeeAmount?: number;
  receiptNumber: string; // e.g. "REC-2026-084"
  paymentMethod: 'Telebirr' | 'CBE Birr' | 'Bank Transfer' | 'Cash';
  paymentDate: string;
  status: 'Completed' | 'Pending' | 'Verified';
}

export interface SchoolAnnouncement {
  id: string;
  title: string;
  content: string;
  targetAudience: 'ALL' | 'TEACHERS' | 'PARENTS' | 'STUDENTS';
  isPinned: boolean;
  author: string;
  publishedAt: string;
  createdAt: string;
}

