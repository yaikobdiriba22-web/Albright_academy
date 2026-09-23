import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { getDb } from './db.ts';

const AUTH_SECRET = process.env.AUTH_SECRET || 'albright-academy-secure-secret-key-2026';

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

    // Token expires after 7 days
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
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
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

  (req as any).adminId = verified.adminId;
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

export function verifyPortalToken(token: string): { userId: string; role: string } | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 4) return null;

    const [userId, role, timestamp, signature] = parts;
    const payload = `${userId}:${role}:${timestamp}`;
    const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');

    if (signature !== expectedSignature) return null;

    const tokenTime = parseInt(timestamp, 10);
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - tokenTime > sevenDaysMs) return null;

    const db = getDb();
    const user = db.portalUsers?.find((u) => u.id === userId && u.role === role);
    if (!user || user.status !== 'ACTIVE') return null;

    return { userId, role };
  } catch {
    return null;
  }
}
