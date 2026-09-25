# Hoàng Khanh Medical — implementation report

## Audit baseline

- Framework: Next.js 15, React 19, TypeScript strict, Pages Router.
- Routing before this phase: one statically exported catch-all route; unknown URLs rendered the home page.
- UI: React components with global CSS, Framer Motion, GSAP ScrollTrigger and Lenis.
- Data before this phase: four in-memory arrays in `lib/data.ts`; every feature screen was mock-only.
- Database before this phase: partial PostgreSQL/Prisma schema with no migration, API integration or generated workflow.
- Authentication/backend/CMS before this phase: none. Login, patient portal, booking, contact form and admin were public mock screens.
- Baseline typecheck passed. No lint script existed. The first parallel build did not complete and was rerun independently.

## Material risks found

- Patient and appointment details were hardcoded on public pages.
- Admin had no authorization and showed invented statistics.
- Booking displayed hardcoded dates/slots and never created an appointment.
- Contact and login forms only called `preventDefault()`.
- No collision control existed for doctor slots.
- All detail pages shared generic copy; FAQ answers were duplicated.
- All pages shared one title/description and unknown routes silently returned the home page.
- No legal drafts, sitemap, robots policy, server validation, rate limiting or security headers existed.
- Unverified doctor credentials, prices, dates and operational claims were presented without a content-status warning.
- Large components (`InnerPages.tsx`) remain a maintainability hotspot and should be split by domain in the next phase.

## Implemented in this phase

- Replaced static export with a server-capable Next.js deployment.
- Expanded the Prisma schema and generated an initial PostgreSQL migration.
- Added a clearly labelled demo seed for local QA only.
- Added signed HttpOnly/SameSite sessions, scrypt password hashing, registration, login, logout and session APIs.
- Added server-side route guards for patient/admin routes and API-level RBAC.
- Added real slot lookup, atomic appointment creation with serializable transaction and unique slot ownership, patient appointment listing and guarded cancellation.
- Added a server-backed contact form with validation, honeypot, IP-based throttling and hashed IP storage.
- Removed hardcoded patient records and invented admin statistics.
- Added distinct specialty/service/doctor/article content structures, contextual CTAs and explicit verification TODOs.
- Added category-specific FAQ answers, legal drafts, 404/500 pages, per-route metadata, canonical URLs, OpenGraph/Twitter tags, robots and sitemap.
- Added security headers, visible focus styles, reduced-motion fallbacks, scroll progress, image reveal, sticky storytelling and navbar state transitions.
- Added loading, empty, error and success states to data-dependent flows.

## Deliberately not represented as complete

- Doctor qualifications, employment history, certificates, equipment model, licence/accreditation evidence, prices and detailed clinic policies require source documents from the clinic.
- The old public website is treated as a reference, not legal or medical proof. Unverified profile data remains visibly labelled.
- Admin overview is live and protected, but full CRUD editors for every entity are a next phase.
- Appointment rescheduling and temporary slot holds are not enabled. Creation is collision-safe; cancellation is supported outside the proposed 24-hour window.
- SMS/Zalo/email notifications need provider credentials and consent rules.
- Dynamic database-driven sitemap, Physician/Article/FAQ structured data and a full CMS publishing approval workflow remain TODOs.
- No database was available during this run, so DB-connected success paths require the migration and seed commands below.

## Environment and local setup

1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL`, `AUTH_SECRET` and the production `NEXT_PUBLIC_SITE_URL`.
3. Run `npm install`.
4. Run `npm run db:migrate`.
5. For local QA only, run `npm run db:seed` (never treat this data as verified production content).
6. Run `npm run dev`.

Quality checks: `npm run lint`, `npm run typecheck`, `npm run build`.

## Vercel deployment

1. Provision PostgreSQL and add `DATABASE_URL` to the Vercel project.
2. Add a random `AUTH_SECRET` of at least 32 characters and set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin.
3. Run `npm run db:migrate` against the production database from a controlled deployment/migration job.
4. Do not run the demo seed in production.
5. Deploy with the standard Next.js build command (`npm run build`).
6. Re-run route, auth, booking, email/notification and legal-content acceptance checks on the final origin.
