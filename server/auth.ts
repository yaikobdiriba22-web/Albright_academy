import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { getDb } from './db.ts';
import { UserRole } from '../src/types/index.ts';

const AUTH_SECRET = process.env.AUTH_SECRET || 'albright-academy-secure-secret-key-2026';

export interface AuthenticatedUser {
  id: string; // User ID or Admin ID
  role: UserRole;
  fullName: string;
  email?: string;
  username?: string;
  // Specific entity linkages
  teacherId?: string;
  assignedClassIds?: string[];
  assignedSubjectIds?: string[];
  parentId?: string;
  linkedStudentIds?: string[];
  studentId?: string;
  classId?: string;
  sectionId?: string;
}

export interface AuthenticatedRequest extends Request {
  authUser?: AuthenticatedUser;
  adminId?: string;
}

// Generates an HMAC signed session token: "adminId.timestamp.signature"
export function generateToken(adminId: string): string {
  const timestamp = Date.now().toString();
  const payload = `${adminId}:${timestamp}`;
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

export function verifyToken(token: string): { adminId: string } | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return null;

    const [adminId, timestamp, signature] = parts;
    const payload = `${adminId}:${timestamp}`;
    const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');

    if (signature !== expectedSignature) {
      return null;
    }

    const tokenTime = parseInt(timestamp, 10);
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - tokenTime > sevenDaysMs) {
      return null;
    }

    const db = getDb();
    const admin = db.admins.find((a) => a.id === adminId);
    if (!admin) return null;

    return { adminId };
  } catch (err) {
    return null;
  }
}

// Middleware to protect admin routes
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.albright_admin_token) {
    token = req.cookies.albright_admin_token;
  }

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
    return;
  }

  const verified = verifyToken(token);
  if (!verified) {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
    return;
  }

  req.adminId = verified.adminId;
  const db = getDb();
  const admin = db.admins.find((a) => a.id === verified.adminId);
  req.authUser = {
    id: verified.adminId,
    role: 'ADMIN',
    fullName: admin?.name || 'Administrator',
    email: admin?.email,
  };

  next();
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// Portal user tokens (Teachers, Parents, Students)
export function generatePortalToken(userId: string, role: string): string {
  const timestamp = Date.now().toString();
  const payload = `${userId}:${role}:${timestamp}`;
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

export function verifyPortalToken(token: string): { userId: string; role: UserRole } | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 4) return null;

    const [userId, roleStr, timestamp, signature] = parts;
    const payload = `${userId}:${roleStr}:${timestamp}`;
    const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');

    if (signature !== expectedSignature) return null;

    const tokenTime = parseInt(timestamp, 10);
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - tokenTime > sevenDaysMs) return null;

    const db = getDb();
    const user = db.portalUsers?.find((u) => u.id === userId && u.role === roleStr);
    if (!user || user.status !== 'ACTIVE') return null;

    return { userId, role: roleStr as UserRole };
  } catch {
    return null;
  }
}

// Universal Auth Middleware for all RBAC endpoints
export function authenticateAny(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies?.albright_admin_token) {
    token = req.cookies.albright_admin_token;
  } else if (req.cookies?.albright_portal_token) {
    token = req.cookies.albright_portal_token;
  }

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: Authentication token required' });
    return;
  }

  const db = getDb();

  // Try admin token
  const adminVerified = verifyToken(token);
  if (adminVerified) {
    const admin = db.admins.find((a) => a.id === adminVerified.adminId);
    req.authUser = {
      id: adminVerified.adminId,
      role: 'ADMIN',
      fullName: admin?.name || 'Administrator',
      email: admin?.email,
    };
    req.adminId = adminVerified.adminId;
    next();
    return;
  }

  // Try portal token
  const portalVerified = verifyPortalToken(token);
  if (portalVerified) {
    const portalUser = db.portalUsers.find((u) => u.id === portalVerified.userId);
    if (!portalUser || portalUser.status !== 'ACTIVE') {
      res.status(401).json({ error: 'Unauthorized: Account inactive or not found' });
      return;
    }

    const authUser: AuthenticatedUser = {
      id: portalUser.id,
      role: portalUser.role,
      fullName: portalUser.fullName,
      email: portalUser.email,
      username: portalUser.username,
    };

    // Attach entity linkages based on role
    if (portalUser.role === 'TEACHER') {
      const teacher = db.teachers?.find((t) => t.userId === portalUser.id || t.id === portalUser.id);
      if (teacher) {
        authUser.teacherId = teacher.id;
        authUser.assignedClassIds = teacher.assignedClassIds;
        authUser.assignedSubjectIds = teacher.assignedSubjectIds;
      }
    } else if (portalUser.role === 'PARENT') {
      const parent = db.parents?.find((p) => p.userId === portalUser.id || p.id === portalUser.id);
      if (parent) {
        authUser.parentId = parent.id;
        authUser.linkedStudentIds = parent.studentIds;
      }
    } else if (portalUser.role === 'STUDENT') {
      const student = db.students?.find((s) => s.userId === portalUser.id || s.id === portalUser.id);
      if (student) {
        authUser.studentId = student.id;
        authUser.classId = student.classId;
        authUser.sectionId = student.sectionId;
      }
    }

    req.authUser = authUser;
    next();
    return;
  }

  res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
}

// Role Guard Middleware
export function requireRoles(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.authUser) {
      res.status(401).json({ error: 'Unauthorized: Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.authUser.role)) {
      res.status(403).json({
        error: `Forbidden: Access restricted. Requires one of [${allowedRoles.join(', ')}], current role is [${req.authUser.role}]`,
      });
      return;
    }

    next();
  };
}
