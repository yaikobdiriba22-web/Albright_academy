import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { prisma } from './prisma.ts';
import { UserRole } from '../src/types/index.ts';

const AUTH_SECRET = process.env.AUTH_SECRET;
if (!AUTH_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('AUTH_SECRET environment variable is required in production.');
}
const SIGNING_SECRET = AUTH_SECRET || 'development-only-secret-change-me';

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  fullName: string;
  email?: string;
  username?: string;
  teacherId?: string;
  assignedClassIds?: string[];
  assignedSubjectIds?: string[];
  parentId?: string;
  linkedStudentIds?: string[];
  studentId?: string;
  classId?: string;
  sectionId?: string;
}
export interface AuthenticatedRequest extends Request { authUser?: AuthenticatedUser; adminId?: string; }

function safeEqual(a: string, b: string): boolean {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

export function generateToken(adminId: string): string {
  const timestamp = Date.now().toString();
  const payload = `${adminId}:${timestamp}`;
  const signature = crypto.createHmac('sha256', SIGNING_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

export async function verifyToken(token: string): Promise<{ adminId: string } | null> {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return null;
    const [adminId, timestamp, signature] = parts;
    const payload = `${adminId}:${timestamp}`;
    const expected = crypto.createHmac('sha256', SIGNING_SECRET).update(payload).digest('hex');
    if (!safeEqual(signature, expected)) return null;
    const tokenTime = Number(timestamp);
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    if (!Number.isFinite(tokenTime) || tokenTime > Date.now() || Date.now() - tokenTime > maxAge) return null;
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    return admin ? { adminId } : null;
  } catch { return null; }
}

export async function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : req.cookies?.albright_admin_token;
  if (!token) { res.status(401).json({ error: 'Unauthorized: Admin authentication required' }); return; }
  const verified = await verifyToken(token);
  if (!verified) { res.status(401).json({ error: 'Unauthorized: Invalid or expired session' }); return; }
  const admin = await prisma.admin.findUnique({ where: { id: verified.adminId } });
  if (!admin) { res.status(401).json({ error: 'Unauthorized: Admin account not found' }); return; }
  req.adminId = admin.id;
  req.authUser = { id: admin.id, role: 'ADMIN', fullName: admin.name, email: admin.email };
  next();
}

export async function hashPassword(plain: string): Promise<string> { return bcrypt.hash(plain, 10); }
export async function comparePassword(plain: string, hash: string): Promise<boolean> { return bcrypt.compare(plain, hash); }

export function generatePortalToken(userId: string, role: string): string {
  const timestamp = Date.now().toString();
  const payload = `${userId}:${role}:${timestamp}`;
  const signature = crypto.createHmac('sha256', SIGNING_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

export async function verifyPortalToken(token: string): Promise<{ userId: string; role: UserRole } | null> {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 4) return null;
    const [userId, roleStr, timestamp, signature] = parts;
    const payload = `${userId}:${roleStr}:${timestamp}`;
    const expected = crypto.createHmac('sha256', SIGNING_SECRET).update(payload).digest('hex');
    if (!safeEqual(signature, expected)) return null;
    const tokenTime = Number(timestamp);
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    if (!Number.isFinite(tokenTime) || tokenTime > Date.now() || Date.now() - tokenTime > maxAge) return null;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true, isActive: true } });
    if (!user || !user.isActive || user.role !== roleStr) return null;
    return { userId, role: roleStr as UserRole };
  } catch { return null; }
}

export async function authenticateAny(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7)
    : req.cookies?.albright_admin_token || req.cookies?.albright_portal_token;
  if (!token) { res.status(401).json({ error: 'Unauthorized: Authentication token required' }); return; }

  const adminVerified = await verifyToken(token);
  if (adminVerified) {
    const admin = await prisma.admin.findUnique({ where: { id: adminVerified.adminId } });
    if (admin) {
      req.authUser = { id: admin.id, role: 'ADMIN', fullName: admin.name, email: admin.email };
      req.adminId = admin.id;
      next(); return;
    }
  }

  const portalVerified = await verifyPortalToken(token);
  if (!portalVerified) { res.status(401).json({ error: 'Unauthorized: Invalid or expired token' }); return; }

  const user = await prisma.user.findUnique({
    where: { id: portalVerified.userId },
    include: { teacherProfile: true, parentProfile: true, studentProfile: true },
  });
  if (!user || !user.isActive || user.role !== portalVerified.role) {
    res.status(401).json({ error: 'Unauthorized: Account inactive or not found' }); return;
  }

  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const authUser: AuthenticatedUser = { id: user.id, role: user.role as UserRole, fullName, email: user.email, username: user.username || undefined };

  if (user.teacherProfile) authUser.teacherId = user.teacherProfile.id;
  if (user.parentProfile) {
    authUser.parentId = user.parentProfile.id;
    const children = await prisma.student.findMany({ where: { parentId: user.parentProfile.id }, select: { id: true } });
    authUser.linkedStudentIds = children.map(s => s.id);
  }
  if (user.studentProfile) {
    authUser.studentId = user.studentProfile.id;
    const enrollment = await prisma.enrollment.findFirst({
      where: { studentId: user.studentProfile.id, status: 'Active' },
      orderBy: { createdAt: 'desc' },
      select: { classId: true, sectionId: true },
    });
    authUser.classId = enrollment?.classId;
    authUser.sectionId = enrollment?.sectionId;
  }

  req.authUser = authUser;
  next();
}

export function requireRoles(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.authUser) { res.status(401).json({ error: 'Unauthorized: Authentication required' }); return; }
    if (!allowedRoles.includes(req.authUser.role)) {
      res.status(403).json({ error: `Forbidden: Access restricted. Requires one of [${allowedRoles.join(', ')}], current role is [${req.authUser.role}]` });
      return;
    }
    next();
  };
}
