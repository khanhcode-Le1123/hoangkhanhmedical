import type { NextApiRequest, NextApiResponse } from 'next';
import { setSession, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cleanText, normalizePhone } from '@/lib/validation';
import { rateLimit, requestIp } from '@/lib/rate-limit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).setHeader('Allow', 'POST').end();
  if (!rateLimit(`login:${requestIp(req.headers)}`, 8, 15 * 60_000)) return res.status(429).json({ error: 'Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.' });
  const identity = cleanText(req.body?.identity, 160).toLowerCase();
  const password = cleanText(req.body?.password, 200);
  const user = await prisma.user.findFirst({ where: identity.includes('@') ? { email: identity } : { phone: normalizePhone(identity) } });
  if (!user || !user.active || !(await verifyPassword(password, user.passwordHash))) return res.status(401).json({ error: 'Thông tin đăng nhập không đúng.' });
  setSession(res, { id: user.id, role: user.role, name: user.name });
  return res.json({ user: { name: user.name, role: user.role } });
}
