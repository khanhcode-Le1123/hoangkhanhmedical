# Hoàng Khanh Medical — Product blueprint

## Sitemap

- `/` Trang chủ
- `/gioi-thieu` Câu chuyện, năng lực, cơ sở vật chất
- `/chuyen-khoa` Danh mục chuyên khoa; `/chuyen-khoa/[slug]` chi tiết
- `/dich-vu` Danh mục dịch vụ; `/dich-vu/[slug]` chi tiết
- `/bac-si` Danh sách bác sĩ; `/bac-si/[slug]` hồ sơ
- `/dat-lich` Luồng 5 bước: chuyên khoa → bác sĩ → thời gian → bệnh nhân → xác nhận
- `/tin-tuc` Kiến thức y khoa; `/tin-tuc/[slug]` bài viết
- `/tim-kiem`, `/lien-he`, `/faq`
- `/benh-nhan`, `/dang-nhap`, `/dang-ky`, `/lich-hen`
- `/admin`, `/admin/bac-si`, `/admin/chuyen-khoa`, `/admin/dich-vu`, `/admin/lich-kham`, `/admin/bai-viet`, `/admin/benh-nhan`, `/admin/noi-dung`

## Design system

- Brand: evergreen `#0b3d32`, jade `#2f745d`, mint `#d8efbd`, ivory `#f5f2ea`, ink `#10221d`.
- Type: Manrope/Inter fallback; display scale 64–104px, body 16–18px.
- Geometry: radius 18/28/40px; roomy 12-column grid; soft 1px borders; restrained glass.
- Motion: transform/opacity only, scroll reveal, image scale/parallax, counters, sticky narrative. Respect `prefers-reduced-motion`.

## Architecture

- Next.js + TypeScript, Tailwind tokens, reusable page shells and domain components.
- GSAP ScrollTrigger + Lenis for progressive animation; Framer Motion for page/UI transitions.
- PostgreSQL + Prisma domain schema for patients, doctors, specialties, services, schedules, appointments and articles.
- Production evolution: Auth.js/OTP, API route handlers, RBAC, audit log, SMS/Zalo adapter, object storage, consent/privacy controls.
