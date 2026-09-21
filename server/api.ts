import { Router, Request, Response } from 'express';
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
} from './auth.ts';
import {
  AdmissionApplication,
  NewsItem,
  SchoolEvent,
  GalleryImage,
  ContactMessage,
  SchoolSettings,
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
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const db = getDb();
  const admin = db.admins.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());

  if (!admin) {
    res.status(401).json({ error: 'Invalid email or password.' });
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

export default router;
