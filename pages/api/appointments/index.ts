import type { NextApiRequest, NextApiResponse } from 'next';
import { randomBytes } from 'node:crypto';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cleanText } from '@/lib/validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = requireRole(req, res, ['PATIENT']);
  if (!session) return;

  if (req.method === 'GET') {
    const patient = await prisma.patient.findUnique({ where: { userId: session.id } });
    if (!patient) return res.status(404).json({ error: 'Không tìm thấy hồ sơ bệnh nhân.' });
    const appointments = await prisma.appointment.findMany({
      where: { patientId: patient.id },
      orderBy: { slot: { startsAt: 'desc' } },
      include: { doctor: { select: { name: true, slug: true } }, service: { select: { name: true } }, slot: { select: { startsAt: true, endsAt: true } } },
    });
    res.setHeader('Cache-Control', 'private, no-store');
    return res.json({ appointments });
  }

  if (req.method !== 'POST') return res.status(405).setHeader('Allow', 'GET, POST').end();
  const slotId = cleanText(req.body?.slotId, 64);
  const doctorSlug = cleanText(req.body?.doctorSlug, 100);
  const serviceId = cleanText(req.body?.serviceId, 64) || null;
  const reason = cleanText(req.body?.reason, 1000) || null;
  if (!slotId || !doctorSlug) return res.status(400).json({ error: 'Vui lòng chọn bác sĩ và khung giờ.' });

  try {
    const appointment = await prisma.$transaction(async tx => {
      const patient = await tx.patient.findUnique({ where: { userId: session.id } });
      if (!patient) throw new Error('PATIENT_NOT_FOUND');
      const doctor = await tx.doctor.findUnique({ where: { slug: doctorSlug, isPublished: true }, select: { id: true } });
      if (!doctor) throw new Error('DOCTOR_NOT_FOUND');
      const claimed = await tx.appointmentSlot.updateMany({ where: { id: slotId, doctorId: doctor.id, status: 'AVAILABLE', startsAt: { gt: new Date() } }, data: { status: 'BOOKED', holdToken: null, holdExpiresAt: null } });
      if (claimed.count !== 1) throw new Error('SLOT_UNAVAILABLE');
      return tx.appointment.create({
        data: { code: `HK-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString('hex').toUpperCase()}`, patientId: patient.id, doctorId: doctor.id, serviceId, slotId, reason },
        include: { doctor: { select: { name: true } }, slot: { select: { startsAt: true } } },
      });
    }, { isolationLevel: 'Serializable' });
    return res.status(201).json({ appointment: { code: appointment.code, doctor: appointment.doctor.name, startsAt: appointment.slot.startsAt } });
  } catch (error) {
    if (error instanceof Error && ['SLOT_UNAVAILABLE', 'PATIENT_NOT_FOUND', 'DOCTOR_NOT_FOUND'].includes(error.message)) return res.status(error.message === 'SLOT_UNAVAILABLE' ? 409 : 404).json({ error: error.message === 'SLOT_UNAVAILABLE' ? 'Khung giờ vừa được đặt hoặc đã hết hạn. Vui lòng chọn giờ khác.' : 'Không tìm thấy hồ sơ phù hợp.' });
    return res.status(500).json({ error: 'Không thể tạo lịch hẹn. Vui lòng thử lại.' });
  }
}
