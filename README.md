# Greenpal — Brand Site + Admin Panel

A long-form, editorial marketing site for Greenpal (portable power infrastructure),
plus an admin panel for managing orders, locations, purchases, and invoices.
Built with Next.js App Router, Tailwind CSS, Zustand, GSAP + ScrollTrigger, Lenis
(smooth scroll), Motion, and Recharts.

## Run it

```bash
npm install
cp .env.local.example .env.local   # fill in real values when you have them
npm run dev
```

Then open http://localhost:3000 for the site, or http://localhost:3000/admin
for the admin panel (demo password: `greenpal-admin`, or whatever you set
`NEXT_PUBLIC_ADMIN_DEMO_PASSWORD` to in `.env.local`).

To build for production:

```bash
npm run build
npm run start
```

## Routing structure

- `app/layout.tsx` — minimal root layout (fonts + theme bootstrap only).
- `app/(site)/` — the public marketing site. Its `layout.tsx` adds the
  Header, Footer, and Lenis smooth-scroll wrapper. Route group, so URLs are
  still `/`, `/about`, `/contact` (no `/site/` prefix).
- `app/admin/` — the admin panel, at `/admin`. Its `layout.tsx` shows a login
  gate until authenticated, then wraps pages in a sidebar shell. Deliberately
  does **not** inherit the public site's Header/Footer/smooth-scroll.

## The public site

- `components/Hero.tsx` — line-by-line headline reveal + 3-layer parallax + mouse-tilt.
- `components/PortalTransition.tsx` — the flagship pinned animation: the GP
  mark draws itself, scales through the viewport, then wipes away.
- `components/Elegance.tsx`, `Services.tsx`, `Expertise.tsx`, `Team.tsx`,
  `Work.tsx`, `Testimonials.tsx`, `MarqueeTicker.tsx`, `ClosingCTA.tsx` — the
  rest of the home page.
- `app/(site)/about/`, `app/(site)/contact/` — standalone pages, each with
  their own hero, content, and CTA rather than being cramped into one section.
- `lib/store.ts` — theme (persisted) and mobile nav state.
- `data/content.ts` — all editorial copy in one place.

## The admin panel (`/admin`)

**There is no real backend yet.** Everything reads and writes to
`lib/admin/store.ts`, a Zustand store persisted to `localStorage` that acts as
a stand-in database so the UI has something real to work against.

- `lib/admin/types.ts` — `Order`, `Location`, `Purchase`, `Invoice` shapes.
- `lib/admin/mockData.ts` — seed data.
- `lib/admin/store.ts` — the in-browser "database."
- `lib/admin/api.ts` — **the only file admin pages call.** Every function
  (`listOrders`, `createOrder`, `updateLocation`, etc.) currently reads/writes
  the local store with a simulated delay. When your real backend exists,
  rewrite the body of each function to call `fetch()` against it instead —
  no page component needs to change.
- `lib/admin/auth.ts` — **placeholder auth only.** Checks a password
  client-side against `NEXT_PUBLIC_ADMIN_DEMO_PASSWORD`. This offers no real
  security (the "password" ships in the JS bundle) and exists purely to keep
  the panel from being wide open during development. Replace with real
  server-side authentication before production.
- `components/admin/` — `AdminShell` (sidebar/topbar), `AdminLogin`, and
  `ui.tsx` (stat cards, tables, modals, form fields shared across pages).
- Pages: Dashboard (charts via Recharts), Orders, Locations, Purchases,
  Invoices, Reports, Settings.

## Stripe

Scaffolded, not wired to anything yet, per your call to add real payment
flows once the backend exists:

- `lib/stripe/server.ts` — server-only Stripe client (reads `STRIPE_SECRET_KEY`).
  Never import this from a `"use client"` file.
- `lib/stripe/client.ts` — lazy `loadStripe()` helper for Stripe Elements/Checkout
  on the frontend (reads `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`).
- `app/admin/settings/page.tsx` shows whether both keys are configured
  (never displays the secret key itself — it's a server component that only
  passes a boolean to the page).
- No API routes call Stripe yet. Add e.g. `app/api/checkout/route.ts` when
  you're ready to create real PaymentIntents/Checkout Sessions.

## Theming

Light and dark themes on the **public site** are driven by a `data-theme`
attribute on `<html>` and CSS custom properties in `app/globals.css`, toggled
in the header and persisted across visits. The **admin panel** ignores this
and always renders dark (typical for a dashboard) using literal Tailwind
colors rather than the CSS-variable system, so it looks consistent
regardless of what a visitor last set on the public site.

## Notes

- Motion respects `prefers-reduced-motion`: smooth scroll is skipped and the
  global stylesheet collapses animation/transition durations.
- React Strict Mode is off (`next.config.mjs`) — its dev-only double-effect
  invocation was racing against ScrollTrigger's pin-spacer DOM restructuring
  on route changes, which is what caused the earlier "removeChild" error.
  Every GSAP cleanup is also now defensive against mid-navigation unmounts.

