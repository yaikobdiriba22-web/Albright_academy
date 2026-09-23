import { Router, Response } from 'express';
import {
  getDb,
  saveDb,
  generateStudentCode,
  generateTeacherCode,
  generateReceiptNumber,
} from './db.ts';
import {
  AuthenticatedRequest,
  authenticateAny,
  requireRoles,
} from './auth.ts';
import {
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

const router = Router();

// Apply universal authentication to all SMS API endpoints
router.use(authenticateAny);

// ---------------------------------------------------------------------------
// 1. AUTHENTICATED USER CONTEXT (/api/sms/me)
// ---------------------------------------------------------------------------
router.get('/me', (req: AuthenticatedRequest, res: Response) => {
  const user = req.authUser!;
  const db = getDb();

  let details: Record<string, any> = {};

  if (user.role === 'TEACHER') {
    const teacher = db.teachers?.find((t) => t.userId === user.id || t.id === user.id);
    const assignedClasses = db.classes?.filter((c) => teacher?.assignedClassIds?.includes(c.id)) || [];
    const assignedSubjects = db.subjects?.filter((s) => teacher?.assignedSubjectIds?.includes(s.id)) || [];
    details = {
      teacherProfile: teacher,
      assignedClasses,
      assignedSubjects,
    };
  } else if (user.role === 'PARENT') {
    const parent = db.parents?.find((p) => p.userId === user.id || p.id === user.id);
    const children = db.students?.filter((s) => parent?.studentIds?.includes(s.id) || s.parentId === parent?.id) || [];
    details = {
      parentProfile: parent,
      children,
    };
  } else if (user.role === 'STUDENT') {
    const student = db.students?.find((s) => s.userId === user.id || s.id === user.id);
    const enrolledClass = db.classes?.find((c) => c.id === student?.classId);
    const section = db.sections?.find((sec) => sec.id === student?.sectionId);
    details = {
      studentProfile: student,
      enrolledClass,
      section,
    };
  } else if (user.role === 'ADMIN') {
    details = {
      totalStudents: db.students?.length || 0,
      totalTeachers: db.teachers?.length || 0,
      totalParents: db.parents?.length || 0,
      totalClasses: db.classes?.length || 0,
    };
  }

  res.json({
    user,
    ...details,
  });
});

// ---------------------------------------------------------------------------
// 2. CLASSES & SECTIONS
// ---------------------------------------------------------------------------
router.get('/classes', (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const classesWithSections = (db.classes || []).map((cls) => {
    const sections = (db.sections || []).filter((s) => s.classId === cls.id);
    return {
      ...cls,
      sections,
    };
  });
  res.json(classesWithSections);
});

router.post('/classes', requireRoles(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { name, gradeLevel } = req.body;
  if (!name || gradeLevel === undefined) {
    res.status(400).json({ error: 'Class name and grade level are required' });
    return;
  }
  const db = getDb();
  const newClass: AcademicClass = {
    id: `cls-${Date.now()}`,
    name,
    gradeLevel: Number(gradeLevel),
    createdAt: new Date().toISOString(),
  };
  db.classes = db.classes || [];
  db.classes.push(newClass);
  saveDb(db);
  res.status(201).json(newClass);
});

router.put('/classes/:id', requireRoles(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, gradeLevel } = req.body;
  const db = getDb();
  const clsIndex = (db.classes || []).findIndex((c) => c.id === id);
  if (clsIndex === -1) {
    res.status(404).json({ error: 'Class not found' });
    return;
  }
  if (name) db.classes[clsIndex].name = name;
  if (gradeLevel !== undefined) db.classes[clsIndex].gradeLevel = Number(gradeLevel);
  saveDb(db);
  res.json(db.classes[clsIndex]);
});

router.delete('/classes/:id', requireRoles(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  db.classes = (db.classes || []).filter((c) => c.id !== id);
  db.sections = (db.sections || []).filter((s) => s.classId !== id);
  saveDb(db);
  res.json({ success: true, message: 'Class deleted successfully' });
});

router.get('/sections', (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const { classId } = req.query;
  let sections = db.sections || [];
  if (classId) {
    sections = sections.filter((s) => s.classId === classId);
  }
  res.json(sections);
});

