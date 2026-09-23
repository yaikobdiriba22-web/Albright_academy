import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  AdminUser,
  AdmissionApplication,
  NewsItem,
  SchoolEvent,
  GalleryImage,
  ContactMessage,
  SchoolSettings,
  PortalUser,
  AcademicClass,
  ClassSection,
  CurriculumSubject,
  StudentProfile,
  TeacherProfile,
  ParentProfile,
  StudentEnrollment,
  AttendanceRecord,
  CourseAssignment,
  SchoolExam,
  AcademicResult,
  SchoolFee,
  TuitionPayment,
  SchoolAnnouncement,
} from '../src/types/index.ts';

function resolveDataDir(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'albright_data');
  }
  return path.join(process.cwd(), 'data');
}

let activeDataDir = resolveDataDir();
let activeDbFile = path.join(activeDataDir, 'database.json');

export interface DatabaseSchema {
  admins: (AdminUser & { passwordHash: string })[];
  portalUsers: (PortalUser & { passwordHash: string })[];
  applications: AdmissionApplication[];
  news: NewsItem[];
  events: SchoolEvent[];
  gallery: GalleryImage[];
  messages: ContactMessage[];
  settings: SchoolSettings;
  // Core SMS Entities
  classes: AcademicClass[];
  sections: ClassSection[];
  subjects: CurriculumSubject[];
  students: StudentProfile[];
  teachers: TeacherProfile[];
  parents: ParentProfile[];
  enrollments: StudentEnrollment[];
  attendances: AttendanceRecord[];
  assignments: CourseAssignment[];
  exams: SchoolExam[];
  results: AcademicResult[];
  fees: SchoolFee[];
  payments: TuitionPayment[];
  announcements: SchoolAnnouncement[];
}

