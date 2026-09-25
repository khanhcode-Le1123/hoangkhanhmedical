import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { UserRole } from '@prisma/client';

const scrypt = promisify(scryptCallback);
const COOKIE_NAME = 'hk_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type SessionUser = { id: string; role: UserRole; name: string; exp: number };

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error('AUTH_SECRET must contain at least 32 characters');
  return value;
}

function sign(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

export function createSessionToken(user: Omit<SessionUser, 'exp'>) {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Date.now() + MAX_AGE_SECONDS * 1000 })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token?: string): SessionUser | null {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString()) as SessionUser;
    return session.exp > Date.now() ? session : null;
  } catch {
    return null;
  }
}

export function getSession(req: NextApiRequest) {
  return readSessionToken(req.cookies[COOKIE_NAME]);
}

export function setSession(res: NextApiResponse, user: Omit<SessionUser, 'exp'>) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${createSessionToken(user)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE_SECONDS}${secure}`);
}

export function clearSession(res: NextApiResponse) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString('hex')}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const target = Buffer.from(hash, 'hex');
  return derived.length === target.length && timingSafeEqual(derived, target);
}

export function requireRole(req: NextApiRequest, res: NextApiResponse, roles: UserRole[]) {
  const session = getSession(req);
  if (!session) {
    res.status(401).json({ error: 'Bạn cần đăng nhập để tiếp tục.' });
    return null;
  }
  if (!roles.includes(session.role)) {
    res.status(403).json({ error: 'Bạn không có quyền truy cập.' });
    return null;
  }
  return session;
}
