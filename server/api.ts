import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import {
  getDb,
  saveDb,
  generateReferenceNumber,
} from './db.ts';
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

const router = Router();

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

// Get School Settings
router.get('/settings', (req: Request, res: Response) => {
  const db = getDb();
  res.json(db.settings);
});

// Get Published News
router.get('/news', (req: Request, res: Response) => {
  const db = getDb();
  const published = db.news.filter((item) => item.status === 'Published');
  res.json(published);
});

// Get Single News by Slug
router.get('/news/:slug', (req: Request, res: Response) => {
  const db = getDb();
  const item = db.news.find((n) => n.slug === req.params.slug);
  if (!item) {
    res.status(404).json({ error: 'News article not found' });
    return;
  }
  res.json(item);
});

// Get Upcoming / Published Events
router.get('/events', (req: Request, res: Response) => {
  const db = getDb();
  res.json(db.events);
});

// Get Single Event by Slug
router.get('/events/:slug', (req: Request, res: Response) => {
  const db = getDb();
  const event = db.events.find((e) => e.slug === req.params.slug);
  if (!event) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }
  res.json(event);
});

// Get Gallery Images (optional category filter)
router.get('/gallery', (req: Request, res: Response) => {
  const db = getDb();
  const { category } = req.query;
  if (category && category !== 'All') {
    const filtered = db.gallery.filter((img) => img.category === category);
    res.json(filtered);
    return;
  }
  res.json(db.gallery);
});

