import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).setHeader('Allow', 'GET').end();
  const doctorSlug = typeof req.query.doctor === 'string' ? req.query.doctor : '';
  const date = typeof req.query.date === 'string' ? req.query.date : '';
  if (!doctorSlug || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: 'Bác sĩ hoặc ngày khám chưa hợp lệ.' });
  const doctor = await prisma.doctor.findUnique({ where: { slug: doctorSlug, isPublished: true }, select: { id: true } });
  if (!doctor) return res.status(404).json({ error: 'Không tìm thấy lịch bác sĩ.' });
  const start = new Date(`${date}T00:00:00+07:00`);
  const end = new Date(`${date}T23:59:59.999+07:00`);
  const now = new Date();
  const slots = await prisma.appointmentSlot.findMany({
    where: { doctorId: doctor.id, startsAt: { gte: start, lte: end }, OR: [{ status: 'AVAILABLE' }, { status: 'HELD', holdExpiresAt: { lt: now } }] },
    orderBy: { startsAt: 'asc' },
    select: { id: true, startsAt: true, endsAt: true },
  });
  res.setHeader('Cache-Control', 'private, no-store');
  return res.json({ slots, doctorId: doctor.id, timezone: 'Asia/Ho_Chi_Minh' });
}
