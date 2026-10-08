import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { prisma } from './prisma.ts';
import {
  generateToken,
  comparePassword,
  hashPassword,
  requireAdmin,
  generatePortalToken,
  verifyPortalToken,
} from './auth.ts';
import {
  AdmissionApplication,
  NewsItem,
  SchoolEvent,
  GalleryImage,
  ContactMessage,
  SchoolSettings,
  PortalUser,
  UserRole,
} from '../src/types/index.ts';
import smsRoutes from './smsRoutes.ts';
import prismaSmsRoutes from './prismaSmsRoutes.ts';
import prismaAcademicRoutes from './prismaAcademicRoutes.ts';
import prismaFinanceRoutes from './prismaFinanceRoutes.ts';
import prismaCommunicationRoutes from './prismaCommunicationRoutes.ts';

const router = Router();

// Mount Prisma-backed ERP routes first so migrated endpoints take precedence.
router.use('/sms', prismaSmsRoutes);
router.use('/sms', prismaAcademicRoutes);
router.use('/sms', prismaFinanceRoutes);
router.use('/sms', prismaCommunicationRoutes);
router.use('/sms', smsRoutes);

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

// Get School Settings
router.get('/settings', async (_req: Request, res: Response) => {
  const settings = await prisma.schoolSettings.findUnique({ where: { id: 'default' } });
  res.json(settings || {
    id: 'default',
    schoolName: 'Albright Academy',
    slogan: 'Center of Excellence and Innovation',
    logoUrl: '/logo.png',
    phone: '0923014132',
    email: 'dinigaatrading@gmail.com',
    address: 'Sheggar city, Gefarsa Gujjee, kella',
    mapsUrl: 'https://maps.google.com/?q=Sheggar+city+Gefarsa+Gujjee+kella',
    mission: '',
    vision: '',
    about: '',
    principalName: '',
    principalMessage: '',
    principalPhotoUrl: '',
    updatedAt: new Date().toISOString(),
  });
});

// Get Published News
router.get('/news', async (_req: Request, res: Response) => {
  const published = await prisma.news.findMany({ where: { status: 'Published' }, orderBy: { publishedAt: 'desc' } });
  res.json(published);
});

// Get Single News by Slug
router.get('/news/:slug', async (req: Request, res: Response) => {
  const item = await prisma.news.findUnique({ where: { slug: req.params.slug } });
  if (!item) {
    res.status(404).json({ error: 'News article not found' });
    return;
  }
  res.json(item);
});

// Get Upcoming / Published Events
router.get('/events', async (_req: Request, res: Response) => {
  const events = await prisma.event.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(events);
});

// Get Single Event by Slug
router.get('/events/:slug', async (req: Request, res: Response) => {
  const event = await prisma.event.findUnique({ where: { slug: req.params.slug } });
  if (!event) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }
  res.json(event);
});

// Get Gallery Images (optional category filter)
router.get('/gallery', async (req: Request, res: Response) => {
  const { category } = req.query;
  const gallery = await prisma.galleryImage.findMany({
    where: category && category !== 'All' ? { category: String(category) } : undefined,
    orderBy: { createdAt: 'desc' },
  });
  res.json(gallery);
});

// Submit Admission Application
router.post('/admissions', async (req: Request, res: Response) => {
  const {
    firstName, middleName, lastName, dateOfBirth, gender, applyingGrade,
    previousSchool, guardianName, guardianPhone, guardianEmail, address,
    emergencyContact, additionalInformation,
  } = req.body;

  if (!firstName?.trim() || !lastName?.trim() || !dateOfBirth || !gender ||
      !applyingGrade || !guardianName?.trim() || !guardianPhone?.trim() ||
      !guardianEmail?.trim() || !address?.trim() || !emergencyContact?.trim()) {
    res.status(400).json({ error: 'Please fill in all required admission fields.' });
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(guardianEmail)) {
    res.status(400).json({ error: 'Please provide a valid parent/guardian email address.' });
    return;
  }

  const year = new Date().getFullYear();
  const referenceNumber = `ALB-${year}-${Date.now().toString().slice(-8)}`;
  const application = await prisma.admissionApplication.create({
    data: {
      referenceNumber,
      firstName: firstName.trim(),
      middleName: middleName?.trim() || null,
      lastName: lastName.trim(),
      dateOfBirth: String(dateOfBirth),
      gender: String(gender),
      applyingGrade: String(applyingGrade),
      previousSchool: previousSchool?.trim() || null,
      guardianName: guardianName.trim(),
      guardianPhone: guardianPhone.trim(),
      guardianEmail: guardianEmail.trim().toLowerCase(),
      address: address.trim(),
      emergencyContact: emergencyContact.trim(),
      additionalInformation: additionalInformation?.trim() || null,
      status: 'New',
    },
  });

  res.status(201).json({
    message: 'Application submitted successfully.',
    referenceNumber,
    application,
  });
});