router.post('/sections', requireRoles(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { classId, name, roomNumber, classTeacherId } = req.body;
  if (!classId || !name) {
    res.status(400).json({ error: 'Class ID and Section name (e.g. A, B) are required' });
    return;
  }
  const db = getDb();
  const cls = (db.classes || []).find((c) => c.id === classId);
  const teacher = classTeacherId ? (db.teachers || []).find((t) => t.id === classTeacherId) : undefined;

  const newSection: ClassSection = {
    id: `sec-${Date.now()}`,
    classId,
    className: cls?.name,
    name,
    roomNumber: roomNumber || '',
    classTeacherId: classTeacherId || undefined,
    classTeacherName: teacher?.fullName || undefined,
    studentCount: 0,
  };
  db.sections = db.sections || [];
  db.sections.push(newSection);
  saveDb(db);
  res.status(201).json(newSection);
});

router.put('/sections/:id', requireRoles(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, roomNumber, classTeacherId } = req.body;
  const db = getDb();
  const secIndex = (db.sections || []).findIndex((s) => s.id === id);
  if (secIndex === -1) {
    res.status(404).json({ error: 'Section not found' });
    return;
  }
  if (name) db.sections[secIndex].name = name;
  if (roomNumber !== undefined) db.sections[secIndex].roomNumber = roomNumber;
  if (classTeacherId !== undefined) {
    db.sections[secIndex].classTeacherId = classTeacherId;
    const teacher = (db.teachers || []).find((t) => t.id === classTeacherId);
    db.sections[secIndex].classTeacherName = teacher?.fullName;
  }
  saveDb(db);
  res.json(db.sections[secIndex]);
});

// ---------------------------------------------------------------------------
// 3. CURRICULUM SUBJECTS
// ---------------------------------------------------------------------------
router.get('/subjects', (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  res.json(db.subjects || []);
});

router.post('/subjects', requireRoles(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { code, name, description, gradeLevels } = req.body;
  if (!code || !name) {
    res.status(400).json({ error: 'Subject code and name are required' });
    return;
  }
  const db = getDb();
  const newSubject: CurriculumSubject = {
    id: `sub-${Date.now()}`,
    code,
    name,
    description: description || '',
    gradeLevels: Array.isArray(gradeLevels) ? gradeLevels : [1, 2, 3, 4, 5, 6, 7, 8],
  };
  db.subjects = db.subjects || [];
  db.subjects.push(newSubject);
  saveDb(db);
  res.status(201).json(newSubject);
});

router.put('/subjects/:id', requireRoles(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { code, name, description, gradeLevels } = req.body;
  const db = getDb();
  const subIndex = (db.subjects || []).findIndex((s) => s.id === id);
  if (subIndex === -1) {
    res.status(404).json({ error: 'Subject not found' });
    return;
  }
  if (code) db.subjects[subIndex].code = code;
  if (name) db.subjects[subIndex].name = name;
  if (description !== undefined) db.subjects[subIndex].description = description;
  if (Array.isArray(gradeLevels)) db.subjects[subIndex].gradeLevels = gradeLevels;
  saveDb(db);
  res.json(db.subjects[subIndex]);
});

router.delete('/subjects/:id', requireRoles(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  db.subjects = (db.subjects || []).filter((s) => s.id !== id);
  saveDb(db);
  res.json({ success: true, message: 'Subject removed' });
});

// ---------------------------------------------------------------------------
// 4. TEACHERS & CLASS/SUBJECT ASSIGNMENT
// ---------------------------------------------------------------------------
router.get('/teachers', (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const teachers = (db.teachers || []).map((t) => {
    const assignedClasses = (db.classes || []).filter((c) => t.assignedClassIds?.includes(c.id));
    const assignedSubjects = (db.subjects || []).filter((s) => t.assignedSubjectIds?.includes(s.id));
    return {
      ...t,
      assignedClasses,
      assignedSubjects,
    };
  });
  res.json(teachers);
});

