import { Router } from 'express';
import { prisma } from './prisma.ts';
import { AuthenticatedRequest, authenticateAny, requireRoles } from './auth.ts';

const router = Router();
router.use(authenticateAny);
const ADMIN = ['SUPER_ADMIN','ADMIN','PRINCIPAL','ACCOUNTANT'] as any;

router.get('/fees', async (req: AuthenticatedRequest, res) => {
  const user = req.authUser!;
  const where: any = {};
  if (req.query.academicYearId) where.academicYearId = String(req.query.academicYearId);
  if (req.query.termId) where.termId = String(req.query.termId);
  if (req.query.classId) where.classId = String(req.query.classId);
  const rows = await prisma.fee.findMany({
    where,
    include: { academicYear: true, term: true, class: true, payments: true },
    orderBy: { dueDate: 'desc' },
  });
  if (user.role === 'PARENT' || user.role === 'STUDENT') {
    const studentIds = user.role === 'STUDENT'
      ? [user.studentId].filter(Boolean) as string[]
      : (await prisma.student.findMany({ where: { parentId: user.parentId || '__none__' }, select: { id: true } })).map(s => s.id);
    const paid = await prisma.payment.findMany({ where: { studentId: { in: studentIds } }, include: { fee: true }, orderBy: { paymentDate: 'desc' } });
    return res.json({ fees: rows, payments: paid });
  }
  res.json(rows);
});

router.post('/fees', requireRoles(ADMIN), async (req, res) => {
  const { academicYearId, termId, classId, feeType, amount, dueDate } = req.body;
  const value = Number(amount);
  if (!academicYearId || !feeType || !Number.isFinite(value) || value < 0 || !dueDate)
    return res.status(400).json({ error: 'Academic year, fee type, valid amount and due date are required' });
  const row = await prisma.fee.create({
    data: { academicYearId: String(academicYearId), termId: termId ? String(termId) : null, classId: classId ? String(classId) : null, feeType: String(feeType).trim(), amount: value, dueDate: new Date(dueDate) },
    include: { academicYear: true, term: true, class: true },
  });
  res.status(201).json(row);
});

router.put('/fees/:id', requireRoles(ADMIN), async (req, res) => {
  const { feeType, amount, dueDate, termId, classId } = req.body;
  const value = amount === undefined ? undefined : Number(amount);
  if (value !== undefined && (!Number.isFinite(value) || value < 0)) return res.status(400).json({ error: 'Amount must be a valid non-negative number' });
  const row = await prisma.fee.update({
    where: { id: req.params.id },
    data: {
      ...(feeType !== undefined ? { feeType: String(feeType).trim() } : {}),
      ...(value !== undefined ? { amount: value } : {}),
      ...(dueDate !== undefined ? { dueDate: new Date(dueDate) } : {}),
      ...(termId !== undefined ? { termId: termId ? String(termId) : null } : {}),
      ...(classId !== undefined ? { classId: classId ? String(classId) : null } : {}),
    },
  });
  res.json(row);
});

router.delete('/fees/:id', requireRoles(ADMIN), async (req, res) => {
  await prisma.fee.delete({ where: { id: req.params.id } });
  res.json({ message: 'Fee deleted successfully' });
});

router.get('/payments', requireRoles(ADMIN), async (req, res) => {
  const where: any = {};
  if (req.query.studentId) where.studentId = String(req.query.studentId);
  if (req.query.feeId) where.feeId = String(req.query.feeId);
  if (req.query.status) where.status = String(req.query.status);
  const rows = await prisma.payment.findMany({
    where,
    include: { fee: true, student: true },
    orderBy: { paymentDate: 'desc' },
  });
  res.json(rows);
});

router.post('/payments', requireRoles(ADMIN), async (req, res) => {
  const { feeId, studentId, amountPaid, paymentMethod, receiptNumber, status } = req.body;
  const amount = Number(amountPaid);
  if (!feeId || !studentId || !Number.isFinite(amount) || amount <= 0 || !paymentMethod)
    return res.status(400).json({ error: 'Fee, student, valid payment amount and payment method are required' });
  const receipt = String(receiptNumber || `ALB-REC-${Date.now()}`).trim();
  const row = await prisma.payment.create({
    data: { feeId: String(feeId), studentId: String(studentId), amountPaid: amount, paymentMethod: String(paymentMethod).trim(), receiptNumber: receipt, status: status ? String(status) : 'Completed' },
    include: { fee: true, student: true },
  });
  res.status(201).json(row);
});

router.put('/payments/:id/status', requireRoles(ADMIN), async (req, res) => {
  const status = String(req.body.status || '').trim();
  if (!['Completed','Pending','Failed'].includes(status)) return res.status(400).json({ error: 'Invalid payment status' });
  const row = await prisma.payment.update({ where: { id: req.params.id }, data: { status } });
  res.json(row);
});

export default router;