// Submit Contact Message
router.post('/contact', async (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    res.status(400).json({ error: 'Name, email, subject, and message are required.' });
    return;
  }
  const item = await prisma.contactMessage.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      subject: subject.trim(),
      message: message.trim(),
    },
  });
  res.status(201).json({
    message: 'Your message has been sent successfully. We will be in touch shortly.',
    id: item.id,
  });
});

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

router.post('/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email or username and password are required.' });
    return;
  }
  const query = String(email).trim().toLowerCase();
  const admins = await prisma.admin.findMany({
    where: { OR: [{ email: query }, { name: query }] },
    take: 5,
  });
  const admin = admins.find(a => a.email.toLowerCase() === query || a.name.toLowerCase() === query || a.email.split('@')[0] === query || (query === 'admin' && a.email.toLowerCase().startsWith('admin')));
  if (!admin || !(await comparePassword(password, admin.passwordHash))) {
    res.status(401).json({ error: 'Invalid email/username or password.' });
    return;
  }
  const token = generateToken(admin.id);
  res.cookie('albright_admin_token', token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ token, user: { id: admin.id, name: admin.name, email: admin.email, createdAt: admin.createdAt } });
});

router.get('/auth/me', requireAdmin, async (req: Request, res: Response) => {
  const adminId = (req as any).adminId;
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin) {
    res.status(404).json({ error: 'Admin account not found.' });
    return;
  }

  res.json({
    user: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      createdAt: admin.createdAt,
    },
  });
});

router.post('/auth/logout', (req: Request, res: Response) => {
  res.clearCookie('albright_admin_token');
  res.json({ message: 'Logged out successfully.' });
});

router.post('/auth/change-password', requireAdmin, async (req: Request, res: Response) => {
  const adminId = (req as any).adminId;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 8) {
    res.status(400).json({ error: 'New password must be at least 8 characters.' });
    return;
  }

  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin) {
    res.status(404).json({ error: 'Admin not found.' });
    return;
  }

  const match = await comparePassword(currentPassword, admin.passwordHash);
  if (!match) {
    res.status(400).json({ error: 'Current password does not match.' });
    return;
  }

  await prisma.admin.update({ where: { id: adminId }, data: { passwordHash: await hashPassword(newPassword) } });

  res.json({ message: 'Password updated successfully.' });
});

// ==========================================
// PROTECTED ADMIN CRUD ENDPOINTS
// ==========================================

