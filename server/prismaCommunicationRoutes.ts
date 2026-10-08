import { Router } from 'express';
import { prisma } from './prisma.ts';
import { AuthenticatedRequest, authenticateAny, requireRoles } from './auth.ts';

const router = Router();
router.use(authenticateAny);
const ADMIN = ['SUPER_ADMIN','ADMIN','PRINCIPAL','ACADEMIC_HEAD'] as any;

router.get('/announcements', async (req: AuthenticatedRequest, res) => {
  const user = req.authUser!;
  const audience = user.role === 'PARENT' ? 'PARENTS' : user.role === 'TEACHER' ? 'TEACHERS' : user.role === 'STUDENT' ? 'STUDENTS' : null;
  const rows = await prisma.announcement.findMany({
    where: audience ? { OR: [{ targetAudience: 'ALL' }, { targetAudience: audience }] } : undefined,
    orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
  });
  res.json(rows);
});

router.post('/announcements', requireRoles(ADMIN), async (req, res) => {
  const { title, content, targetAudience, isPinned, publishedAt } = req.body;
  if (!title?.trim() || !content?.trim()) return res.status(400).json({ error: 'Title and content are required' });
  const row = await prisma.announcement.create({
    data: {
      title: String(title).trim(),
      content: String(content).trim(),
      targetAudience: String(targetAudience || 'ALL').toUpperCase(),
      isPinned: Boolean(isPinned),
      ...(publishedAt ? { publishedAt: new Date(publishedAt) } : {}),
    },
  });
  res.status(201).json(row);
});

router.put('/announcements/:id', requireRoles(ADMIN), async (req, res) => {
  const { title, content, targetAudience, isPinned, publishedAt } = req.body;
  const row = await prisma.announcement.update({
    where: { id: req.params.id },
    data: {
      ...(title !== undefined ? { title: String(title).trim() } : {}),
      ...(content !== undefined ? { content: String(content).trim() } : {}),
      ...(targetAudience !== undefined ? { targetAudience: String(targetAudience).toUpperCase() } : {}),
      ...(isPinned !== undefined ? { isPinned: Boolean(isPinned) } : {}),
      ...(publishedAt !== undefined ? { publishedAt: new Date(publishedAt) } : {}),
    },
  });
  res.json(row);
});

router.delete('/announcements/:id', requireRoles(ADMIN), async (req, res) => {
  await prisma.announcement.delete({ where: { id: req.params.id } });
  res.json({ message: 'Announcement deleted successfully' });
});

router.get('/notifications', async (req: AuthenticatedRequest, res) => {
  const user = req.authUser!;
  const rows = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  res.json(rows);
});

router.patch('/notifications/:id/read', async (req: AuthenticatedRequest, res) => {
  const row = await prisma.notification.findFirst({ where: { id: req.params.id, userId: req.authUser!.id } });
  if (!row) return res.status(404).json({ error: 'Notification not found' });
  const updated = await prisma.notification.update({ where: { id: row.id }, data: { isRead: true } });
  res.json(updated);
});

router.post('/notifications/broadcast', requireRoles(ADMIN), async (req, res) => {
  const { title, message, role, linkUrl } = req.body;
  if (!title?.trim() || !message?.trim()) return res.status(400).json({ error: 'Title and message are required' });
  const where: any = { isActive: true };
  if (role) where.role = String(role).toUpperCase();
  const users = await prisma.user.findMany({ where, select: { id: true } });
  const rows = await prisma.notification.createMany({
    data: users.map(u => ({ userId: u.id, title: String(title).trim(), message: String(message).trim(), linkUrl: linkUrl ? String(linkUrl) : null })),
  });
  res.status(201).json({ created: rows.count });
});

router.get('/audit-logs', requireRoles(['SUPER_ADMIN','ADMIN'] as any), async (req, res) => {
  const where: any = {};
  if (req.query.userId) where.userId = String(req.query.userId);
  if (req.query.entity) where.entity = String(req.query.entity);
  if (req.query.action) where.action = String(req.query.action);
  const rows = await prisma.auditLog.findMany({
    where,
    include: { user: { select: { id: true, username: true, email: true, firstName: true, lastName: true, role: true } } },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
  res.json(rows);
});

router.post('/audit-logs', async (req: AuthenticatedRequest, res) => {
  const { action, entity, entityId, changes } = req.body;
  if (!action || !entity) return res.status(400).json({ error: 'Action and entity are required' });
  const row = await prisma.auditLog.create({
    data: {
      userId: req.authUser!.id || null,
      action: String(action).toUpperCase(),
      entity: String(entity),
      entityId: entityId ? String(entityId) : null,
      changes: changes == null ? null : typeof changes === 'string' ? changes : JSON.stringify(changes),
      ipAddress: req.ip || null,
    },
  });
  res.status(201).json(row);
});

export default router;
