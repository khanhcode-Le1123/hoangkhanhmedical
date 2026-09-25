import type { NextApiRequest, NextApiResponse } from 'next';
import { createHash } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { rateLimit, requestIp } from '@/lib/rate-limit';
import { cleanText, emailPattern, normalizePhone, phonePattern } from '@/lib/validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).setHeader('Allow', 'POST').end();
  const ip = requestIp(req.headers);
  if (!rateLimit(`contact:${ip}`, 3, 10 * 60_000)) return res.status(429).json({ error: 'Bạn đã gửi nhiều yêu cầu. Vui lòng thử lại sau.' });
  if (cleanText(req.body?.website, 200)) return res.status(202).json({ ok: true });
  const fullName = cleanText(req.body?.fullName, 100);
  const phone = normalizePhone(cleanText(req.body?.phone, 20));
  const email = cleanText(req.body?.email, 160).toLowerCase() || null;
  const topic = cleanText(req.body?.topic, 80);
  const message = cleanText(req.body?.message, 2000);
  const privacyConsent = req.body?.privacyConsent === true;
  if (fullName.length < 2 || !phonePattern.test(phone) || (email && !emailPattern.test(email)) || !topic || message.length < 10 || !privacyConsent) return res.status(400).json({ error: 'Vui lòng kiểm tra các trường bắt buộc và xác nhận chính sách bảo mật.' });
  await prisma.contactSubmission.create({ data: { fullName, phone, email, topic, message, privacyConsent, ipHash: createHash('sha256').update(`${ip}:${process.env.AUTH_SECRET || 'local'}`).digest('hex') } });
  return res.status(201).json({ ok: true });
}