// Dashboard Metrics & Stats
router.get('/admin/stats', requireAdmin, async (_req: Request, res: Response) => {
  const [totalApplications, pendingApplications, publishedNews, upcomingEvents, unreadMessages, totalGalleryImages] = await Promise.all([
    prisma.admissionApplication.count(),
    prisma.admissionApplication.count({ where: { status: { in: ['New', 'Reviewing'] } } }),
    prisma.news.count({ where: { status: 'Published' } }),
    prisma.event.count({ where: { status: 'Upcoming' } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.galleryImage.count(),
  ]);
  res.json({ totalApplications, pendingApplications, publishedNews, upcomingEvents, unreadMessages, totalGalleryImages });
});

// Admin Applications
router.get('/admin/applications', requireAdmin, async (_req: Request, res: Response) => {
  const rows = await prisma.admissionApplication.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(rows);
});

router.patch('/admin/applications/:id/status', requireAdmin, async (req: Request, res: Response) => {
  const { status } = req.body;
  const valid = ['New', 'Reviewing', 'Accepted', 'Rejected'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const application = await prisma.admissionApplication.update({
    where: { id: req.params.id },
    data: { status: String(status), updatedAt: new Date() },
  });
  res.json({ message: `Application status updated to ${status}.`, application });
});

router.delete('/admin/applications/:id', requireAdmin, async (req: Request, res: Response) => {
  await prisma.admissionApplication.delete({ where: { id: req.params.id } });
  res.json({ message: 'Application deleted successfully.' });
});

// Admin News CRUD
router.get('/admin/news', requireAdmin, async (_req: Request, res: Response) => {
  res.json(await prisma.news.findMany({ orderBy: { createdAt: 'desc' } }));
});

router.post('/admin/news', requireAdmin, async (req: Request, res: Response) => {
  const { title, summary, content, imageUrl, author, status } = req.body;
  if (!title?.trim() || !content?.trim()) return res.status(400).json({ error: 'Title and content are required' });
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-6)}`;
  const row = await prisma.news.create({ data: {
    title: title.trim(), slug, summary: summary?.trim() || title.trim(), content: content.trim(),
    imageUrl: imageUrl?.trim() || '/school-placeholder.jpg', author: author?.trim() || 'School Administration',
    status: status === 'Draft' ? 'Draft' : 'Published',
  }});
  res.status(201).json({ message: 'News article created successfully.', news: row });
});

router.put('/admin/news/:id', requireAdmin, async (req: Request, res: Response) => {
  const { title, summary, content, imageUrl, author, status } = req.body;
  const data: any = {};
  if (title !== undefined) data.title = String(title).trim();
  if (summary !== undefined) data.summary = String(summary).trim();
  if (content !== undefined) data.content = String(content).trim();
  if (imageUrl !== undefined) data.imageUrl = String(imageUrl).trim();
  if (author !== undefined) data.author = String(author).trim();
  if (status !== undefined) data.status = String(status);
  if (data.title) data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-6)}`;
  const row = await prisma.news.update({ where: { id: req.params.id }, data });
  res.json({ message: 'News article updated successfully.', news: row });
});

router.delete('/admin/news/:id', requireAdmin, async (req: Request, res: Response) => {
  await prisma.news.delete({ where: { id: req.params.id } });
  res.json({ message: 'News article deleted successfully.' });
});

// Admin Events CRUD
router.get('/admin/events', requireAdmin, async (_req: Request, res: Response) => {
  res.json(await prisma.event.findMany({ orderBy: { createdAt: 'desc' } }));
});

router.post('/admin/events', requireAdmin, async (req: Request, res: Response) => {
  const { title, description, date, startTime, endTime, location, imageUrl, status } = req.body;
  if (!title?.trim() || !description?.trim() || !date || !startTime || !location?.trim()) return res.status(400).json({ error: 'Please provide all required event details.' });
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-6)}`;
  const row = await prisma.event.create({ data: {
    title: title.trim(), slug, description: description.trim(), date: String(date), startTime: String(startTime).trim(),
    endTime: endTime?.trim() || '', location: location.trim(), imageUrl: imageUrl?.trim() || null,
    status: status ? String(status) : 'Upcoming',
  }});
  res.status(201).json({ message: 'Event created successfully.', event: row });
});

router.put('/admin/events/:id', requireAdmin, async (req: Request, res: Response) => {
  const { title, description, date, startTime, endTime, location, imageUrl, status } = req.body;
  const data: any = {};
  if (title !== undefined) data.title = String(title).trim();
  if (description !== undefined) data.description = String(description).trim();
  if (date !== undefined) data.date = String(date);
  if (startTime !== undefined) data.startTime = String(startTime).trim();
  if (endTime !== undefined) data.endTime = String(endTime).trim();
  if (location !== undefined) data.location = String(location).trim();
  if (imageUrl !== undefined) data.imageUrl = imageUrl ? String(imageUrl).trim() : null;
  if (status !== undefined) data.status = String(status);
  if (data.title) data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-6)}`;
  const row = await prisma.event.update({ where: { id: req.params.id }, data });
  res.json({ message: 'Event updated successfully.', event: row });
});

router.delete('/admin/events/:id', requireAdmin, async (req: Request, res: Response) => {
  await prisma.event.delete({ where: { id: req.params.id } });
  res.json({ message: 'Event deleted successfully.' });
});

// Admin Gallery CRUD
router.get('/admin/gallery', requireAdmin, async (_req: Request, res: Response) => {
  res.json(await prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } }));
});

router.post('/admin/gallery', requireAdmin, async (req: Request, res: Response) => {
  const { title, description, imageUrl, category } = req.body;
  if (!title?.trim() || !imageUrl?.trim() || !category) return res.status(400).json({ error: 'Title, category, and image URL are required.' });
  const row = await prisma.galleryImage.create({ data: {
    title: title.trim(), description: description?.trim() || null, imageUrl: imageUrl.trim(), category: String(category),
  }});
  res.status(201).json({ message: 'Image added to gallery.', image: row });
});

router.delete('/admin/gallery/:id', requireAdmin, async (req: Request, res: Response) => {
  await prisma.galleryImage.delete({ where: { id: req.params.id } });
  res.json({ message: 'Image removed from gallery successfully.' });
});

// Admin Messages
router.get('/admin/messages', requireAdmin, async (_req: Request, res: Response) => {
  res.json(await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } }));
});

router.patch('/admin/messages/:id/read', requireAdmin, async (req: Request, res: Response) => {
  const row = await prisma.contactMessage.update({ where: { id: req.params.id }, data: { isRead: req.body.isRead !== undefined ? Boolean(req.body.isRead) : true } });
  res.json({ message: 'Message status updated.', messageItem: row });
});

