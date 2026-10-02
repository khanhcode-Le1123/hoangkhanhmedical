# Motion implementation

The site uses `motion/react` and native browser scrolling. GSAP and Lenis have been removed.

## Where to work

- `components/motion/system.ts`: shared easing, spring presets, and one application-level set of reduced-motion / viewport / pointer subscriptions.
- `components/motion/Primitives.tsx`: masked text, image masks, magnetic links, local pointer lighting / tilt, layout accordion, and confirmation path.
- `components/HomePage.tsx`: homepage scroll choreography and editorial composition.
- `components/EditorialContent.tsx`: doctor selection / native modal and article composition shared with interior pages.
- `components/SpatialGallery.tsx`: independently loaded perspective / velocity gallery. It loads near the viewport with reserved space.
- `components/SiteShell.tsx`: scroll-direction navigation, page entrance/exit, reading line, mobile native dialog, and footer reveal.
- `components/InnerPages.tsx`: booking direction, date/slot layout states, FAQ, and article-relative reading progress.
- `styles/editorial.css`: responsive composition and motion fallbacks.

## Behavior constraints

Desktop choreography starts above 900px. Mobile uses a native swipe gallery and normal-flow care chapters. Fine-pointer effects require both hover and a fine pointer. Reduced motion disables large scroll transforms, perspective, velocity, pointer effects, and route masks. Content remains readable when those effects are absent.

Scroll-linked values stay in Motion values; React state changes only at discrete chapter or navigation changes. Horizontal travel is measured with ResizeObserver and observers are disconnected on unmount. Do not put overflow:hidden on a scrolling scene ancestor: the current main uses overflow:clip so sticky stages keep tracking the viewport.

The first and last specialty panels use function transforms for their distance from center. Do not feed out-of-range keyframe offsets into the native ScrollTimeline animation path.

Doctors and the mobile menu use native dialogs for modality, Escape and focus containment; focus returns to the opener. Doctor tabs support arrow keys, Home and End. No appointment is submitted during visual testing.

## Content

Existing photography is illustrative, not verified photography of the named doctors or facility. Visible labels preserve that distinction. Doctor credentials remain marked unverified. Homepage metrics describe the website's six specialties and five care steps, not patient counts or treatment outcomes. Existing medical article draft labels remain visible.

## Verification

Run `npm run lint`, `npm run typecheck`, and `npm run build`. Stop the dev server before the production build, then use `npm run start`; dev and build share the .next directory.

Browser checks covered the 1920, 1440, 1024, 768, 390 and 375px widths. Twelve public routes at those six widths had a heading and no document horizontal overflow (72 checks). Visual / interaction checks cover horizontal scrolling, sticky chapter changes, image expansion, doctor dialog and focus return, mobile navigation, FAQ, article progress, booking forward/back and date selection.

The configured database is unreachable in this workspace, so live slots and a successful booking cannot be verified here. Booking now presents a readable failure state for non-JSON server errors, clears stale slots, ignores aborted responses, and prevents advancing without a slot. No backend or database schema was changed. Reduced-motion fallbacks were inspected in code; OS preference emulation and hardware frame-rate profiling were not available through this browser interface. Do not claim a measured 60fps guarantee.
