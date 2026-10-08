import { Router, Response } from 'express';
import { prisma } from './prisma.ts';
import { AuthenticatedRequest, authenticateAny, requireRoles } from './auth.ts';

const router = Router();
router.use(authenticateAny);

const ADMIN = ['SUPER_ADMIN','ADMIN','PRINCIPAL','ACADEMIC_HEAD'] as any;

function safeStudent(s: any) {
  return {
    id: s.id,
    userId: s.userId,
    studentCode: s.studentCode,
    fullName: [s.firstName, s.middleName, s.lastName].filter(Boolean).join(' '),
    firstName: s.firstName,
    middleName: s.middleName,
    lastName: s.lastName,
    dateOfBirth: s.dateOfBirth?.toISOString?.() ?? s.dateOfBirth,
    gender: s.gender,
    bloodGroup: s.bloodGroup,
    parentId: s.parentId,
    parentName: s.parent?.fullName,
    status: s.enrollments?.[0]?.status ?? 'Active',
    classId: s.enrollments?.[0]?.classId,
    className: s.enrollments?.[0]?.class?.name,
    sectionId: s.enrollments?.[0]?.sectionId,
    sectionName: s.enrollments?.[0]?.section?.name,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}

router.get('/me', async (req: AuthenticatedRequest, res: Response) => {const user=req.authUser!;if(user.role==='TEACHER'){const teacher=await prisma.teacher.findUnique({where:{id:user.teacherId||'__none__'},include:{subjects:true}});return res.json({user,teacherProfile:teacher,assignedClasses:[],assignedSubjects:teacher?.subjects||[]});}if(user.role==='PARENT'){const parent=await prisma.parent.findUnique({where:{id:user.parentId||'__none__'},include:{students:{include:{enrollments:{include:{class:true,section:true},orderBy:{createdAt:'desc'},take:1}}}}});return res.json({user,parentProfile:parent,children:parent?.students?.map(safeStudent)||[]});}if(user.role==='STUDENT'){const student=await prisma.student.findUnique({where:{id:user.studentId||'__none__'},include:{enrollments:{include:{class:true,section:true},orderBy:{createdAt:'desc'},take:1}}});return res.json({user,studentProfile:safeStudent(student),enrolledClass:student?.enrollments?.[0]?.class,section:student?.enrollments?.[0]?.section});}const [students,teachers,parents,classes]=await Promise.all([prisma.student.count(),prisma.teacher.count(),prisma.parent.count(),prisma.class.count()]);res.json({user,totalStudents:students,totalTeachers:teachers,totalParents:parents,totalClasses:classes});});

router.get('/classes', async (_req, res) => {
  const classes = await prisma.class.findMany({ include: { sections: true }, orderBy: { gradeLevel: 'asc' } });
  res.json(classes);
});

router.post('/classes', requireRoles(ADMIN), async (req, res) => {
  const { name, gradeLevel } = req.body;
  if (!name || gradeLevel === undefined) return res.status(400).json({ error: 'Class name and grade level are required' });
  const item = await prisma.class.create({ data: { name: String(name).trim(), gradeLevel: Number(gradeLevel) } });
  res.status(201).json(item);
});

router.put('/classes/:id', requireRoles(ADMIN), async (req, res) => {
  const { name, gradeLevel } = req.body;
  const item = await prisma.class.update({ where: { id: req.params.id }, data: {
    ...(name !== undefined ? { name: String(name).trim() } : {}),
    ...(gradeLevel !== undefined ? { gradeLevel: Number(gradeLevel) } : {}),
  } });
  res.json(item);
});

router.delete('/classes/:id', requireRoles(ADMIN), async (req, res) => {
  const used = await prisma.enrollment.count({ where: { classId: req.params.id } });
  if (used) return res.status(409).json({ error: 'Cannot delete a class with enrollment records.' });
  await prisma.class.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

router.get('/sections', async (req, res) => {
  const sections = await prisma.section.findMany({
    where: req.query.classId ? { classId: String(req.query.classId) } : undefined,
    include: { class: true },
    orderBy: { name: 'asc' },
  });
  res.json(sections);
});

router.post('/sections', requireRoles(ADMIN), async (req, res) => {
  const { classId, name, roomNumber } = req.body;
  if (!classId || !name) return res.status(400).json({ error: 'Class ID and section name are required' });
  const item = await prisma.section.create({ data: { classId: String(classId), name: String(name).trim(), roomNumber: roomNumber ? String(roomNumber).trim() : null }, include: { class: true } });
  res.status(201).json(item);
});

router.put('/sections/:id', requireRoles(ADMIN), async (req, res) => {
  const { name, roomNumber } = req.body;
  const item = await prisma.section.update({ where: { id: req.params.id }, data: {
    ...(name !== undefined ? { name: String(name).trim() } : {}),
    ...(roomNumber !== undefined ? { roomNumber: roomNumber ? String(roomNumber).trim() : null } : {}),
  }, include: { class: true } });
  res.json(item);
});

router.delete('/sections/:id', requireRoles(ADMIN), async (req, res) => {
  const used = await prisma.enrollment.count({ where: { sectionId: req.params.id } });
  if (used) return res.status(409).json({ error: 'Cannot delete a section with enrollment records.' });
  await prisma.section.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

router.get('/subjects', async (_req, res) => {
  res.json(await prisma.subject.findMany({ include: { teachers: true }, orderBy: { name: 'asc' } }));
});

router.post('/subjects', requireRoles(ADMIN), async (req, res) => {
  const { code, name, description } = req.body;
  if (!code || !name) return res.status(400).json({ error: 'Subject code and name are required' });
  const item = await prisma.subject.create({ data: { code: String(code).trim().toUpperCase(), name: String(name).trim(), description: description ? String(description).trim() : null } });
  res.status(201).json(item);
});

router.put('/subjects/:id', requireRoles(ADMIN), async (req, res) => {
  const { code, name, description } = req.body;
  const item = await prisma.subject.update({ where: { id: req.params.id }, data: {
    ...(code !== undefined ? { code: String(code).trim().toUpperCase() } : {}),
    ...(name !== undefined ? { name: String(name).trim() } : {}),
    ...(description !== undefined ? { description: description ? String(description).trim() : null } : {}),
  } });
  res.json(item);
});

router.get('/students', async (req: AuthenticatedRequest, res: Response) => {
  const user = req.authUser!;
  const where: any = {};
  if (user.role === 'PARENT') where.parentId = user.parentId || '__none__';
  if (user.role === 'STUDENT') where.id = user.studentId || '__none__';
  if (req.query.search) {
    const q = String(req.query.search);
    where.OR = [
      { firstName: { contains: q, mode: 'insensitive' } },
      { lastName: { contains: q, mode: 'insensitive' } },
      { studentCode: { contains: q, mode: 'insensitive' } },
    ];
  }
  const enrollmentWhere: any = {};
  if (req.query.classId) enrollmentWhere.classId = String(req.query.classId);
  if (req.query.sectionId) enrollmentWhere.sectionId = String(req.query.sectionId);
  if (Object.keys(enrollmentWhere).length) where.enrollments = { some: enrollmentWhere };

  const students = await prisma.student.findMany({
    where,
    include: { parent: true, enrollments: { include: { class: true, section: true }, orderBy: { createdAt: 'desc' }, take: 1 } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(students.map(safeStudent));
});

router.post('/students', requireRoles(ADMIN), async (req, res) => {
  const { firstName, middleName, lastName, fullName, gender, dateOfBirth, classId, sectionId, parentId, bloodGroup } = req.body;
  const parts = String(fullName || '').trim().split(/\\s+/).filter(Boolean);
  const first = String(firstName || parts[0] || '').trim();
  const last = String(lastName || parts.slice(1).join(' ') || '').trim();
  if (!first || !last || !gender || !dateOfBirth || !classId) return res.status(400).json({ error: 'First name, last name, gender, date of birth, and class are required' });

  const year = new Date().getFullYear();
  const count = await prisma.student.count();
  const studentCode = `ALB-STU-${year}-${String(count + 1).padStart(4, '0')}`;
  const academicYear = await prisma.academicYear.findFirst({ where: { isCurrent: true } }) || await prisma.academicYear.findFirst({ orderBy: { startDate: 'desc' } });
  if (!academicYear) return res.status(409).json({ error: 'Create an academic year before enrolling students.' });

  const student = await prisma.$transaction(async tx => {
    const created = await tx.student.create({
      data: {
        studentCode,
        firstName: first,
        middleName: middleName ? String(middleName).trim() : (parts.length > 2 ? parts.slice(1, -1).join(' ') : null),
        lastName: last,
        dateOfBirth: new Date(dateOfBirth),
        gender: String(gender),
        bloodGroup: bloodGroup ? String(bloodGroup) : null,
        parentId: parentId || null,
      },
    });
    await tx.enrollment.create({ data: { studentId: created.id, academicYearId: academicYear.id, classId: String(classId), sectionId: String(sectionId), status: 'Active' } });
    return tx.student.findUnique({ where: { id: created.id }, include: { parent: true, enrollments: { include: { class: true, section: true }, take: 1 } } });
  });
  res.status(201).json(safeStudent(student));
});

router.put('/students/:id', requireRoles(ADMIN), async (req, res) => {
  const { firstName, middleName, lastName, fullName, gender, dateOfBirth, classId, sectionId, parentId, bloodGroup, status } = req.body;
  const parts = String(fullName || '').trim().split(/\\s+/).filter(Boolean);
  const data: any = {};
  if (firstName !== undefined) data.firstName = String(firstName).trim();
  if (lastName !== undefined) data.lastName = String(lastName).trim();
  if (fullName && !firstName && !lastName) { data.firstName = parts[0]; data.lastName = parts.slice(1).join(' '); }
  if (middleName !== undefined) data.middleName = middleName ? String(middleName).trim() : null;
  if (gender !== undefined) data.gender = String(gender);
  if (dateOfBirth !== undefined) data.dateOfBirth = new Date(dateOfBirth);
  if (parentId !== undefined) data.parentId = parentId || null;
  if (bloodGroup !== undefined) data.bloodGroup = bloodGroup || null;
  const student = await prisma.$transaction(async tx => {
    const updated = await tx.student.update({ where: { id: req.params.id }, data });
    if (classId || sectionId || status) {
      const current = await tx.enrollment.findFirst({ where: { studentId: updated.id }, orderBy: { createdAt: 'desc' } });
      if (current) await tx.enrollment.update({ where: { id: current.id }, data: {
        ...(classId ? { classId: String(classId) } : {}),
        ...(sectionId ? { sectionId: String(sectionId) } : {}),
        ...(status ? { status: String(status) } : {}),
      }});
    }
    return tx.student.findUnique({ where: { id: updated.id }, include: { parent: true, enrollments: { include: { class: true, section: true }, orderBy: { createdAt: 'desc' }, take: 1 } } });
  });
  res.json(safeStudent(student));
});

router.delete('/students/:id', requireRoles(ADMIN), async (req, res) => {
  const student = await prisma.student.findUnique({ where: { id: req.params.id }, select: { id: true } });
  if (!student) return res.status(404).json({ error: 'Student not found' });
  await prisma.student.delete({ where: { id: student.id } });
  res.json({ success: true, message: 'Student deleted successfully' });
});

router.get('/parents', async (req: AuthenticatedRequest, res) => {
  const where: any = req.authUser!.role === 'PARENT' ? { id: req.authUser!.parentId || '__none__' } : undefined;
  const parents = await prisma.parent.findMany({ where, include: { students: true }, orderBy: { fullName: 'asc' } });
  res.json(parents);
});

router.post('/parents', requireRoles(ADMIN), async (req, res) => {
  const { fullName, relationship, phone, email, address, occupation } = req.body;
  if (!fullName || !phone) return res.status(400).json({ error: 'Full name and phone are required' });
  const parent = await prisma.parent.create({ data: { fullName: String(fullName).trim(), relationship: relationship || 'Guardian', phone: String(phone).trim(), email: email ? String(email).trim().toLowerCase() : null, address: address || null, occupation: occupation || null } });
  res.status(201).json(parent);
});

router.put('/parents/:id', requireRoles(ADMIN), async (req, res) => {
  const { fullName, relationship, phone, email, address, occupation } = req.body;
  const parent = await prisma.parent.update({ where: { id: req.params.id }, data: {
    ...(fullName !== undefined ? { fullName: String(fullName).trim() } : {}),
    ...(relationship !== undefined ? { relationship: String(relationship) } : {}),
    ...(phone !== undefined ? { phone: String(phone).trim() } : {}),
    ...(email !== undefined ? { email: email ? String(email).trim().toLowerCase() : null } : {}),
    ...(address !== undefined ? { address: address || null } : {}),
    ...(occupation !== undefined ? { occupation: occupation || null } : {}),
  }});
  res.json(parent);
});


router.delete('/subjects/:id', requireRoles(ADMIN), async (req, res) => {
  const used = (await prisma.assignment.count({ where: { subjectId: req.params.id } })) +
    (await prisma.exam.count({ where: { subjectId: req.params.id } }));
  if (used) return res.status(409).json({ error: 'Cannot delete a subject used by assignments or exams.' });
  await prisma.subject.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Subject removed' });
});

router.get('/teachers', async (req: AuthenticatedRequest, res: Response) => {
  const where: any = req.authUser!.role === 'TEACHER'
    ? { id: req.authUser!.teacherId || '__none__' }
    : undefined;
  const rows = await prisma.teacher.findMany({
    where,
    include: { subjects: true },
    orderBy: { fullName: 'asc' },
  });
  res.json(rows.map(t => ({ ...t, assignedSubjects: t.subjects, assignedClasses: [] })));
});

export default router;