router.delete('/admin/messages/:id', requireAdmin, async (req: Request, res: Response) => {
  await prisma.contactMessage.delete({ where: { id: req.params.id } });
  res.json({ message: 'Message deleted successfully.' });
});

// Admin School Settings
router.put('/admin/settings', requireAdmin, async (req: Request, res: Response) => {
  const allowed = ['schoolName','slogan','logoUrl','phone','email','address','mapsUrl','latitude','longitude','facebookUrl','telegramUrl','youtubeUrl','mission','vision','about','principalName','principalMessage','principalPhotoUrl'];
  const updates: any = {};
  for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key];
  const settings = await prisma.schoolSettings.upsert({
    where: { id: 'default' },
    update: updates,
    create: { id: 'default', ...updates, mission: String(updates.mission || ''), vision: String(updates.vision || ''), about: String(updates.about || '') },
  });
  res.json({ message: 'School settings updated successfully.', settings });
});

// ==========================================
// PORTAL AUTHENTICATION// ==========================================
// PORTAL AUTHENTICATION (TEACHER & PARENT)
// ==========================================

router.post('/portal/login', async (req: Request, res: Response) => {
  const { usernameOrEmail, password, role } = req.body;
  if (!usernameOrEmail || !password) {
    res.status(400).json({ error: 'Username/Email and password are required.' });
    return;
  }
  const normalizedInput = String(usernameOrEmail).trim().toLowerCase();
  const userRecord = await prisma.user.findFirst({
    where: { OR: [{ username: normalizedInput }, { email: normalizedInput }] },
    include: { teacherProfile: true, parentProfile: true, studentProfile: true },
  });
  if (!userRecord) { res.status(401).json({ error: 'Invalid username/email or password.' }); return; }

  if (role && userRecord.role !== String(role).toUpperCase()) {
    const roleDisplay = userRecord.role === 'TEACHER' ? 'Teacher' : userRecord.role === 'PARENT' ? 'Parent' : userRecord.role === 'STUDENT' ? 'Student' : String(userRecord.role);
    res.status(403).json({ error: `Account role mismatch: This account is registered as a ${roleDisplay}.` });
    return;
  }
  if (!userRecord.isActive) { res.status(403).json({ error: 'Your portal account is currently suspended. Please contact the school administration.' }); return; }
  if (!(await comparePassword(password, userRecord.passwordHash))) {
    res.status(401).json({ error: 'Invalid username/email or password.' }); return;
  }

  const token = generatePortalToken(userRecord.id, userRecord.role);
  const fullName = `${userRecord.firstName} ${userRecord.lastName}`.trim();
  const safeUser = {
    id: userRecord.id, fullName, username: userRecord.username || '', email: userRecord.email,
    role: userRecord.role, status: userRecord.isActive ? 'ACTIVE' : 'SUSPENDED',
    createdAt: userRecord.createdAt.toISOString(), updatedAt: userRecord.updatedAt.toISOString(),
  };
  res.cookie('albright_portal_token', token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ token, user: safeUser, message: `Welcome to Albright Academy ${role === 'TEACHER' ? 'Teacher' : role === 'STUDENT' ? 'Student' : 'Parent'} Portal, ${fullName}!` });
});

router.get('/portal/me', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : req.cookies?.albright_portal_token;
  if (!token) { res.status(401).json({ error: 'No token provided.' }); return; }
  const verified = await verifyPortalToken(token);
  if (!verified) { res.status(401).json({ error: 'Invalid or expired session token.' }); return; }
  const user = await prisma.user.findUnique({ where: { id: verified.userId } });
  if (!user || !user.isActive || user.role !== verified.role) { res.status(401).json({ error: 'User not found or inactive.' }); return; }
  res.json({ user: {
    id: user.id, fullName: `${user.firstName} ${user.lastName}`.trim(), username: user.username || '',
    email: user.email, role: user.role, status: user.isActive ? 'ACTIVE' : 'SUSPENDED',
    createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString(),
  }});
});

// ==========================================
// ADMIN USER MANAGEMENT (TEACHERS, PARENTS & STUDENTS)
// ==========================================

const portalRoles = ['TEACHER', 'PARENT', 'STUDENT'] as const;

