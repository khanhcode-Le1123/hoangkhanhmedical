import type { NextApiRequest, NextApiResponse } from 'next';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = requireRole(req, res, ['ADMIN', 'EDITOR', 'DOCTOR']);
  if (!session) return;
  if (req.method !== 'GET') return res.status(405).setHeader('Allow', 'GET').end();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today.getTime() + 86_400_000);
  const [todayCount, upcomingCount, doctorCount, contacts] = await Promise.all([
    prisma.appointment.count({ where: { slot: { startsAt: { gte: today, lt: tomorrow } }, status: { in: ['PENDING', 'CONFIRMED'] } } }),
    prisma.appointment.count({ where: { slot: { startsAt: { gte: tomorrow } }, status: { in: ['PENDING', 'CONFIRMED'] } } }),
    prisma.doctor.count({ where: { isPublished: true } }),
    prisma.contactSubmission.findMany({ where: { status: 'NEW' }, orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, fullName: true, topic: true, createdAt: true } }),
  ]);
  res.setHeader('Cache-Control', 'private, no-store');
  return res.json({ todayCount, upcomingCount, doctorCount, contacts });
}
