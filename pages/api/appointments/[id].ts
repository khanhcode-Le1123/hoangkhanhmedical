import type { NextApiRequest, NextApiResponse } from 'next';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = requireRole(req, res, ['PATIENT']);
  if (!session) return;
  if (req.method !== 'DELETE') return res.status(405).setHeader('Allow', 'DELETE').end();
  const id = typeof req.query.id === 'string' ? req.query.id : '';
  try {
    await prisma.$transaction(async tx => {
      const appointment = await tx.appointment.findFirst({ where: { id, patient: { userId: session.id }, status: { in: ['PENDING', 'CONFIRMED'] } }, include: { slot: true } });
      if (!appointment) throw new Error('NOT_FOUND');
      if (appointment.slot.startsAt.getTime() - Date.now() < 24 * 60 * 60 * 1000) throw new Error('TOO_LATE');
      await tx.appointment.update({ where: { id }, data: { status: 'CANCELLED', cancelledAt: new Date() } });
      await tx.appointmentSlot.update({ where: { id: appointment.slotId }, data: { status: 'AVAILABLE' } });
    }, { isolationLevel: 'Serializable' });
    return res.status(204).end();
  } catch (error) {
    if (error instanceof Error && error.message === 'TOO_LATE') return res.status(409).json({ error: 'Lịch hẹn trong vòng 24 giờ cần được hỗ trợ qua hotline.' });
    return res.status(404).json({ error: 'Không tìm thấy lịch hẹn có thể hủy.' });
  }
}