function portalUserResponse(user: any) {
  const profile = user.teacherProfile || user.parentProfile || user.studentProfile;
  return {
    id: user.id,
    fullName: `${user.firstName} ${user.lastName}`.trim(),
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.isActive ? 'ACTIVE' : 'SUSPENDED',
    phone: user.phone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    employeeId: profile?.teacherCode,
    studentReference: profile?.studentCode,
    studentName: profile?.students?.[0] ? `${profile.students[0].firstName} ${profile.students[0].lastName}` : undefined,
    relationship: profile?.relationship,
    address: profile?.address,
    gender: profile?.gender,
    dateOfBirth: profile?.dateOfBirth,
  };
}

router.get('/admin/users', requireAdmin, async (req: Request, res: Response) => {
  const { role, search } = req.query;
  const where: any = {};
  if (role && role !== 'ALL') where.role = String(role).toUpperCase();
  if (search && typeof search === 'string') {
    const q = search.trim();
    where.OR = [
      { firstName: { contains: q, mode: 'insensitive' } },
      { lastName: { contains: q, mode: 'insensitive' } },
      { username: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q, mode: 'insensitive' } },
    ];
  }
  const users = await prisma.user.findMany({
    where,
    include: {
      teacherProfile: true,
      parentProfile: { include: { students: true } },
      studentProfile: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ users: users.map(portalUserResponse) });
});

router.post('/admin/users', requireAdmin, async (req: Request, res: Response) => {
  const {
    fullName, username, password, role, email, phone, status = 'ACTIVE',
    employeeId, studentReference, studentGrade, relationship = 'Parent',
    address, enrolledGrade, section, guardianName, guardianPhone, gender, dateOfBirth,
  } = req.body;

  if (!fullName?.trim() || !username?.trim() || !password || !role) {
    return res.status(400).json({ error: 'Full name, username, password, and role are required.' });
  }
  const cleanRole = String(role).toUpperCase();
  if (!portalRoles.includes(cleanRole as any)) return res.status(400).json({ error: 'Role must be TEACHER, PARENT, or STUDENT.' });
  if (String(password).length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });

  const names = fullName.trim().split(/\s+/);
  const firstName = names.shift() || fullName.trim();
  const lastName = names.join(' ') || firstName;
  const cleanUsername = String(username).trim().toLowerCase();
  const cleanEmail = String(email || `${cleanUsername}@albright.local`).trim().toLowerCase();

  if (await prisma.user.findFirst({ where: { OR: [{ username: cleanUsername }, { email: cleanEmail }] } })) {
    return res.status(409).json({ error: `Username or email is already in use.` });
  }

  if (cleanRole === 'STUDENT' && !gender) {
    return res.status(400).json({ error: 'Gender is required when creating a student account.' });
  }

  const passwordHash = await hashPassword(String(password));
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        firstName, lastName, username: cleanUsername, email: cleanEmail, passwordHash,
        role: cleanRole as any, phone: phone?.trim() || null, isActive: status !== 'SUSPENDED',
      },
    });

    if (cleanRole === 'TEACHER') {
      await tx.teacher.create({
        data: {
          userId: user.id,
          teacherCode: employeeId?.trim() || `ALB-TEA-${Date.now().toString().slice(-6)}`,
          fullName: fullName.trim(),
          qualification: 'Not specified',
          specialization: 'General',
          phone: phone?.trim() || '',
          email: cleanEmail,
        },
      });
    } else if (cleanRole === 'PARENT') {
      const parent = await tx.parent.create({
        data: {
          userId: user.id,
          fullName: fullName.trim(),
          relationship: String(relationship || 'Parent'),
          phone: phone?.trim() || '',
          email: cleanEmail,
          address: address?.trim() || null,
        },
      });
      if (studentReference) {
        await tx.student.updateMany({ where: { studentCode: String(studentReference).trim() }, data: { parentId: parent.id } });
      }
    } else {
      if (!dateOfBirth) throw new Error('Date of birth is required when creating a student account.');
      await tx.student.create({
        data: {
          userId: user.id,
          studentCode: studentReference?.trim() || `ALB-STU-${Date.now().toString().slice(-8)}`,
          firstName, middleName: null, lastName,
          dateOfBirth: new Date(dateOfBirth),
          gender: String(gender),
          parentId: null,
        },
      });
    }
    return tx.user.findUnique({
      where: { id: user.id },
      include: { teacherProfile: true, parentProfile: { include: { students: true } }, studentProfile: true },
    });
  });

  res.status(201).json({
    message: `${cleanRole === 'TEACHER' ? 'Teacher' : cleanRole === 'PARENT' ? 'Parent' : 'Student'} user account created successfully.`,
    user: portalUserResponse(result),
  });
});

