import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DEMO ONLY. Replace every seeded profile and slot with clinic-verified data before production use.
const specialties = [
  ['noi-tong-quat', 'Nội tổng quát'], ['nhi-khoa', 'Nhi khoa'], ['san-phu-khoa', 'Sản phụ khoa'],
  ['tim-mach', 'Tim mạch'], ['tai-mui-hong', 'Tai mũi họng'], ['chan-doan-hinh-anh', 'Chẩn đoán hình ảnh'],
];
const doctors = [
  ['le-van-phuc', 'BS. CKI Lê Văn Phúc', 'noi-tong-quat'],
  ['nguyen-van-minh', 'BS. CKII Nguyễn Văn Minh', 'noi-tong-quat'],
  ['tran-thi-hong', 'BS. CKI Trần Thị Hồng', 'nhi-khoa'],
  ['le-hoang-nam', 'BS. CKII Lê Hoàng Nam', 'san-phu-khoa'],
  ['dang-anh-tuan', 'ThS. BS Đặng Anh Tuấn', 'tim-mach'],
];

async function main() {
  const specialtyIds = new Map();
  for (const [slug, name] of specialties) {
    const specialty = await prisma.specialty.upsert({ where: { slug }, update: {}, create: { slug, name, description: 'Dữ liệu demo — cần phòng khám xác minh.', conditions: [], symptoms: [], audiences: [], diagnostics: [], technologies: [], process: [], isPublished: true } });
    specialtyIds.set(slug, specialty.id);
  }
  for (const [slug, name, specialtySlug] of doctors) {
    const doctor = await prisma.doctor.upsert({ where: { slug }, update: {}, create: { slug, name, bio: 'Hồ sơ demo — cần phòng khám xác minh.', expertise: [], education: [], certifications: [], career: [], strengths: [], isPublished: true } });
    await prisma.doctorSpecialty.upsert({ where: { doctorId_specialtyId: { doctorId: doctor.id, specialtyId: specialtyIds.get(specialtySlug) } }, update: {}, create: { doctorId: doctor.id, specialtyId: specialtyIds.get(specialtySlug), isPrimary: true } });
    for (let dayOffset = 1; dayOffset <= 14; dayOffset += 1) {
      const day = new Date();
      day.setDate(day.getDate() + dayOffset);
      for (const hour of [8, 9, 10, 14, 15, 16]) {
        const startsAt = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, 0, 0);
        const endsAt = new Date(startsAt.getTime() + 30 * 60 * 1000);
        await prisma.appointmentSlot.upsert({ where: { doctorId_startsAt: { doctorId: doctor.id, startsAt } }, update: {}, create: { doctorId: doctor.id, startsAt, endsAt } });
      }
    }
  }
}

main().finally(async () => prisma.$disconnect());