// Submit Admission Application
router.post('/admissions', (req: Request, res: Response) => {
  const {
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    gender,
    applyingGrade,
    previousSchool,
    guardianName,
    guardianPhone,
    guardianEmail,
    address,
    emergencyContact,
    additionalInformation,
  } = req.body;

  // Validation
  if (
    !firstName?.trim() ||
    !lastName?.trim() ||
    !dateOfBirth ||
    !gender ||
    !applyingGrade ||
    !guardianName?.trim() ||
    !guardianPhone?.trim() ||
    !guardianEmail?.trim() ||
    !address?.trim() ||
    !emergencyContact?.trim()
  ) {
    res.status(400).json({ error: 'Please fill in all required admission fields.' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(guardianEmail)) {
    res.status(400).json({ error: 'Please provide a valid parent/guardian email address.' });
    return;
  }

  const db = getDb();
  const referenceNumber = generateReferenceNumber();
  const newApplication: AdmissionApplication = {
    id: `app-${Date.now()}`,
    referenceNumber,
    firstName: firstName.trim(),
    middleName: middleName?.trim() || '',
    lastName: lastName.trim(),
    dateOfBirth,
    gender,
    applyingGrade,
    previousSchool: previousSchool?.trim() || '',
    guardianName: guardianName.trim(),
    guardianPhone: guardianPhone.trim(),
    guardianEmail: guardianEmail.trim().toLowerCase(),
    address: address.trim(),
    emergencyContact: emergencyContact.trim(),
    additionalInformation: additionalInformation?.trim() || '',
    status: 'New',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.applications.unshift(newApplication);
  saveDb(db);

  res.status(201).json({
    message: 'Application submitted successfully.',
    referenceNumber,
    application: newApplication,
  });
});

// Submit Contact Message
router.post('/contact', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    res.status(400).json({ error: 'Name, email, subject, and message are required.' });
    return;
  }

  const db = getDb();
  const newMessage: ContactMessage = {
    id: `msg-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || '',
    subject: subject.trim(),
    message: message.trim(),
    isRead: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.messages.unshift(newMessage);
  saveDb(db);

  res.status(201).json({
    message: 'Your message has been sent successfully. We will be in touch shortly.',
    id: newMessage.id,
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

  const query = email.trim().toLowerCase();
  const db = getDb();
  const admin = db.admins.find((a) => {
    const adminEmail = a.email.toLowerCase();
    const adminName = a.name.toLowerCase();
    return (
      adminEmail === query ||
      adminName === query ||
      adminEmail.split('@')[0] === query ||
      (query === 'admin' && adminEmail.startsWith('admin'))
    );
  });

  if (!admin) {
    res.status(401).json({ error: 'Invalid email/username or password.' });
    return;
  }

  const match = await comparePassword(password, admin.passwordHash);
  if (!match) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const token = generateToken(admin.id);

  // Set HTTP-only cookie
  res.cookie('albright_admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    token,
    user: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      createdAt: admin.createdAt,
    },
  });
});

router.get('/auth/me', requireAdmin, (req: Request, res: Response) => {
  const adminId = (req as any).adminId;
  const db = getDb();
  const admin = db.admins.find((a) => a.id === adminId);
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

  const db = getDb();
  const admin = db.admins.find((a) => a.id === adminId);
  if (!admin) {
    res.status(404).json({ error: 'Admin not found.' });
    return;
  }

  const match = await comparePassword(currentPassword, admin.passwordHash);
  if (!match) {
    res.status(400).json({ error: 'Current password does not match.' });
    return;
  }

  admin.passwordHash = await hashPassword(newPassword);
  saveDb(db);

  res.json({ message: 'Password updated successfully.' });
});

// ==========================================
// PROTECTED ADMIN CRUD ENDPOINTS
// ==========================================

// Dashboard Metrics & Stats
router.get('/admin/stats', requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  const stats = {
    totalApplications: db.applications.length,
    pendingApplications: db.applications.filter((a) => a.status === 'New' || a.status === 'Reviewing').length,
    publishedNews: db.news.filter((n) => n.status === 'Published').length,
    upcomingEvents: db.events.filter((e) => e.status === 'Upcoming').length,
    unreadMessages: db.messages.filter((m) => !m.isRead).length,
    totalGalleryImages: db.gallery.length,
  };
  res.json(stats);
});

// Admin Applications
router.get('/admin/applications', requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  res.json(db.applications);
});

router.patch('/admin/applications/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  const valid = ['New', 'Reviewing', 'Accepted', 'Rejected'];
  if (!valid.includes(status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  const db = getDb();
  const app = db.applications.find((a) => a.id === req.params.id);
  if (!app) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  app.status = status;
  app.updatedAt = new Date().toISOString();
  saveDb(db);

  res.json({ message: `Application status updated to ${status}.`, application: app });
});

router.delete('/admin/applications/:id', requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  const initialLen = db.applications.length;
  db.applications = db.applications.filter((a) => a.id !== req.params.id);

  if (db.applications.length === initialLen) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  saveDb(db);
  res.json({ message: 'Application deleted successfully.' });
});

// Admin News CRUD
router.get('/admin/news', requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  res.json(db.news);
});

router.post('/admin/news', requireAdmin, (req: Request, res: Response) => {
  const { title, summary, content, imageUrl, author, status } = req.body;

  if (!title?.trim() || !content?.trim()) {
    res.status(400).json({ error: 'Title and content are required' });
    return;
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

  const db = getDb();
  const newItem: NewsItem = {
    id: `news-${Date.now()}`,
    title: title.trim(),
    slug,
    summary: summary?.trim() || title.trim(),
    content: content.trim(),
    imageUrl:
      imageUrl?.trim() ||
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
    author: author?.trim() || 'School Administration',
    status: status === 'Draft' ? 'Draft' : 'Published',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.news.unshift(newItem);
  saveDb(db);

  res.status(201).json({ message: 'News article created successfully.', news: newItem });
});

router.put('/admin/news/:id', requireAdmin, (req: Request, res: Response) => {
  const { title, summary, content, imageUrl, author, status } = req.body;
  const db = getDb();
  const item = db.news.find((n) => n.id === req.params.id);

  if (!item) {
    res.status(404).json({ error: 'News item not found' });
    return;
  }

  if (title) item.title = title.trim();
  if (summary !== undefined) item.summary = summary.trim();
  if (content) item.content = content.trim();
  if (imageUrl) item.imageUrl = imageUrl.trim();
  if (author) item.author = author.trim();
  if (status) item.status = status;
  item.updatedAt = new Date().toISOString();

  saveDb(db);
  res.json({ message: 'News article updated successfully.', news: item });
});

router.delete('/admin/news/:id', requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  const initialLen = db.news.length;
  db.news = db.news.filter((n) => n.id !== req.params.id);

  if (db.news.length === initialLen) {
    res.status(404).json({ error: 'News article not found' });
    return;
  }

  saveDb(db);
  res.json({ message: 'News article deleted successfully.' });
});

// Admin Events CRUD
router.post('/admin/events', requireAdmin, (req: Request, res: Response) => {
  const { title, description, date, startTime, endTime, location, imageUrl, status } = req.body;

  if (!title?.trim() || !description?.trim() || !date || !startTime || !location?.trim()) {
    res.status(400).json({ error: 'Please provide all required event details.' });
    return;
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

  const db = getDb();
  const newEvent: SchoolEvent = {
    id: `event-${Date.now()}`,
    title: title.trim(),
    slug,
    description: description.trim(),
    date,
    startTime: startTime.trim(),
    endTime: endTime?.trim() || '',
    location: location.trim(),
    imageUrl:
      imageUrl?.trim() ||
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
    status: status || 'Upcoming',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.events.unshift(newEvent);
  saveDb(db);

  res.status(201).json({ message: 'Event created successfully.', event: newEvent });
});

router.put('/admin/events/:id', requireAdmin, (req: Request, res: Response) => {
  const { title, description, date, startTime, endTime, location, imageUrl, status } = req.body;
  const db = getDb();
  const event = db.events.find((e) => e.id === req.params.id);

  if (!event) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }

  if (title) event.title = title.trim();
  if (description) event.description = description.trim();
  if (date) event.date = date;
  if (startTime) event.startTime = startTime.trim();
  if (endTime !== undefined) event.endTime = endTime.trim();
  if (location) event.location = location.trim();
  if (imageUrl) event.imageUrl = imageUrl.trim();
  if (status) event.status = status;
  event.updatedAt = new Date().toISOString();

  saveDb(db);
  res.json({ message: 'Event updated successfully.', event });
});

router.delete('/admin/events/:id', requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  const initialLen = db.events.length;
  db.events = db.events.filter((e) => e.id !== req.params.id);

  if (db.events.length === initialLen) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }

  saveDb(db);
  res.json({ message: 'Event deleted successfully.' });
});

// Admin Gallery CRUD
router.post('/admin/gallery', requireAdmin, (req: Request, res: Response) => {
  const { title, description, imageUrl, category } = req.body;

  if (!title?.trim() || !imageUrl?.trim() || !category) {
    res.status(400).json({ error: 'Title, category, and image URL are required.' });
    return;
  }

  const db = getDb();
  const newImg: GalleryImage = {
    id: `gal-${Date.now()}`,
    title: title.trim(),
    description: description?.trim() || '',
    imageUrl: imageUrl.trim(),
    category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.gallery.unshift(newImg);
  saveDb(db);

  res.status(201).json({ message: 'Image added to gallery.', image: newImg });
});

router.delete('/admin/gallery/:id', requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  const initialLen = db.gallery.length;
  db.gallery = db.gallery.filter((g) => g.id !== req.params.id);

  if (db.gallery.length === initialLen) {
    res.status(404).json({ error: 'Image not found' });
    return;
  }

  saveDb(db);
  res.json({ message: 'Image removed from gallery successfully.' });
});

// Admin Messages
router.get('/admin/messages', requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  res.json(db.messages);
});

router.patch('/admin/messages/:id/read', requireAdmin, (req: Request, res: Response) => {
  const { isRead } = req.body;
  const db = getDb();
  const msg = db.messages.find((m) => m.id === req.params.id);

  if (!msg) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }

  msg.isRead = isRead !== undefined ? isRead : true;
  msg.updatedAt = new Date().toISOString();
  saveDb(db);

  res.json({ message: 'Message status updated.', messageItem: msg });
});

router.delete('/admin/messages/:id', requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  const initialLen = db.messages.length;
  db.messages = db.messages.filter((m) => m.id !== req.params.id);

  if (db.messages.length === initialLen) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }

  saveDb(db);
  res.json({ message: 'Message deleted successfully.' });
});

// Admin School Settings
router.put('/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const updates = req.body;
  const db = getDb();

  db.settings = {
    ...db.settings,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveDb(db);
  res.json({ message: 'School settings updated successfully.', settings: db.settings });
});

// ==========================================
// PORTAL AUTHENTICATION (TEACHER & PARENT)
// ==========================================

router.post('/portal/login', async (req: Request, res: Response) => {
  const { usernameOrEmail, password, role } = req.body;

  if (!usernameOrEmail || !password) {
    res.status(400).json({ error: 'Username/Email and password are required.' });
    return;
  }

  const db = getDb();
  const normalizedInput = usernameOrEmail.trim().toLowerCase();

  // Find user matching username or email
  const userRecord = db.portalUsers?.find(
    (u) =>
      u.username.toLowerCase() === normalizedInput ||
      (u.email && u.email.toLowerCase() === normalizedInput)
  );

  if (!userRecord) {
    res.status(401).json({ error: 'Invalid username/email or password.' });
    return;
  }

  // Check if role matches requested portal role (if role was specified)
  if (role) {
    const expectedRole = role.toUpperCase();
    if (userRecord.role !== expectedRole) {
      const roleDisplay = userRecord.role === 'TEACHER' ? 'Teacher' : userRecord.role === 'PARENT' ? 'Parent' : 'Student';
      const requestedDisplay = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
      res.status(403).json({
        error: `Account role mismatch: This account is registered as a ${roleDisplay}, not a ${requestedDisplay}. Please use the correct portal login tab.`,
      });
      return;
    }
  }

  if (userRecord.status === 'SUSPENDED') {
    res.status(403).json({ error: 'Your portal account is currently suspended. Please contact the school administration.' });
    return;
  }

  const isValidPassword = await comparePassword(password, userRecord.passwordHash);
  if (!isValidPassword) {
    res.status(401).json({ error: 'Invalid username/email or password.' });
    return;
  }

  const token = generatePortalToken(userRecord.id, userRecord.role);

  // Exclude passwordHash from user profile response
  const { passwordHash: _, ...safeUser } = userRecord;

  res.json({
    token,
    user: safeUser,
    message: `Welcome to Albright Academy ${safeUser.role === 'TEACHER' ? 'Teacher' : 'Parent'} Portal, ${safeUser.fullName}!`,
  });
});

router.get('/portal/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided.' });
    return;
  }

  const token = authHeader.substring(7);
  const verified = verifyPortalToken(token);
  if (!verified) {
    res.status(401).json({ error: 'Invalid or expired session token.' });
    return;
  }

  const db = getDb();
  const user = db.portalUsers?.find((u) => u.id === verified.userId && u.role === verified.role);
  if (!user || user.status !== 'ACTIVE') {
    res.status(401).json({ error: 'User not found or inactive.' });
    return;
  }

  const { passwordHash: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

// ==========================================
// ADMIN USER MANAGEMENT (TEACHERS & PARENTS)
// ==========================================

// Get all portal users
router.get('/admin/users', requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  const { role, search } = req.query;

  let users = db.portalUsers || [];

  if (role && role !== 'ALL') {
    users = users.filter((u) => u.role === (role as string).toUpperCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    users = users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.phone && u.phone.includes(q)) ||
        (u.studentName && u.studentName.toLowerCase().includes(q)) ||
        (u.studentReference && u.studentReference.toLowerCase().includes(q)) ||
        (u.enrolledGrade && u.enrolledGrade.toLowerCase().includes(q)) ||
        (u.guardianName && u.guardianName.toLowerCase().includes(q))
    );
  }

  // Return users with plainPasswordHint for admin management convenience
  const safeUsers = users.map(({ passwordHash: _, ...user }) => user);
  res.json({ users: safeUsers });
});

// Create new portal user (Teacher or Parent)
router.post('/admin/users', requireAdmin, async (req: Request, res: Response) => {
  const {
    fullName,
    username,
    password,
    role,
    email,
    phone,
    status = 'ACTIVE',
    employeeId,
    assignedGrades,
    subjects,
    studentName,
    studentReference,
    studentGrade,
    relationship,
    address,
    enrolledGrade,
    section,
    guardianName,
    guardianPhone,
    gender,
    dateOfBirth,
  } = req.body;

  if (!fullName || !username || !password || !role) {
    res.status(400).json({ error: 'Full name, username, password, and role are required.' });
    return;
  }

  const cleanRole = role.toUpperCase() as UserRole;
  if (!['TEACHER', 'PARENT', 'STUDENT'].includes(cleanRole)) {
    res.status(400).json({ error: 'Role must be TEACHER, PARENT, or STUDENT.' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters.' });
    return;
  }

  const cleanUsername = username.trim().toLowerCase();
  const db = getDb();

  // Check username uniqueness
  const exists = db.portalUsers?.some(
    (u) => u.username.toLowerCase() === cleanUsername
  );
  if (exists) {
    res.status(409).json({ error: `Username "${cleanUsername}" is already taken. Please choose another.` });
    return;
  }

  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();

  const newUser: PortalUser & { passwordHash: string } = {
    id: `usr-${cleanRole.toLowerCase()}-${Date.now()}`,
    fullName: fullName.trim(),
    username: cleanUsername,
    email: email ? email.trim() : undefined,
    role: cleanRole,
    status: status === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE',
    phone: phone ? phone.trim() : undefined,
    plainPasswordHint: password,
    passwordHash,
    createdAt: now,
    updatedAt: now,
    // Teacher specific
    ...(cleanRole === 'TEACHER' && {
      employeeId: employeeId ? employeeId.trim() : undefined,
      assignedGrades: Array.isArray(assignedGrades) ? assignedGrades : assignedGrades ? [assignedGrades] : [],
      subjects: Array.isArray(subjects) ? subjects : subjects ? [subjects] : [],
    }),
    // Parent specific
    ...(cleanRole === 'PARENT' && {
      studentName: studentName ? studentName.trim() : undefined,
      studentReference: studentReference ? studentReference.trim() : undefined,
      studentGrade: studentGrade ? studentGrade.trim() : undefined,
      relationship: relationship ? relationship.trim() : undefined,
      address: address ? address.trim() : undefined,
    }),
    // Student specific
    ...(cleanRole === 'STUDENT' && {
      enrolledGrade: enrolledGrade ? enrolledGrade.trim() : (studentGrade ? studentGrade.trim() : undefined),
      section: section ? section.trim() : undefined,
      studentReference: studentReference ? studentReference.trim() : undefined,
      guardianName: guardianName ? guardianName.trim() : undefined,
      guardianPhone: guardianPhone ? guardianPhone.trim() : undefined,
      gender: gender ? gender.trim() : undefined,
      dateOfBirth: dateOfBirth ? dateOfBirth.trim() : undefined,
    }),
  };

  if (!db.portalUsers) db.portalUsers = [];
  db.portalUsers.unshift(newUser);
  saveDb(db);

  const roleTitle = cleanRole === 'TEACHER' ? 'Teacher' : cleanRole === 'PARENT' ? 'Parent' : 'Student';
  const { passwordHash: _, ...safeUser } = newUser;
  res.status(201).json({
    message: `${roleTitle} user account created successfully.`,
    user: safeUser,
  });
});

// Update portal user
router.put('/admin/users/:id', requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const db = getDb();

  const userIndex = db.portalUsers?.findIndex((u) => u.id === id);
  if (userIndex === undefined || userIndex === -1) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }

  const existingUser = db.portalUsers[userIndex];

  // If username changed, check uniqueness
  if (updates.username && updates.username.trim().toLowerCase() !== existingUser.username.toLowerCase()) {
    const cleanUsername = updates.username.trim().toLowerCase();
    const isTaken = db.portalUsers.some(
      (u) => u.id !== id && u.username.toLowerCase() === cleanUsername
    );
    if (isTaken) {
      res.status(409).json({ error: `Username "${cleanUsername}" is already taken.` });
      return;
    }
    existingUser.username = cleanUsername;
  }

  // If password changed, update hash and hint
  if (updates.password && updates.password.trim()) {
    if (updates.password.trim().length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.' });
      return;
    }
    existingUser.passwordHash = await hashPassword(updates.password.trim());
    existingUser.plainPasswordHint = updates.password.trim();
  }

  // Update fields
  if (updates.fullName) existingUser.fullName = updates.fullName.trim();
  if (updates.email !== undefined) existingUser.email = updates.email ? updates.email.trim() : undefined;
  if (updates.phone !== undefined) existingUser.phone = updates.phone ? updates.phone.trim() : undefined;
  if (updates.status) existingUser.status = updates.status;
  if (updates.role) existingUser.role = updates.role.toUpperCase();

  // Role fields
  if (updates.employeeId !== undefined) existingUser.employeeId = updates.employeeId;
  if (updates.assignedGrades !== undefined) existingUser.assignedGrades = updates.assignedGrades;
  if (updates.subjects !== undefined) existingUser.subjects = updates.subjects;
  if (updates.studentName !== undefined) existingUser.studentName = updates.studentName;
  if (updates.studentReference !== undefined) existingUser.studentReference = updates.studentReference;
  if (updates.studentGrade !== undefined) existingUser.studentGrade = updates.studentGrade;
  if (updates.relationship !== undefined) existingUser.relationship = updates.relationship;
  if (updates.address !== undefined) existingUser.address = updates.address;
  // Student fields
  if (updates.enrolledGrade !== undefined) existingUser.enrolledGrade = updates.enrolledGrade;
  if (updates.section !== undefined) existingUser.section = updates.section;
  if (updates.guardianName !== undefined) existingUser.guardianName = updates.guardianName;
  if (updates.guardianPhone !== undefined) existingUser.guardianPhone = updates.guardianPhone;
  if (updates.gender !== undefined) existingUser.gender = updates.gender;
  if (updates.dateOfBirth !== undefined) existingUser.dateOfBirth = updates.dateOfBirth;

  existingUser.updatedAt = new Date().toISOString();
  saveDb(db);

  const { passwordHash: _, ...safeUser } = existingUser;
  res.json({ message: 'User updated successfully.', user: safeUser });
});

// Delete portal user
router.delete('/admin/users/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDb();

  const initialCount = db.portalUsers?.length || 0;
  db.portalUsers = db.portalUsers?.filter((u) => u.id !== id) || [];

  if (db.portalUsers.length === initialCount) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }

  saveDb(db);
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