router.put('/admin/users/:id', requireAdmin, async (req: Request, res: Response) => {
  const existing = await prisma.user.findUnique({
    where: { id: req.params.id },
    include: { teacherProfile: true, parentProfile: { include: { students: true } }, studentProfile: true },
  });
  if (!existing || !portalRoles.includes(existing.role as any)) return res.status(404).json({ error: 'User not found.' });

  const updates = req.body;
  const data: any = {};
  if (updates.username !== undefined) data.username = String(updates.username).trim().toLowerCase();
  if (updates.email !== undefined) data.email = String(updates.email).trim().toLowerCase();
  if (updates.fullName) {
    const parts = String(updates.fullName).trim().split(/\s+/);
    data.firstName = parts.shift() || existing.firstName;
    data.lastName = parts.join(' ') || data.firstName;
  }
  if (updates.phone !== undefined) data.phone = updates.phone ? String(updates.phone).trim() : null;
  if (updates.status !== undefined) data.isActive = String(updates.status).toUpperCase() !== 'SUSPENDED';
  if (updates.password?.trim()) {
    if (String(updates.password).trim().length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    data.passwordHash = await hashPassword(String(updates.password).trim());
  }

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({ where: { id: existing.id }, data });
    if (user.role === 'TEACHER' && existing.teacherProfile) {
      await tx.teacher.update({
        where: { id: existing.teacherProfile.id },
        data: {
          fullName: updates.fullName ? String(updates.fullName).trim() : undefined,
          teacherCode: updates.employeeId ? String(updates.employeeId).trim() : undefined,
          phone: updates.phone !== undefined ? String(updates.phone || '') : undefined,
          email: updates.email !== undefined ? String(updates.email || '') : undefined,
        },
      });
    }
    if (user.role === 'PARENT' && existing.parentProfile) {
      await tx.parent.update({
        where: { id: existing.parentProfile.id },
        data: {
          fullName: updates.fullName ? String(updates.fullName).trim() : undefined,
          relationship: updates.relationship !== undefined ? String(updates.relationship) : undefined,
          phone: updates.phone !== undefined ? String(updates.phone || '') : undefined,
          email: updates.email !== undefined ? String(updates.email || '') : undefined,
          address: updates.address !== undefined ? (updates.address ? String(updates.address) : null) : undefined,
        },
      });
    }
    return tx.user.findUnique({
      where: { id: user.id },
      include: { teacherProfile: true, parentProfile: { include: { students: true } }, studentProfile: true },
    });
  });
  res.json({ message: 'User updated successfully.', user: portalUserResponse(result) });
});

router.delete('/admin/users/:id', requireAdmin, async (req: Request, res: Response) => {
  const existing = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!existing || !portalRoles.includes(existing.role as any)) return res.status(404).json({ error: 'User not found.' });
  await prisma.user.delete({ where: { id: existing.id } });
  res.json({ message: 'User account deleted successfully.' });
});

// ==========================================
// GEMINI CHATBOT API (MULTI-TURN)
// ==========================================

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

const SYSTEM_INSTRUCTIONS = {
  general: `You are the Official AI Academic Counselor and Admissions Assistant for Albright Academy.
Institution: Albright Academy — Center of Excellence and Innovation.
Accreditation: Fully licensed KG1 through Grade 8 (Early Childhood KG1-KG3, Lower Primary 1-4, Upper Primary 5-8).
Location: Sheggar city, Gefarsa Gujjee, kella, Oromia, Ethiopia.
Admissions: Online applications are open for the 2026 Academic Year on our admissions page (/admissions).
Contact Information:
- Phone: 0923014132
- Email: dinigaatrading@gmail.com
- Office Hours: Monday – Friday: 8:00 AM – 4:30 PM | Saturday: 8:30 AM – 12:30 PM
Key Facilities:
- Advanced STEM and Robotics computer laboratory
- Fully equipped science lab (biology, chemistry, physics experiments)
- Modern library with digital learning stations
- Smart interactive multimedia classrooms
- Outdoor sports playground & athletic facilities
- Hygienic, nutritious student cafeteria
- Safe school bus transportation service with tracking
Portals available: Parent Portal (/parent/login), Teacher Portal (/teacher/login), Student Portal (/student/login), and Admin Portal (/admin/login).
Tone & Language:
- Always warm, encouraging, polite, supportive, and educational.
- Fluently assist in English, Amharic (አማርኛ), and Afaan Oromoo. Respond in the language used by the user.
- If asked about specific student marks or confidential records, kindly direct the parent or student to log into their portal or contact the school office directly.`,

  fast: `You are Albright Academy's Instant Q&A Assistant.
Role: Provide fast, concise, accurate, direct answers regarding Albright Academy (KG1–Grade 8, Center of Excellence and Innovation in Sheggar city, Gefarsa Gujjee, kella).
Contacts: Phone 0923014132 | Email dinigaatrading@gmail.com.
Keep responses concise, bulleted where appropriate, and fast to read. Provide answers in English, Amharic, or Afaan Oromoo depending on the user's inquiry.`,

  complex: `You are Albright Academy's Senior Pedagogical & Curriculum Advisor.
Specialty: Deep educational reasoning, KG1–Grade 8 curriculum alignment (integrating Ethiopian national educational standards with 21st-century STEM and English-medium mastery), early childhood phonics & numeracy foundations, differentiated instruction, student character building, and academic development strategies.
Institution: Albright Academy (Center of Excellence and Innovation), Sheggar city, Gefarsa Gujjee, kella.
Phone: 0923014132 | Email: dinigaatrading@gmail.com.
Provide detailed, articulate, well-structured pedagogical analysis and guidance in English, Amharic, or Afaan Oromoo.`,
};