const DEFAULT_SETTINGS: SchoolSettings = {
  id: 'default',
  schoolName: 'Albright Academy',
  slogan: 'Center of Excellence and Innovation',
  logoUrl: '/logo.png',
  phone: '0923014132',
  email: 'dinigaatrading@gmail.com',
  address: 'Sheggar city, Gefarsa Gujjee, kella',
  mapsUrl: 'https://maps.google.com/?q=Sheggar+city+Gefarsa+Gujjee+kella',
  latitude: 9.0685,
  longitude: 38.6521,
  facebookUrl: 'https://facebook.com/albrightacademy',
  telegramUrl: 'https://t.me/albrightacademy',
  youtubeUrl: 'https://youtube.com/@albrightacademy',
  mission:
    'To foster an inspiring, technology-forward, and compassionate educational environment where every student from KG1 to Grade 8 develops critical thinking, strong character, innovative problem-solving, and a genuine passion for lifelong learning.',
  vision:
    'To be the premier school of excellence and innovation in East Africa, graduating confident, ethical, and forward-looking leaders equipped for an ever-changing world.',
  about:
    'Albright Academy is a distinguished independent day school serving young scholars from Kindergarten (KG1) through Junior Secondary (Grade 8). Founded on principles of academic rigor, technological empowerment, and holistic character formation, Albright Academy bridges contemporary educational pedagogy with hands-on experiential learning.',
  principalName: 'Dr. Helen Mengistu',
  principalRole: 'Principal & Head of School',
  principalMessage:
    'Welcome to Albright Academy! At Albright, every child is recognized as an inquisitive thinker and a future innovator. Our goal is to cultivate a secure, vibrant community where students feel cherished, encouraged to ask probing questions, and empowered to discover their distinct gifts. Together with dedicated educators and engaged parents, we prepare our scholars not just for secondary school, but for meaningful lives of impact.',
  principalPhotoUrl:
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  tickerEnabled: true,
  tickerText: 'Albright Academy — Center of Excellence and Innovation',
  tickerBadge: 'Created by Admin',
  tickerSubtext: 'Center of Excellence and Innovation • KG1 to Grade 8',
  tickerSecondaryText: 'Admissions Open 2026/2018 E.C. — Sheggar City, Gefarsa Gujjee, kella',
  tickerSpeed: 'normal',
  tickerCreatedBy: 'Admin',
  tickerUpdatedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function getInitialData(): DatabaseSchema {
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('ChangeMe123!', salt);
  const teacherPasswordHash = bcrypt.hashSync('Teacher123!', salt);
  const parentPasswordHash = bcrypt.hashSync('Parent123!', salt);
  const studentPasswordHash = bcrypt.hashSync('Student123!', salt);

  const initialClasses: AcademicClass[] = [
    { id: 'cls-kg1', name: 'KG1', gradeLevel: 0, createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 'cls-kg2', name: 'KG2', gradeLevel: 0, createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 'cls-kg3', name: 'KG3', gradeLevel: 0, createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 'cls-g1', name: 'Grade 1', gradeLevel: 1, createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 'cls-g2', name: 'Grade 2', gradeLevel: 2, createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 'cls-g3', name: 'Grade 3', gradeLevel: 3, createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 'cls-g4', name: 'Grade 4', gradeLevel: 4, createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 'cls-g5', name: 'Grade 5', gradeLevel: 5, createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 'cls-g6', name: 'Grade 6', gradeLevel: 6, createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 'cls-g7', name: 'Grade 7', gradeLevel: 7, createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 'cls-g8', name: 'Grade 8', gradeLevel: 8, createdAt: '2026-01-01T00:00:00.000Z' },
  ];

  const initialSections: ClassSection[] = [
    { id: 'sec-g4-a', classId: 'cls-g4', className: 'Grade 4', name: 'A', roomNumber: 'Room 201', classTeacherId: 'tch-1', classTeacherName: 'Teacher Alemayehu Tadesse', studentCount: 26 },
    { id: 'sec-g4-b', classId: 'cls-g4', className: 'Grade 4', name: 'B', roomNumber: 'Room 202', classTeacherId: 'tch-2', classTeacherName: 'Teacher Sara Mengistu', studentCount: 28 },
    { id: 'sec-g3-a', classId: 'cls-g3', className: 'Grade 3', name: 'A', roomNumber: 'Room 105', classTeacherId: 'tch-1', classTeacherName: 'Teacher Alemayehu Tadesse', studentCount: 25 },
    { id: 'sec-g3-b', classId: 'cls-g3', className: 'Grade 3', name: 'B', roomNumber: 'Room 106', studentCount: 24 },
    { id: 'sec-g7-a', classId: 'cls-g7', className: 'Grade 7', name: 'A', roomNumber: 'Room 301', studentCount: 30 },
    { id: 'sec-g8-a', classId: 'cls-g8', className: 'Grade 8', name: 'A', roomNumber: 'Room 302', studentCount: 32 },
  ];

  const initialSubjects: CurriculumSubject[] = [
    { id: 'sub-math', code: 'MATH-01', name: 'Mathematics', description: 'Arithmetic, Pre-Algebra, Geometry, and Computational Thinking', gradeLevels: [1, 2, 3, 4, 5, 6, 7, 8] },
    { id: 'sub-sci', code: 'SCI-01', name: 'Integrated Science', description: 'Biology, Environmental Studies, Chemistry & Physics basics', gradeLevels: [1, 2, 3, 4, 5, 6, 7, 8] },
    { id: 'sub-eng', code: 'ENG-01', name: 'English Language', description: 'Reading comprehension, creative writing, and grammar mechanics', gradeLevels: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
    { id: 'sub-amh', code: 'AMH-01', name: 'Amharic (አማርኛ)', description: 'National language literacy, composition, and literature', gradeLevels: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
    { id: 'sub-oro', code: 'ORO-01', name: 'Afaan Oromoo', description: 'Regional language literacy, oral storytelling, and grammar', gradeLevels: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
    { id: 'sub-ict', code: 'ICT-01', name: 'ICT & Junior Robotics', description: 'Digital citizenship, scratch programming, and hardware innovation', gradeLevels: [1, 2, 3, 4, 5, 6, 7, 8] },
    { id: 'sub-soc', code: 'SOC-01', name: 'Social Studies', description: 'Geography, Ethiopian Heritage, Civics, and Global Cultures', gradeLevels: [3, 4, 5, 6, 7, 8] },
    { id: 'sub-art', code: 'PVA-01', name: 'Performing & Visual Arts', description: 'Music theory, vocal choir, sketching, and traditional handicraft', gradeLevels: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
  ];

  const initialTeachers: TeacherProfile[] = [
    {
      id: 'tch-1',
      userId: 'usr-teacher-1',
      teacherCode: 'ALB-TEA-001',
      fullName: 'Teacher Alemayehu Tadesse',
      email: 'alemayehu.t@albrightacademy.edu',
      phone: '0911223344',
      qualification: 'B.Ed. in Mathematics & Natural Sciences (Addis Ababa University)',
      assignedClassIds: ['cls-g3', 'cls-g4'],
      assignedSubjectIds: ['sub-math', 'sub-sci'],
      createdAt: '2026-01-10T08:30:00.000Z',
    },
    {
      id: 'tch-2',
      userId: 'usr-teacher-2',
      teacherCode: 'ALB-TEA-002',
      fullName: 'Teacher Sara Mengistu',
      email: 'sara.mengistu@albrightacademy.edu',
      phone: '0933445566',
      qualification: 'M.Ed. in Language Pedagogy & Curriculum Design',
      assignedClassIds: ['cls-g4', 'cls-g5'],
      assignedSubjectIds: ['sub-eng', 'sub-amh', 'sub-oro'],
      createdAt: '2026-01-11T09:00:00.000Z',
    },
  ];

  const initialParents: ParentProfile[] = [
    {
      id: 'par-1',
      userId: 'usr-parent-1',
      fullName: 'Dawit Bekele',
      relationship: 'Father',
      phone: '0922334455',
      email: 'dawit.bekele@gmail.com',
      address: 'Sheggar City, Gefarsa Gujjee, Zone 3',
      studentIds: ['stu-1', 'stu-2'],
      createdAt: '2026-01-12T09:15:00.000Z',
    },
  ];

  const initialStudents: StudentProfile[] = [
    {
      id: 'stu-1',
      userId: 'usr-student-1',
      studentCode: 'ALB-STU-2026-001',
      fullName: 'Abebe Dawit',
      gender: 'Male',
      dateOfBirth: '2016-04-12',
      classId: 'cls-g4',
      className: 'Grade 4',
      sectionId: 'sec-g4-b',
      sectionName: 'B',
      parentId: 'par-1',
      parentName: 'Dawit Bekele',
      guardianName: 'Dawit Bekele',
      guardianPhone: '0922334455',
      status: 'Active',
      createdAt: '2026-01-14T10:00:00.000Z',
    },
    {
      id: 'stu-2',
      userId: 'usr-student-2',
      studentCode: 'ALB-STU-2026-002',
      fullName: 'Bethlehem Dawit',
      gender: 'Female',
      dateOfBirth: '2017-08-20',
      classId: 'cls-g3',
      className: 'Grade 3',
      sectionId: 'sec-g3-a',
      sectionName: 'A',
      parentId: 'par-1',
      parentName: 'Dawit Bekele',
      guardianName: 'Dawit Bekele',
      guardianPhone: '0922334455',
      status: 'Active',
      createdAt: '2026-01-14T10:15:00.000Z',
    },
    {
      id: 'stu-3',
      userId: 'usr-student-3',
      studentCode: 'ALB-STU-2026-003',
      fullName: 'Yonas Getachew',
      gender: 'Male',
      dateOfBirth: '2016-01-08',
      classId: 'cls-g4',
      className: 'Grade 4',
      sectionId: 'sec-g4-b',
      sectionName: 'B',
      guardianName: 'Getachew Assefa',
      guardianPhone: '0912445566',
      status: 'Active',
      createdAt: '2026-01-15T11:00:00.000Z',
    },
  ];

  const initialEnrollments: StudentEnrollment[] = [
    { id: 'enr-1', studentId: 'stu-1', studentName: 'Abebe Dawit', studentCode: 'ALB-STU-2026-001', classId: 'cls-g4', className: 'Grade 4', sectionId: 'sec-g4-b', sectionName: 'B', academicYear: '2025-2026 / 2018 E.C.', status: 'Active', createdAt: '2026-01-15T08:00:00.000Z' },
    { id: 'enr-2', studentId: 'stu-2', studentName: 'Bethlehem Dawit', studentCode: 'ALB-STU-2026-002', classId: 'cls-g3', className: 'Grade 3', sectionId: 'sec-g3-a', sectionName: 'A', academicYear: '2025-2026 / 2018 E.C.', status: 'Active', createdAt: '2026-01-15T08:00:00.000Z' },
    { id: 'enr-3', studentId: 'stu-3', studentName: 'Yonas Getachew', studentCode: 'ALB-STU-2026-003', classId: 'cls-g4', className: 'Grade 4', sectionId: 'sec-g4-b', sectionName: 'B', academicYear: '2025-2026 / 2018 E.C.', status: 'Active', createdAt: '2026-01-15T08:00:00.000Z' },
  ];

  const initialAttendances: AttendanceRecord[] = [
    { id: 'att-1', studentId: 'stu-1', studentName: 'Abebe Dawit', studentCode: 'ALB-STU-2026-001', classId: 'cls-g4', className: 'Grade 4', sectionId: 'sec-g4-b', sectionName: 'B', date: '2026-09-22', status: 'Present', remarks: 'Attentive and active in class discussions', markedBy: 'Teacher Alemayehu Tadesse', createdAt: '2026-09-22T08:15:00.000Z' },
    { id: 'att-2', studentId: 'stu-1', studentName: 'Abebe Dawit', studentCode: 'ALB-STU-2026-001', classId: 'cls-g4', className: 'Grade 4', sectionId: 'sec-g4-b', sectionName: 'B', date: '2026-09-21', status: 'Present', remarks: '', markedBy: 'Teacher Alemayehu Tadesse', createdAt: '2026-09-21T08:10:00.000Z' },
    { id: 'att-3', studentId: 'stu-1', studentName: 'Abebe Dawit', studentCode: 'ALB-STU-2026-001', classId: 'cls-g4', className: 'Grade 4', sectionId: 'sec-g4-b', sectionName: 'B', date: '2026-09-20', status: 'Late', remarks: 'Arrived 10 min late due to transport delay', markedBy: 'Teacher Alemayehu Tadesse', createdAt: '2026-09-20T08:25:00.000Z' },
    { id: 'att-4', studentId: 'stu-2', studentName: 'Bethlehem Dawit', studentCode: 'ALB-STU-2026-002', classId: 'cls-g3', className: 'Grade 3', sectionId: 'sec-g3-a', sectionName: 'A', date: '2026-09-22', status: 'Present', remarks: 'Good participation', markedBy: 'Teacher Alemayehu Tadesse', createdAt: '2026-09-22T08:12:00.000Z' },
    { id: 'att-5', studentId: 'stu-3', studentName: 'Yonas Getachew', studentCode: 'ALB-STU-2026-003', classId: 'cls-g4', className: 'Grade 4', sectionId: 'sec-g4-b', sectionName: 'B', date: '2026-09-22', status: 'Present', remarks: '', markedBy: 'Teacher Alemayehu Tadesse', createdAt: '2026-09-22T08:15:00.000Z' },
  ];

  const initialAssignments: CourseAssignment[] = [
    {
      id: 'asg-1',
      teacherId: 'tch-1',
      teacherName: 'Teacher Alemayehu Tadesse',
      classId: 'cls-g4',
      className: 'Grade 4',
      sectionId: 'sec-g4-b',
      sectionName: 'B',
      subjectId: 'sub-math',
      subjectName: 'Mathematics',
      title: 'Fractions & Real-World Decimal Word Problems',
      description: 'Solve questions 1 through 15 on page 84 of the Grade 4 Mathematics workbook. Show all work and steps clearly.',
      dueDate: '2026-09-28',
      maxPoints: 20,
      createdAt: '2026-09-21T09:30:00.000Z',
    },
    {
      id: 'asg-2',
      teacherId: 'tch-1',
      teacherName: 'Teacher Alemayehu Tadesse',
      classId: 'cls-g4',
      className: 'Grade 4',
      sectionId: 'sec-g4-b',
      sectionName: 'B',
      subjectId: 'sub-sci',
      subjectName: 'Integrated Science',
      title: 'Plant Photosynthesis Observation Journal',
      description: 'Document your bean seedling growth over 5 days. Record leaf count, stem length, and moisture levels.',
      dueDate: '2026-10-02',
      maxPoints: 25,
      createdAt: '2026-09-22T10:00:00.000Z',
    },
    {
      id: 'asg-3',
      teacherId: 'tch-2',
      teacherName: 'Teacher Sara Mengistu',
      classId: 'cls-g4',
      className: 'Grade 4',
      sectionId: 'sec-g4-b',
      sectionName: 'B',
      subjectId: 'sub-eng',
      subjectName: 'English Language',
      title: 'Creative Descriptive Paragraph: My Favorite Community Hero',
      description: 'Write a 150-word narrative using at least five descriptive adjectives and past continuous tense.',
      dueDate: '2026-09-30',
      maxPoints: 20,
      createdAt: '2026-09-22T11:00:00.000Z',
    },
  ];

  const initialExams: SchoolExam[] = [
    { id: 'exm-1', title: 'Semester 1 Midterm Exam — Mathematics', classId: 'cls-g4', className: 'Grade 4', subjectId: 'sub-math', subjectName: 'Mathematics', term: 'Term 1 Midterm', date: '2026-10-15', maxMarks: 100, createdAt: '2026-09-10T08:00:00.000Z' },
    { id: 'exm-2', title: 'Integrated Science Practical Assessment', classId: 'cls-g4', className: 'Grade 4', subjectId: 'sub-sci', subjectName: 'Integrated Science', term: 'Term 1 Midterm', date: '2026-10-18', maxMarks: 100, createdAt: '2026-09-10T08:00:00.000Z' },
    { id: 'exm-3', title: 'English Reading & Writing Comprehension Test', classId: 'cls-g4', className: 'Grade 4', subjectId: 'sub-eng', subjectName: 'English Language', term: 'Term 1 Midterm', date: '2026-10-20', maxMarks: 100, createdAt: '2026-09-10T08:00:00.000Z' },
  ];

  const initialResults: AcademicResult[] = [
    { id: 'res-1', examId: 'exm-1', examTitle: 'Semester 1 Midterm Exam — Mathematics', studentId: 'stu-1', studentName: 'Abebe Dawit', studentCode: 'ALB-STU-2026-001', subjectId: 'sub-math', subjectName: 'Mathematics', classId: 'cls-g4', className: 'Grade 4', marksObtained: 94, maxMarks: 100, percentage: 94, grade: 'A+', remarks: 'Exceptional mastery in fraction arithmetic and multi-step reasoning', enteredBy: 'Teacher Alemayehu Tadesse', updatedAt: '2026-09-22T14:00:00.000Z' },
    { id: 'res-2', examId: 'exm-2', examTitle: 'Integrated Science Practical Assessment', studentId: 'stu-1', studentName: 'Abebe Dawit', studentCode: 'ALB-STU-2026-001', subjectId: 'sub-sci', subjectName: 'Integrated Science', classId: 'cls-g4', className: 'Grade 4', marksObtained: 88, maxMarks: 100, percentage: 88, grade: 'A', remarks: 'Strong hypothesis testing and lab diagram accuracy', enteredBy: 'Teacher Alemayehu Tadesse', updatedAt: '2026-09-22T14:10:00.000Z' },
    { id: 'res-3', examId: 'exm-3', examTitle: 'English Reading & Writing Comprehension Test', studentId: 'stu-1', studentName: 'Abebe Dawit', studentCode: 'ALB-STU-2026-001', subjectId: 'sub-eng', subjectName: 'English Language', classId: 'cls-g4', className: 'Grade 4', marksObtained: 90, maxMarks: 100, percentage: 90, grade: 'A+', remarks: 'Impressive vocabulary and clear paragraph transitions', enteredBy: 'Teacher Sara Mengistu', updatedAt: '2026-09-22T14:20:00.000Z' },
    { id: 'res-4', examId: 'exm-1', examTitle: 'Semester 1 Midterm Exam — Mathematics', studentId: 'stu-3', studentName: 'Yonas Getachew', studentCode: 'ALB-STU-2026-003', subjectId: 'sub-math', subjectName: 'Mathematics', classId: 'cls-g4', className: 'Grade 4', marksObtained: 82, maxMarks: 100, percentage: 82, grade: 'B+', remarks: 'Good comprehension; revise long division steps', enteredBy: 'Teacher Alemayehu Tadesse', updatedAt: '2026-09-22T14:05:00.000Z' },
  ];

  const initialFees: SchoolFee[] = [
    { id: 'fee-1', title: 'Term 1 Tuition 2026 / 2018 E.C.', feeType: 'Tuition', amount: 12000, dueDate: '2026-10-10', createdAt: '2026-08-20T00:00:00.000Z' },
    { id: 'fee-2', title: 'STEM & Robotics Innovation Lab Fee', feeType: 'Materials', amount: 2500, dueDate: '2026-10-15', createdAt: '2026-08-20T00:00:00.000Z' },
    { id: 'fee-3', title: 'Official School Uniform & Sports Kit', feeType: 'Uniform', amount: 3500, dueDate: '2026-09-30', createdAt: '2026-08-20T00:00:00.000Z' },
  ];

  const initialPayments: TuitionPayment[] = [
    { id: 'pay-1', feeId: 'fee-1', feeTitle: 'Term 1 Tuition 2026 / 2018 E.C.', studentId: 'stu-1', studentName: 'Abebe Dawit', studentCode: 'ALB-STU-2026-001', parentId: 'par-1', amountPaid: 12000, totalFeeAmount: 12000, receiptNumber: 'REC-2026-0042', paymentMethod: 'Telebirr', paymentDate: '2026-09-05', status: 'Completed' },
    { id: 'pay-2', feeId: 'fee-2', feeTitle: 'STEM & Robotics Innovation Lab Fee', studentId: 'stu-1', studentName: 'Abebe Dawit', studentCode: 'ALB-STU-2026-001', parentId: 'par-1', amountPaid: 2500, totalFeeAmount: 2500, receiptNumber: 'REC-2026-0078', paymentMethod: 'CBE Birr', paymentDate: '2026-09-12', status: 'Completed' },
  ];

  const initialAnnouncements: SchoolAnnouncement[] = [
    {
      id: 'anc-1',
      title: 'First Semester Mid-Term Examination Schedule & Guidelines',
      content: 'The first semester midterm examinations for Grades 1 to 8 will be conducted from October 15 to October 22, 2026. Detailed timetable slips will be handed to all scholars. Morning review tutorials will be held daily from 7:45 AM.',
      targetAudience: 'ALL',
      isPinned: true,
      author: 'Academic Administration',
      publishedAt: '2026-09-20T08:00:00.000Z',
      createdAt: '2026-09-20T08:00:00.000Z',
    },
    {
      id: 'anc-2',
      title: 'Parent-Teacher Conference & Holistic Progress Review',
      content: 'We cordially invite all parents and guardians to our Term 1 consultation session on Saturday, October 24th from 8:30 AM to 1:00 PM. Discuss your child’s academic mastery, social adaptation, and individual learning targets directly with subject teachers.',
      targetAudience: 'PARENTS',
      isPinned: true,
      author: 'Office of the Principal',
      publishedAt: '2026-09-18T09:00:00.000Z',
      createdAt: '2026-09-18T09:00:00.000Z',
    },
    {
      id: 'anc-3',
      title: 'Faculty Continuous Professional Development Workshop',
      content: 'Reminder for all teaching staff: Friday afternoon will feature our collaborative workshop on "Differentiated Instruction in Bilingual Mathematics Classrooms" starting at 2:30 PM in the Media Lab.',
      targetAudience: 'TEACHERS',
      isPinned: false,
      author: 'Curriculum Directorate',
      publishedAt: '2026-09-15T14:00:00.000Z',
      createdAt: '2026-09-15T14:00:00.000Z',
    },
    {
      id: 'anc-4',
      title: 'Junior Robotics & Coding Club Sign-ups Open',
      content: 'Young inventors from Grades 3 to 8 are invited to join the 2026 Albright Robotics Club. Build your own obstacle-avoiding bot and prepare for the national inter-school tech challenge! Register at the ICT lab by Friday.',
      targetAudience: 'STUDENTS',
      isPinned: false,
      author: 'STEM Club Mentors',
      publishedAt: '2026-09-16T10:00:00.000Z',
      createdAt: '2026-09-16T10:00:00.000Z',
    },
  ];

  return {
    admins: [
      {
        id: 'admin-1',
        name: 'Academy Administrator',
        email: 'admin@albrightacademy.local',
        passwordHash: adminPasswordHash,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ],
    portalUsers: [
      {
        id: 'usr-teacher-1',
        fullName: 'Teacher Alemayehu Tadesse',
        username: 'teacher.alem',
        email: 'alemayehu.t@albrightacademy.edu',
        role: 'TEACHER',
        status: 'ACTIVE',
        employeeId: 'EMP-T-2024-012',
        phone: '0911223344',
        assignedGrades: ['Grade 3', 'Grade 4'],
        subjects: ['Mathematics', 'Science'],
        plainPasswordHint: 'Teacher123!',
        passwordHash: teacherPasswordHash,
        createdAt: '2026-01-10T08:30:00.000Z',
      },
      {
        id: 'usr-teacher-2',
        fullName: 'Teacher Sara Mengistu',
        username: 'teacher.sara',
        email: 'sara.mengistu@albrightacademy.edu',
        role: 'TEACHER',
        status: 'ACTIVE',
        employeeId: 'EMP-T-2024-015',
        phone: '0933445566',
        assignedGrades: ['Grade 4', 'Grade 5'],
        subjects: ['English', 'Amharic', 'Afaan Oromoo'],
        plainPasswordHint: 'Teacher123!',
        passwordHash: teacherPasswordHash,
        createdAt: '2026-01-11T09:00:00.000Z',
      },
      {
        id: 'usr-parent-1',
        fullName: 'Dawit Bekele',
        username: 'parent.dawit',
        email: 'dawit.bekele@gmail.com',
        role: 'PARENT',
        status: 'ACTIVE',
        phone: '0922334455',
        studentName: 'Abebe Dawit & Bethlehem Dawit',
        studentReference: 'ALB-STU-2026-001',
        studentGrade: 'Grade 4B / Grade 3A',
        relationship: 'Father',
        address: 'Sheggar City, Gefarsa Gujjee, Zone 3',
        plainPasswordHint: 'Parent123!',
        passwordHash: parentPasswordHash,
        createdAt: '2026-01-12T09:15:00.000Z',
      },
      {
        id: 'usr-student-1',
        fullName: 'Abebe Dawit',
        username: 'student.abebe',
        email: 'abebe.dawit@albright.student',
        role: 'STUDENT',
        status: 'ACTIVE',
        studentReference: 'ALB-STU-2026-001',
        enrolledGrade: 'Grade 4',
        section: 'B',
        guardianName: 'Dawit Bekele',
        guardianPhone: '0922334455',
        gender: 'Male',
        dateOfBirth: '2016-04-12',
        plainPasswordHint: 'Student123!',
        passwordHash: studentPasswordHash,
        createdAt: '2026-01-14T10:00:00.000Z',
      },
    ],
    classes: initialClasses,
    sections: initialSections,
    subjects: initialSubjects,
    teachers: initialTeachers,
    parents: initialParents,
    students: initialStudents,
    enrollments: initialEnrollments,
    attendances: initialAttendances,
    assignments: initialAssignments,
    exams: initialExams,
    results: initialResults,
    fees: initialFees,
    payments: initialPayments,
    announcements: initialAnnouncements,
    applications: [
      {
        id: 'app-1',
        referenceNumber: 'ALB-2026-0001',
        firstName: 'Dawit',
        middleName: 'Tadesse',
        lastName: 'Alemu',
        dateOfBirth: '2017-05-14',
        gender: 'Male',
        applyingGrade: 'Grade 3',
        previousSchool: 'Sunshine Academy',
        guardianName: 'Tadesse Alemu',
        guardianPhone: '+251 912 345 678',
        guardianEmail: 'tadesse.alemu@example.com',
        address: 'Bole, House 412, Addis Ababa',
        emergencyContact: '+251 911 002 233',
        additionalInformation: 'Interested in STEM club and swimming lessons.',
        status: 'Accepted',
        createdAt: '2026-03-01T10:00:00.000Z',
        updatedAt: '2026-03-05T14:30:00.000Z',
      },
    ],
    news: [
      {
        id: 'news-1',
        title: 'Albright Annual STEM & Robotics Expo 2026 Announced',
        slug: 'albright-annual-stem-robotics-expo-2026',
        summary: 'Students from Grade 1 to 8 will showcase interactive science prototypes, automated micro-garden projects, and junior programming achievements.',
        content: `We are proud to announce the annual Albright Academy STEM & Innovation Expo. This year, scholars across all primary and junior grade levels will present over 60 collaborative projects spanning sustainable technology, robotics, renewable energy experiments, and environmental science.`,
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
        author: 'Department of Science & Innovation',
        status: 'Published',
        publishedAt: '2026-03-12T08:00:00.000Z',
        createdAt: '2026-03-12T08:00:00.000Z',
        updatedAt: '2026-03-12T08:00:00.000Z',
      },
    ],
    events: [
      {
        id: 'ev-1',
        title: 'Term 1 Midterm Assessment Window',
        slug: 'term-1-midterm-assessments-2026',
        description: 'Comprehensive examinations and project evaluations across all subjects for KG3 to Grade 8.',
        date: '2026-10-15',
        startTime: '08:30 AM',
        endTime: '01:00 PM',
        location: 'All Academic Wings & Media Hub',
        imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1000&q=80',
        status: 'Upcoming',
        createdAt: '2026-03-10T10:00:00.000Z',
        updatedAt: '2026-03-10T10:00:00.000Z',
      },
    ],
    gallery: [
      {
        id: 'gal-1',
        title: 'Junior Robotics Lab Experimentation',
        description: 'Grade 6 scholars constructing micro-sensor circuits.',
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
        category: 'Classrooms',
        createdAt: '2026-01-15T10:00:00.000Z',
        updatedAt: '2026-01-15T10:00:00.000Z',
      },
    ],
    messages: [
      {
        id: 'msg-1',
        name: 'Martha Kebede',
        email: 'martha.kebede@example.com',
        phone: '+251 911 223 344',
        subject: 'Inquiry regarding Grade 1 Admissions for next September',
        message: 'Good day. I am seeking information regarding entrance assessments for our daughter.',
        isRead: false,
        createdAt: '2026-03-14T11:20:00.000Z',
        updatedAt: '2026-03-14T11:20:00.000Z',
      },
    ],
    settings: DEFAULT_SETTINGS,
  };
}

export function getDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(activeDataDir)) {
      fs.mkdirSync(activeDataDir, { recursive: true });
    }

    if (!fs.existsSync(activeDbFile)) {
      const seedFile = path.join(process.cwd(), 'data', 'database.json');
      if (fs.existsSync(seedFile)) {
        try {
          const rawSeed = fs.readFileSync(seedFile, 'utf-8');
          const parsedSeed = JSON.parse(rawSeed) as Partial<DatabaseSchema>;
          const initial = getInitialData();
          const merged: DatabaseSchema = {
            ...initial,
            ...parsedSeed,
            classes: parsedSeed.classes || initial.classes,
            sections: parsedSeed.sections || initial.sections,
            subjects: parsedSeed.subjects || initial.subjects,
            students: parsedSeed.students || initial.students,
            teachers: parsedSeed.teachers || initial.teachers,
            parents: parsedSeed.parents || initial.parents,
            enrollments: parsedSeed.enrollments || initial.enrollments,
            attendances: parsedSeed.attendances || initial.attendances,
            assignments: parsedSeed.assignments || initial.assignments,
            exams: parsedSeed.exams || initial.exams,
            results: parsedSeed.results || initial.results,
            fees: parsedSeed.fees || initial.fees,
            payments: parsedSeed.payments || initial.payments,
            announcements: parsedSeed.announcements || initial.announcements,
          };
          fs.writeFileSync(activeDbFile, JSON.stringify(merged, null, 2), 'utf-8');
          return merged;
        } catch {
          // fallback
        }
      }
      const initialData = getInitialData();
      try {
        fs.writeFileSync(activeDbFile, JSON.stringify(initialData, null, 2), 'utf-8');
      } catch {
        // Read-only filesystem fallback
      }
      return initialData;
    }

    const raw = fs.readFileSync(activeDbFile, 'utf-8');
    const data = JSON.parse(raw) as Partial<DatabaseSchema>;
    const defaultData = getInitialData();

    // Ensure all SMS arrays exist
    let needsSave = false;
    const requiredKeys: (keyof DatabaseSchema)[] = [
      'classes', 'sections', 'subjects', 'students', 'teachers', 'parents',
      'enrollments', 'attendances', 'assignments', 'exams', 'results',
      'fees', 'payments', 'announcements', 'portalUsers', 'admins', 'applications', 'news', 'events', 'gallery', 'messages'
    ];

    for (const key of requiredKeys) {
      if (!data[key] || !Array.isArray(data[key])) {
        (data as any)[key] = (defaultData as any)[key];
        needsSave = true;
      }
    }

    if (!data.settings) {
      data.settings = defaultData.settings;
      needsSave = true;
    }

    const fullData = data as DatabaseSchema;
    if (needsSave) {
      saveDb(fullData);
    }
    return fullData;
  } catch (err: any) {
    if (activeDataDir !== path.join('/tmp', 'albright_data')) {
      activeDataDir = path.join('/tmp', 'albright_data');
      activeDbFile = path.join(activeDataDir, 'database.json');
      return getDb();
    }
    console.error('Error reading database file, returning default data:', err);
    return getInitialData();
  }
}

export function saveDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(activeDataDir)) {
      fs.mkdirSync(activeDataDir, { recursive: true });
    }
    fs.writeFileSync(activeDbFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err: any) {
    if (activeDataDir !== path.join('/tmp', 'albright_data')) {
      activeDataDir = path.join('/tmp', 'albright_data');
      activeDbFile = path.join(activeDataDir, 'database.json');
      try {
        if (!fs.existsSync(activeDataDir)) {
          fs.mkdirSync(activeDataDir, { recursive: true });
        }
        fs.writeFileSync(activeDbFile, JSON.stringify(data, null, 2), 'utf-8');
      } catch (innerErr) {
        console.warn('Unable to persist to disk in serverless environment:', innerErr);
      }
    } else {
      console.warn('Unable to persist database:', err);
    }
  }
}

export function generateReferenceNumber(): string {
  const db = getDb();
  const year = new Date().getFullYear();
  const count = db.applications.length + 1;
  const padded = String(count).padStart(4, '0');
  return `ALB-${year}-${padded}`;
}

export function generateStudentCode(): string {
  const db = getDb();
  const year = new Date().getFullYear();
  const count = (db.students?.length || 0) + 1;
  const padded = String(count).padStart(3, '0');
  return `ALB-STU-${year}-${padded}`;
}

export function generateTeacherCode(): string {
  const db = getDb();
  const count = (db.teachers?.length || 0) + 1;
  const padded = String(count).padStart(3, '0');
  return `ALB-TEA-${padded}`;
}

export function generateReceiptNumber(): string {
  const db = getDb();
  const year = new Date().getFullYear();
  const count = (db.payments?.length || 0) + 1;
  const padded = String(count).padStart(4, '0');
  return `REC-${year}-${padded}`;
}
