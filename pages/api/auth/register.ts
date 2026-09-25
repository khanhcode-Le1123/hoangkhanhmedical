import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import { hashPassword, setSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cleanText, emailPattern, normalizePhone, phonePattern, validatePassword } from '@/lib/validation';
import { rateLimit, requestIp } from '@/lib/rate-limit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).setHeader('Allow', 'POST').end();
  if (!rateLimit(`register:${requestIp(req.headers)}`, 4, 15 * 60_000)) return res.status(429).json({ error: 'Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.' });
  const name = cleanText(req.body?.name, 100);
  const phone = normalizePhone(cleanText(req.body?.phone, 20));
  const email = cleanText(req.body?.email, 160).toLowerCase() || null;
  const password = req.body?.password;
  if (name.length < 2 || !phonePattern.test(phone) || (email && !emailPattern.test(email)) || !validatePassword(password)) {
    return res.status(400).json({ error: 'Thông tin chưa hợp lệ. Mật khẩu cần ít nhất 10 ký tự, gồm chữ và số.' });
  }
  try {
    const user = await prisma.user.create({ data: { name, phone, email, passwordHash: await hashPassword(password), patient: { create: {} } } });
    setSession(res, { id: user.id, role: user.role, name: user.name });
    return res.status(201).json({ user: { name: user.name, role: user.role } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return res.status(409).json({ error: 'Số điện thoại hoặc email đã được sử dụng.' });
    return res.status(500).json({ error: 'Không thể tạo tài khoản lúc này.' });
  }
}