function generateSchoolKnowledgeFallback(query: string, language: string = 'en'): string {
  const q = query.toLowerCase();

  if (language === 'am' || /[\u1200-\u137F]/.test(query)) {
    if (q.includes('ምዝገባ') || q.includes('ማመልከቻ') || q.includes('አመጋገብ') || q.includes('ቅበላ')) {
      return `እንኳን ወደ ኦልብራይት አካዳሚ (Albright Academy) በደህና መጡ! 
የ2026 የትምህርት ዘመን የቅበላ ምዝገባ ከKG1 እስከ 8ኛ ክፍል ተከፍቷል። 
የመስመር ላይ ማመልከቻዎን በድረ-ገጻችን የመግቢያ ክፍል (/admissions) በቀጥታ መሙላት ይችላሉ። 
ለበለጠ መረጃ በስልክ 0923014132 ይደውሉ ወይም በ dinigaatrading@gmail.com ያግኙን።`;
    }
    if (q.includes('ክፍያ') || q.includes('ዋጋ') || q.includes('ብር')) {
      return `የኦልብራይት አካዳሚ የትምህርት ክፍያ እንደ ክፍሉ ደረጃ (ከKG1 እስከ 8ኛ ክፍል) ይለያያል። 
ትምህርት ቤታችን ተመጣጣኝና ጥራት ያለው ትምህርት ያቀርባል። ዝርዝር የክፍያ መረጃንና የትራንስፖርት አማራጮችን ለማወቅ እባክዎ በስልክ 0923014132 የትምህርት ቤታችንን አስተዳደር ያነጋግሩ።`;
    }
    if (q.includes('አድራሻ') || q.includes('የት ነው') || q.includes('ቦታ') || q.includes('መገኛ')) {
      return `የኦልብራይት አካዳሚ ካምፓስ የሚገኘው በሸገር ከተማ፣ ገፈርሳ ጉጅ፣ ኬላ አጠገብ ነው። 
የስራ ሰዓት፡ ከሰኞ እስከ አርብ ከጠዋቱ 2:00 እስከ 10:30፤ ቅዳሜ ከ2:30 እስከ 6:30 ነው።`;
    }
    return `እንኳን ወደ ኦልብራይት አካዳሚ (Albright Academy) የትምህርት ረዳት በደህና መጡ! 
ትምህርት ቤታችን ከKG1 እስከ 8ኛ ክፍል ጥራት ያለውና የላቀ የSTEM፣ ቋንቋ እና የፈጠራ ትምህርት ይሰጣል። 
ስለ ምዝገባ፣ የትምህርት ፕሮግራሞች፣ ላቦራቶሪና የትራንስፖርት አገልግሎት ጥያቄ ካለዎት በደስታ እመልሳለሁ!`;
  }

  if (language === 'om' || q.includes('galmee') || q.includes('kaffaltii') || q.includes('bakka') || q.includes('akkam')) {
    if (q.includes('galmee') || q.includes('iyyata') || q.includes('admissions')) {
      return `Baga gara Akadaamii Olbiraayit (Albright Academy) nagaan dhuftan! 
Galmeen barattoota haaraa bara barnootaa 2026 KG1 hanga kutaa 8ffaatti banaadha. 
Foomii galmee sarara irraa (online) fuula /admissions irratti guutuu dandeessu. 
Odeeffannoo dabalataaf bilbila 0923014132 ykn dinigaatrading@gmail.com fayyadamaa.`;
    }
    if (q.includes('bakka') || q.includes('teessoo') || q.includes('location')) {
      return `Kaampaasiin Akadaamii Olbiraayit magaalaa Shaggar, Gafarsa Gujjii, keellatti argama. 
Sa'aatiin Hojii: Wiixata – Jimaata: 8:00 AM – 4:30 PM | Sanbata: 8:30 AM – 12:30 PM.`;
    }
    return `Baga gara gargaaraa AI Akadaamii Olbiraayit nagaan dhuftan! 
Manni barnootaa keenya KG1 hanga kutaa 8ffaatti barnoota qulqullina qabu, kalaqaa fi teeknooloojii waliin kenna. 
Waa'ee galmee, kaffaltii, tajaajila geejjibaa fi dareewwan keenyaa na gaafachuu dandeessu!`;
  }

  // English fallback
  if (q.includes('admission') || q.includes('apply') || q.includes('register') || q.includes('enroll')) {
    return `Welcome to Albright Academy! 
Admissions for the 2026 Academic Year are officially open for KG1 through Grade 8. 
You can submit your online application directly via our Admissions page (/admissions) or visit the campus registry office. 
For assistance, please call our admissions line at 0923014132 or email dinigaatrading@gmail.com.`;
  }
  if (q.includes('fee') || q.includes('cost') || q.includes('tuition')) {
    return `Albright Academy offers competitive, high-value tuition rates covering academic instruction, STEM workshops, and core co-curriculars across Kindergarten and Grades 1–8. 
Detailed fee schedules and optional bus transport rates are provided by our finance office. Please reach out to 0923014132 or dinigaatrading@gmail.com for a comprehensive breakdown.`;
  }
  if (q.includes('location') || q.includes('where') || q.includes('address')) {
    return `Albright Academy is conveniently located at Sheggar city, Gefarsa Gujjee, kella, Ethiopia. 
Our administrative office is open Monday – Friday from 8:00 AM to 4:30 PM, and Saturday from 8:30 AM to 12:30 PM. Safe school bus routes service neighboring communities.`;
  }
  if (q.includes('curriculum') || q.includes('program') || q.includes('grade') || q.includes('stem')) {
    return `Albright Academy provides a comprehensive KG1–Grade 8 curriculum combining rigorous national academic standards with enhanced English-medium instruction, hands-on STEM robotics, digital literacy, arts, sports, and holistic character education.`;
  }

  return `Welcome to Albright Academy — Center of Excellence and Innovation! 
I am your dedicated AI Academic Assistant. I can assist you with information about our KG1–Grade 8 academic programs, online admissions for 2026, STEM facilities, campus location in Sheggar city, and school portals. How may I help you today?`;
}