router.post('/teachers', requireRoles(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { fullName, email, phone, qualification, assignedClassIds, assignedSubjectIds } = req.body;
  if (!fullName || !phone) {
    res.status(400).json({ error: 'Full name and phone are required' });
    return;
  }
  const db = getDb();
  const teacherId = `tch-${Date.now()}`;
  const newTeacher: TeacherProfile = {
    id: teacherId,
    userId: teacherId,
    teacherCode: generateTeacherCode(),
    fullName,
    email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@albrightacademy.edu`,
    phone,
    qualification: qualification || 'Bachelor of Education',
    assignedClassIds: Array.isArray(assignedClassIds) ? assignedClassIds : [],
    assignedSubjectIds: Array.isArray(assignedSubjectIds) ? assignedSubjectIds : [],
    createdAt: new Date().toISOString(),
  };
  db.teachers = db.teachers || [];
  db.teachers.push(newTeacher);
  saveDb(db);
  res.status(201).json(newTeacher);
});

router.put('/teachers/:id', requireRoles(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { fullName, email, phone, qualification, assignedClassIds, assignedSubjectIds } = req.body;
  const db = getDb();
  const idx = (db.teachers || []).findIndex((t) => t.id === id);
  if (idx === -1) {
    res.status(404).json({ error: 'Teacher not found' });
    return;
  }
  if (fullName) db.teachers[idx].fullName = fullName;
  if (email) db.teachers[idx].email = email;
  if (phone) db.teachers[idx].phone = phone;
  if (qualification) db.teachers[idx].qualification = qualification;
  if (Array.isArray(assignedClassIds)) db.teachers[idx].assignedClassIds = assignedClassIds;
  if (Array.isArray(assignedSubjectIds)) db.teachers[idx].assignedSubjectIds = assignedSubjectIds;
  saveDb(db);
  res.json(db.teachers[idx]);
});

router.delete('/teachers/:id', requireRoles(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  db.teachers = (db.teachers || []).filter((t) => t.id !== id);
  saveDb(db);
  res.json({ success: true, message: 'Teacher deleted successfully' });
});

// ---------------------------------------------------------------------------
// 5. PARENTS & LINKED SCHOLARS
// ---------------------------------------------------------------------------
router.get('/parents', (req: AuthenticatedRequest, res: Response) => {
  const user = req.authUser!;
  const db = getDb();

  let parents = db.parents || [];
  if (user.role === 'PARENT') {
    parents = parents.filter((p) => p.userId === user.id || p.id === user.id);
  }

  const enriched = parents.map((p) => {
    const children = (db.students || []).filter((s) => p.studentIds?.includes(s.id) || s.parentId === p.id);
    return {
      ...p,
      children,
    };
  });
  res.json(enriched);
});

router.post('/parents', requireRoles(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { fullName, relationship, phone, email, address, studentIds } = req.body;
  if (!fullName || !phone) {
    res.status(400).json({ error: 'Full name and phone are required' });
    return;
  }
  const db = getDb();
  const parentId = `par-${Date.now()}`;
  const newParent: ParentProfile = {
    id: parentId,
    userId: parentId,
    fullName,
    relationship: relationship || 'Guardian',
    phone,
    email: email || '',
    address: address || '',
    studentIds: Array.isArray(studentIds) ? studentIds : [],
    createdAt: new Date().toISOString(),
  };
  db.parents = db.parents || [];
  db.parents.push(newParent);

  // Link back to students
  if (Array.isArray(studentIds)) {
    (db.students || []).forEach((s) => {
      if (studentIds.includes(s.id)) {
        s.parentId = parentId;
        s.parentName = fullName;
      }
    });
  }

  saveDb(db);
  res.status(201).json(newParent);
});

router.put('/parents/:id', requireRoles(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { fullName, relationship, phone, email, address, studentIds } = req.body;
  const db = getDb();
  const idx = (db.parents || []).findIndex((p) => p.id === id);
  if (idx === -1) {
    res.status(404).json({ error: 'Parent not found' });
    return;
  }
  if (fullName) db.parents[idx].fullName = fullName;
  if (relationship) db.parents[idx].relationship = relationship;
  if (phone) db.parents[idx].phone = phone;
  if (email !== undefined) db.parents[idx].email = email;
  if (address !== undefined) db.parents[idx].address = address;
  if (Array.isArray(studentIds)) {
    db.parents[idx].studentIds = studentIds;
    (db.students || []).forEach((s) => {
      if (studentIds.includes(s.id)) {
        s.parentId = id;
        s.parentName = db.parents[idx].fullName;
      }
    });
  }
  saveDb(db);
  res.json(db.parents[idx]);
});

// ---------------------------------------------------------------------------
// 6. STUDENTS & ENROLLMENT (Strict Server-Side RBAC & Data Isolation)
// ---------------------------------------------------------------------------
router.get('/students', (req: AuthenticatedRequest, res: Response) => {
  const user = req.authUser!;
  const db = getDb();
  let students = db.students || [];

  // DATA-LEVEL ACCESS CONTROL
  if (user.role === 'TEACHER') {
    const teacher = db.teachers?.find((t) => t.userId === user.id || t.id === user.id);
    const assignedClasses = teacher?.assignedClassIds || [];
    // Teacher can ONLY access students in their assigned classes
    students = students.filter((s) => assignedClasses.includes(s.classId));
  } else if (user.role === 'PARENT') {
    const parent = db.parents?.find((p) => p.userId === user.id || p.id === user.id);
    const linkedIds = parent?.studentIds || [];
    // Parent can ONLY access their registered children
    students = students.filter((s) => linkedIds.includes(s.id) || s.parentId === parent?.id);
  } else if (user.role === 'STUDENT') {
    // Student can ONLY access their own profile
    students = students.filter((s) => s.userId === user.id || s.id === user.id || s.id === user.studentId);
  }

  // Optional filters
  const { classId, sectionId, search } = req.query;
  if (classId) {
    students = students.filter((s) => s.classId === classId);
  }
  if (sectionId) {
    students = students.filter((s) => s.sectionId === sectionId);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    students = students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.studentCode.toLowerCase().includes(q) ||
        (s.guardianPhone && s.guardianPhone.includes(q))
    );
  }

  res.json(students);
});

router.post('/students', requireRoles(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { fullName, gender, dateOfBirth, classId, sectionId, parentId, guardianName, guardianPhone } = req.body;
  if (!fullName || !classId) {
    res.status(400).json({ error: 'Full name and Class are required' });
    return;
  }
  const db = getDb();
  const cls = (db.classes || []).find((c) => c.id === classId);
  const sec = (db.sections || []).find((s) => s.id === sectionId);
  const parent = parentId ? (db.parents || []).find((p) => p.id === parentId) : undefined;

  const studentId = `stu-${Date.now()}`;
  const studentCode = generateStudentCode();

  const newStudent: StudentProfile = {
    id: studentId,
    userId: studentId,
    studentCode,
    fullName,
    gender: gender === 'Female' ? 'Female' : 'Male',
    dateOfBirth: dateOfBirth || '2016-01-01',
    classId,
    className: cls?.name,
    sectionId: sectionId || '',
    sectionName: sec?.name,
    parentId: parentId || undefined,
    parentName: parent?.fullName || guardianName,
    guardianName: guardianName || parent?.fullName || 'Parent Guardian',
    guardianPhone: guardianPhone || parent?.phone || '',
    status: 'Active',
    createdAt: new Date().toISOString(),
  };

  db.students = db.students || [];
  db.students.push(newStudent);

  // Auto-link to parent if specified
  if (parent) {
    parent.studentIds = parent.studentIds || [];
    if (!parent.studentIds.includes(studentId)) {
      parent.studentIds.push(studentId);
    }
  }

  // Create enrollment record
  db.enrollments = db.enrollments || [];
  db.enrollments.push({
    id: `enr-${Date.now()}`,
    studentId,
    studentName: fullName,
    studentCode,
    classId,
    className: cls?.name,
    sectionId: sectionId || '',
    sectionName: sec?.name,
    academicYear: '2025-2026 / 2018 E.C.',
    status: 'Active',
    createdAt: new Date().toISOString(),
  });

  saveDb(db);
  res.status(201).json(newStudent);
});

router.put('/students/:id', requireRoles(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { fullName, gender, dateOfBirth, classId, sectionId, parentId, guardianName, guardianPhone, status } = req.body;
  const db = getDb();
  const idx = (db.students || []).findIndex((s) => s.id === id);
  if (idx === -1) {
    res.status(404).json({ error: 'Student not found' });
    return;
  }

  if (fullName) db.students[idx].fullName = fullName;
  if (gender) db.students[idx].gender = gender;
  if (dateOfBirth) db.students[idx].dateOfBirth = dateOfBirth;
  if (classId) {
    db.students[idx].classId = classId;
    const cls = (db.classes || []).find((c) => c.id === classId);
    db.students[idx].className = cls?.name;
  }
  if (sectionId) {
    db.students[idx].sectionId = sectionId;
    const sec = (db.sections || []).find((s) => s.id === sectionId);
    db.students[idx].sectionName = sec?.name;
  }
  if (parentId !== undefined) {
    db.students[idx].parentId = parentId;
    const parent = (db.parents || []).find((p) => p.id === parentId);
    db.students[idx].parentName = parent?.fullName;
  }
  if (guardianName) db.students[idx].guardianName = guardianName;
  if (guardianPhone) db.students[idx].guardianPhone = guardianPhone;
  if (status) db.students[idx].status = status;

  saveDb(db);
  res.json(db.students[idx]);
});

router.delete('/students/:id', requireRoles(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  db.students = (db.students || []).filter((s) => s.id !== id);
  db.enrollments = (db.enrollments || []).filter((e) => e.studentId !== id);
  db.attendances = (db.attendances || []).filter((a) => a.studentId !== id);
  db.results = (db.results || []).filter((r) => r.studentId !== id);
  saveDb(db);
  res.json({ success: true, message: 'Student record removed' });
});

// ---------------------------------------------------------------------------
// 7. ATTENDANCE (Present, Absent, Late, Excused - Strict Data Authorization)
// ---------------------------------------------------------------------------
router.get('/attendances', (req: AuthenticatedRequest, res: Response) => {
  const user = req.authUser!;
  const db = getDb();
  let records = db.attendances || [];

  if (user.role === 'TEACHER') {
    const teacher = db.teachers?.find((t) => t.userId === user.id || t.id === user.id);
    const assignedClasses = teacher?.assignedClassIds || [];
    records = records.filter((r) => assignedClasses.includes(r.classId));
  } else if (user.role === 'PARENT') {
    const parent = db.parents?.find((p) => p.userId === user.id || p.id === user.id);
    const linkedIds = parent?.studentIds || [];
    records = records.filter((r) => linkedIds.includes(r.studentId));
  } else if (user.role === 'STUDENT') {
    records = records.filter((r) => r.studentId === user.studentId || r.studentId === user.id);
  }

  const { classId, date, studentId } = req.query;
  if (classId) records = records.filter((r) => r.classId === classId);
  if (date) records = records.filter((r) => r.date === date);
  if (studentId) records = records.filter((r) => r.studentId === studentId);

  res.json(records);
});

router.post('/attendances', requireRoles(['ADMIN', 'TEACHER']), (req: AuthenticatedRequest, res: Response) => {
  const user = req.authUser!;
  const db = getDb();
  const { items } = req.body; // Array of { studentId, classId, sectionId, date, status, remarks }

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Array of attendance marks is required' });
    return;
  }

  // Teacher Data-Level Check: verify teacher is assigned to ALL provided classIds
  if (user.role === 'TEACHER') {
    const teacher = db.teachers?.find((t) => t.userId === user.id || t.id === user.id);
    const assignedClasses = teacher?.assignedClassIds || [];
    const unauthorized = items.find((it) => !assignedClasses.includes(it.classId));
    if (unauthorized) {
      res.status(403).json({
        error: `Forbidden: You are not assigned to class [${unauthorized.classId}]. Teachers may only record attendance for assigned cohorts.`,
      });
      return;
    }
  }

  db.attendances = db.attendances || [];
  const saved: AttendanceRecord[] = [];

  for (const item of items) {
    const { studentId, classId, sectionId, date, status, remarks } = item;
    if (!studentId || !classId || !date || !status) continue;

    const student = (db.students || []).find((s) => s.id === studentId);
    const cls = (db.classes || []).find((c) => c.id === classId);
    const sec = (db.sections || []).find((s) => s.id === sectionId);

    // Upsert by studentId + date
    const existingIdx = db.attendances.findIndex((a) => a.studentId === studentId && a.date === date);
    if (existingIdx !== -1) {
      db.attendances[existingIdx].status = status;
      db.attendances[existingIdx].remarks = remarks || '';
      db.attendances[existingIdx].markedBy = user.fullName;
      saved.push(db.attendances[existingIdx]);
    } else {
      const newRec: AttendanceRecord = {
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        studentId,
        studentName: student?.fullName || 'Student',
        studentCode: student?.studentCode,
        classId,
        className: cls?.name,
        sectionId: sectionId || '',
        sectionName: sec?.name,
        date,
        status,
        remarks: remarks || '',
        markedBy: user.fullName,
        createdAt: new Date().toISOString(),
      };
      db.attendances.push(newRec);
      saved.push(newRec);
    }
  }

  saveDb(db);
  res.json({ success: true, count: saved.length, records: saved });
});

// ---------------------------------------------------------------------------
// 8. ASSIGNMENTS (Teacher Created, Student & Parent Viewed)
// ---------------------------------------------------------------------------
router.get('/assignments', (req: AuthenticatedRequest, res: Response) => {
  const user = req.authUser!;
  const db = getDb();
  let list = db.assignments || [];

  if (user.role === 'TEACHER') {
    const teacher = db.teachers?.find((t) => t.userId === user.id || t.id === user.id);
    const assignedClasses = teacher?.assignedClassIds || [];
    list = list.filter((a) => a.teacherId === teacher?.id || assignedClasses.includes(a.classId));
  } else if (user.role === 'STUDENT') {
    const student = db.students?.find((s) => s.userId === user.id || s.id === user.id || s.id === user.studentId);
    list = list.filter((a) => a.classId === student?.classId);
  } else if (user.role === 'PARENT') {
    const parent = db.parents?.find((p) => p.userId === user.id || p.id === user.id);
    const children = (db.students || []).filter((s) => parent?.studentIds?.includes(s.id) || s.parentId === parent?.id);
    const childrenClassIds = children.map((c) => c.classId);
    list = list.filter((a) => childrenClassIds.includes(a.classId));
  }

  res.json(list);
});

router.post('/assignments', requireRoles(['ADMIN', 'TEACHER']), (req: AuthenticatedRequest, res: Response) => {
  const user = req.authUser!;
  const db = getDb();
  const { classId, sectionId, subjectId, title, description, dueDate, maxPoints } = req.body;

  if (!classId || !subjectId || !title || !dueDate) {
    res.status(400).json({ error: 'Class, Subject, Title, and Due Date are required' });
    return;
  }

  let teacherId = 'admin';
  let teacherName = user.fullName;

  // Teacher Data Check
  if (user.role === 'TEACHER') {
    const teacher = db.teachers?.find((t) => t.userId === user.id || t.id === user.id);
    if (!teacher || !teacher.assignedClassIds?.includes(classId)) {
      res.status(403).json({ error: 'Forbidden: You may only post assignments for your assigned classes.' });
      return;
    }
    teacherId = teacher.id;
    teacherName = teacher.fullName;
  }

  const cls = (db.classes || []).find((c) => c.id === classId);
  const sec = (db.sections || []).find((s) => s.id === sectionId);
  const sub = (db.subjects || []).find((s) => s.id === subjectId);

  const newAssignment: CourseAssignment = {
    id: `asg-${Date.now()}`,
    teacherId,
    teacherName,
    classId,
    className: cls?.name,
    sectionId: sectionId || undefined,
    sectionName: sec?.name,
    subjectId,
    subjectName: sub?.name,
    title,
    description: description || '',
    dueDate,
    maxPoints: Number(maxPoints) || 20,
    createdAt: new Date().toISOString(),
  };

  db.assignments = db.assignments || [];
  db.assignments.push(newAssignment);
  saveDb(db);
  res.status(201).json(newAssignment);
});

router.delete('/assignments/:id', requireRoles(['ADMIN', 'TEACHER']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = req.authUser!;
  const db = getDb();
  const assignment = (db.assignments || []).find((a) => a.id === id);

  if (!assignment) {
    res.status(404).json({ error: 'Assignment not found' });
    return;
  }

  if (user.role === 'TEACHER') {
    const teacher = db.teachers?.find((t) => t.userId === user.id || t.id === user.id);
    if (assignment.teacherId !== teacher?.id) {
      res.status(403).json({ error: 'Forbidden: You can only delete your own assignments.' });
      return;
    }
  }

  db.assignments = db.assignments.filter((a) => a.id !== id);
  saveDb(db);
  res.json({ success: true, message: 'Assignment deleted' });
});

// ---------------------------------------------------------------------------
// 9. EXAMS & ACADEMIC RESULTS (Strict RBAC & Data Verification)
// ---------------------------------------------------------------------------
router.get('/exams', (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  res.json(db.exams || []);
});

router.post('/exams', requireRoles(['ADMIN', 'TEACHER']), (req: AuthenticatedRequest, res: Response) => {
  const user = req.authUser!;
  const db = getDb();
  const { title, classId, subjectId, term, date, maxMarks } = req.body;

  if (!title || !classId || !subjectId) {
    res.status(400).json({ error: 'Title, Class, and Subject are required' });
    return;
  }

  if (user.role === 'TEACHER') {
    const teacher = db.teachers?.find((t) => t.userId === user.id || t.id === user.id);
    if (!teacher?.assignedClassIds?.includes(classId)) {
      res.status(403).json({ error: 'Forbidden: You may only schedule exams for your assigned classes.' });
      return;
    }
  }

  const cls = (db.classes || []).find((c) => c.id === classId);
  const sub = (db.subjects || []).find((s) => s.id === subjectId);

  const newExam: SchoolExam = {
    id: `exm-${Date.now()}`,
    title,
    classId,
    className: cls?.name,
    subjectId,
    subjectName: sub?.name,
    term: term || 'Term 1 Midterm',
    date: date || new Date().toISOString().split('T')[0],
    maxMarks: Number(maxMarks) || 100,
    createdAt: new Date().toISOString(),
  };

  db.exams = db.exams || [];
  db.exams.push(newExam);
  saveDb(db);
  res.status(201).json(newExam);
});

router.get('/results', (req: AuthenticatedRequest, res: Response) => {
  const user = req.authUser!;
  const db = getDb();
  let results = db.results || [];

  if (user.role === 'TEACHER') {
    const teacher = db.teachers?.find((t) => t.userId === user.id || t.id === user.id);
    const assignedClasses = teacher?.assignedClassIds || [];
    results = results.filter((r) => assignedClasses.includes(r.classId));
  } else if (user.role === 'PARENT') {
    const parent = db.parents?.find((p) => p.userId === user.id || p.id === user.id);
    const linkedIds = parent?.studentIds || [];
    results = results.filter((r) => linkedIds.includes(r.studentId));
  } else if (user.role === 'STUDENT') {
    results = results.filter((r) => r.studentId === user.studentId || r.studentId === user.id);
  }

  const { examId, studentId, classId } = req.query;
  if (examId) results = results.filter((r) => r.examId === examId);
  if (studentId) results = results.filter((r) => r.studentId === studentId);
  if (classId) results = results.filter((r) => r.classId === classId);

  res.json(results);
});

router.post('/results', requireRoles(['ADMIN', 'TEACHER']), (req: AuthenticatedRequest, res: Response) => {
  const user = req.authUser!;
  const db = getDb();
  const { examId, studentId, marksObtained, remarks } = req.body;

  if (!examId || !studentId || marksObtained === undefined) {
    res.status(400).json({ error: 'Exam ID, Student ID, and marksObtained are required' });
    return;
  }

  const exam = (db.exams || []).find((e) => e.id === examId);
  if (!exam) {
    res.status(404).json({ error: 'Exam not found' });
    return;
  }

  // Teacher access check
  if (user.role === 'TEACHER') {
    const teacher = db.teachers?.find((t) => t.userId === user.id || t.id === user.id);
    if (!teacher?.assignedClassIds?.includes(exam.classId)) {
      res.status(403).json({ error: 'Forbidden: You may only grade exams for your assigned classes.' });
      return;
    }
  }

  const student = (db.students || []).find((s) => s.id === studentId);
  const marks = Number(marksObtained);
  const max = exam.maxMarks || 100;
  const percentage = Math.round((marks / max) * 100);

  let grade = 'F';
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 85) grade = 'A';
  else if (percentage >= 80) grade = 'B+';
  else if (percentage >= 75) grade = 'B';
  else if (percentage >= 65) grade = 'C';
  else if (percentage >= 50) grade = 'D';

  db.results = db.results || [];
  const existingIdx = db.results.findIndex((r) => r.examId === examId && r.studentId === studentId);

  let output: AcademicResult;
  if (existingIdx !== -1) {
    db.results[existingIdx].marksObtained = marks;
    db.results[existingIdx].percentage = percentage;
    db.results[existingIdx].grade = grade;
    db.results[existingIdx].remarks = remarks || '';
    db.results[existingIdx].enteredBy = user.fullName;
    db.results[existingIdx].updatedAt = new Date().toISOString();
    output = db.results[existingIdx];
  } else {
    output = {
      id: `res-${Date.now()}`,
      examId,
      examTitle: exam.title,
      studentId,
      studentName: student?.fullName,
      studentCode: student?.studentCode,
      subjectId: exam.subjectId,
      subjectName: exam.subjectName,
      classId: exam.classId,
      className: exam.className,
      marksObtained: marks,
      maxMarks: max,
      percentage,
      grade,
      remarks: remarks || '',
      enteredBy: user.fullName,
      updatedAt: new Date().toISOString(),
    };
    db.results.push(output);
  }

  saveDb(db);
  res.status(201).json(output);
});

// ---------------------------------------------------------------------------
// 10. FEES & PAYMENTS
// ---------------------------------------------------------------------------
router.get('/fees', (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  res.json(db.fees || []);
});

router.post('/fees', requireRoles(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { title, feeType, classId, amount, dueDate } = req.body;
  if (!title || !amount || !dueDate) {
    res.status(400).json({ error: 'Title, amount, and due date are required' });
    return;
  }
  const db = getDb();
  const cls = classId ? (db.classes || []).find((c) => c.id === classId) : undefined;
  const newFee: SchoolFee = {
    id: `fee-${Date.now()}`,
    title,
    feeType: feeType || 'Tuition',
    classId: classId || undefined,
    className: cls?.name,
    amount: Number(amount),
    dueDate,
    createdAt: new Date().toISOString(),
  };
  db.fees = db.fees || [];
  db.fees.push(newFee);
  saveDb(db);
  res.status(201).json(newFee);
});

router.delete('/fees/:id', requireRoles(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  db.fees = (db.fees || []).filter((f) => f.id !== id);
  saveDb(db);
  res.json({ success: true, message: 'Fee schedule removed' });
});

router.get('/payments', (req: AuthenticatedRequest, res: Response) => {
  const user = req.authUser!;
  const db = getDb();
  let payments = db.payments || [];

  if (user.role === 'PARENT') {
    const parent = db.parents?.find((p) => p.userId === user.id || p.id === user.id);
    const linkedIds = parent?.studentIds || [];
    payments = payments.filter((p) => linkedIds.includes(p.studentId));
  } else if (user.role === 'STUDENT') {
    payments = payments.filter((p) => p.studentId === user.studentId || p.studentId === user.id);
  }

  res.json(payments);
});

router.post('/payments', requireRoles(['ADMIN', 'PARENT']), (req: AuthenticatedRequest, res: Response) => {
  const user = req.authUser!;
  const db = getDb();
  const { feeId, studentId, amountPaid, paymentMethod, receiptNumber } = req.body;

  if (!feeId || !studentId || !amountPaid) {
    res.status(400).json({ error: 'Fee ID, Student ID, and amount paid are required' });
    return;
  }

  // Parent Data Check: only for linked child
  if (user.role === 'PARENT') {
    const parent = db.parents?.find((p) => p.userId === user.id || p.id === user.id);
    if (!parent?.studentIds?.includes(studentId)) {
      res.status(403).json({ error: 'Forbidden: You may only submit payments for your registered children.' });
      return;
    }
  }

  const fee = (db.fees || []).find((f) => f.id === feeId);
  const student = (db.students || []).find((s) => s.id === studentId);

  const newPayment: TuitionPayment = {
    id: `pay-${Date.now()}`,
    feeId,
    feeTitle: fee?.title,
    studentId,
    studentName: student?.fullName,
    studentCode: student?.studentCode,
    parentId: student?.parentId,
    amountPaid: Number(amountPaid),
    totalFeeAmount: fee?.amount || Number(amountPaid),
    receiptNumber: receiptNumber || generateReceiptNumber(),
    paymentMethod: paymentMethod || 'Telebirr',
    paymentDate: new Date().toISOString().split('T')[0],
    status: user.role === 'ADMIN' ? 'Completed' : 'Pending',
  };

  db.payments = db.payments || [];
  db.payments.push(newPayment);
  saveDb(db);
  res.status(201).json(newPayment);
});

// ---------------------------------------------------------------------------
// 11. ANNOUNCEMENTS (Role-Based Audience Filtering)
// ---------------------------------------------------------------------------
router.get('/announcements', (req: AuthenticatedRequest, res: Response) => {
  const user = req.authUser!;
  const db = getDb();
  let announcements = db.announcements || [];

  if (user.role === 'TEACHER') {
    announcements = announcements.filter((a) => a.targetAudience === 'ALL' || a.targetAudience === 'TEACHERS');
  } else if (user.role === 'PARENT') {
    announcements = announcements.filter((a) => a.targetAudience === 'ALL' || a.targetAudience === 'PARENTS');
  } else if (user.role === 'STUDENT') {
    announcements = announcements.filter((a) => a.targetAudience === 'ALL' || a.targetAudience === 'STUDENTS');
  }

  res.json(announcements);
});

router.post('/announcements', requireRoles(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const user = req.authUser!;
  const { title, content, targetAudience, isPinned } = req.body;

  if (!title || !content) {
    res.status(400).json({ error: 'Title and content are required' });
    return;
  }

  const db = getDb();
  const newAnnouncement: SchoolAnnouncement = {
    id: `anc-${Date.now()}`,
    title,
    content,
    targetAudience: targetAudience || 'ALL',
    isPinned: Boolean(isPinned),
    author: user.fullName || 'School Administration',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  db.announcements = db.announcements || [];
  db.announcements.unshift(newAnnouncement);
  saveDb(db);
  res.status(201).json(newAnnouncement);
});

router.put('/announcements/:id', requireRoles(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, content, targetAudience, isPinned } = req.body;
  const db = getDb();
  const idx = (db.announcements || []).findIndex((a) => a.id === id);
  if (idx === -1) {
    res.status(404).json({ error: 'Announcement not found' });
    return;
  }
  if (title) db.announcements[idx].title = title;
  if (content) db.announcements[idx].content = content;
  if (targetAudience) db.announcements[idx].targetAudience = targetAudience;
  if (isPinned !== undefined) db.announcements[idx].isPinned = Boolean(isPinned);
  saveDb(db);
  res.json(db.announcements[idx]);
});

router.delete('/announcements/:id', requireRoles(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  db.announcements = (db.announcements || []).filter((a) => a.id !== id);
  saveDb(db);
  res.json({ success: true, message: 'Announcement deleted' });
});

export default router;