router.post('/chat', async (req: Request, res: Response) => {
  const { messages, taskType = 'general', language = 'en' } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Messages array is required.' });
    return;
  }

  // Model selection per instructions:
  // - gemini-3.1-pro-preview for complex tasks
  // - gemini-3.5-flash for general tasks
  // - gemini-3.1-flash-lite for fast tasks
  let targetModel = 'gemini-3.5-flash';
  if (taskType === 'complex') {
    targetModel = 'gemini-3.1-pro-preview';
  } else if (taskType === 'fast') {
    targetModel = 'gemini-3.1-flash-lite';
  }

  const ai = getGeminiClient();

  // If no API key configured, use school knowledge engine
  if (!ai) {
    const lastMsg = messages[messages.length - 1]?.content || '';
    const fallbackReply = generateSchoolKnowledgeFallback(lastMsg, language);
    res.json({
      reply: fallbackReply,
      modelUsed: `${targetModel} (Institutional Knowledge Engine)`,
    });
    return;
  }

  try {
    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const systemInstruction =
      SYSTEM_INSTRUCTIONS[taskType as keyof typeof SYSTEM_INSTRUCTIONS] ||
      SYSTEM_INSTRUCTIONS.general;

    let response;
    try {
      response = await ai.models.generateContent({
        model: targetModel,
        contents: formattedContents,
        config: {
          systemInstruction,
        },
      });
    } catch (err: any) {
      // If gemini-3.1-pro-preview requires paid key or encounters quota, fallback to gemini-3.5-flash
      if (targetModel === 'gemini-3.1-pro-preview') {
        targetModel = 'gemini-3.5-flash';
        response = await ai.models.generateContent({
          model: targetModel,
          contents: formattedContents,
          config: {
            systemInstruction,
          },
        });
      } else {
        throw err;
      }
    }

    const reply = response.text || 'I am Albright Academy AI Assistant. How can I assist you today?';
    res.json({
      reply,
      modelUsed: targetModel,
    });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    const lastMsg = messages[messages.length - 1]?.content || '';
    const fallbackReply = generateSchoolKnowledgeFallback(lastMsg, language);
    res.json({
      reply: fallbackReply,
      modelUsed: 'Institutional Knowledge Engine',
      note: error.message,
    });
  }
});

export default router;
