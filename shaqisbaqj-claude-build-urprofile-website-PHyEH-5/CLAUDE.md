# UrProfile — CLAUDE.md

Read this file at the start of every session. It has everything you need to work on this project without exploring the codebase from scratch.

---

## Project Overview

**UrProfile** is a premium concierge video profile service. Clients book a half-day shoot with a creative director, or use the Self Guided (AI-assisted) path to film themselves. UrProfile edits the footage into a 45-second to 3-minute profile film, hosts it on a branded profile page, and ships NFC cards that open the profile with one tap.

**Core value prop:** Help professionals control their first impression before any meeting, interview, or pitch.

**Business model:** One-time payment per tier (Self Guided $299, Starter $599, Signature $999, Executive $2,499). Optional add-ons: NFC cards $25 each. Profile hosting included 12 months; renewal TBD.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion, Lenis (smooth scroll) |
| Database | Supabase (Postgres + Auth + RLS) |
| Video | Mux (hosting + playback) |
| Payments | Stripe (checkout + webhooks) |
| Email | Resend |
| AI | Anthropic SDK (Claude) |
| Analytics charts | Recharts |
| Deployment | Vercel (assumed) |

---

## Design System

**Never deviate from these values.**

### Colors
- `ember`: `#C4622D` — primary accent, CTAs, highlights
- `cream`: `#F5F0E8` — light backgrounds, text on dark
- `dark`: `#1C1A18` — primary dark background and text
- `sand`: `#C9B99A` — secondary neutral
- `linen`: `#E0D4C0` — borders, dividers on light backgrounds

### Typography
- **Display / Headlines:** `font-display` → Cormorant Garamond (`var(--font-cormorant)`), font-light (300), Georgia fallback
- **Body / UI:** `font-body` → DM Sans (`var(--font-dm-sans)`), system-ui fallback

### Spacing
- Sections: minimum `py-40 sm:py-56` between sections
- Generous whitespace — this is an editorial, premium brand

### Labels
Always style section labels as:
```
font-body text-[10px] tracking-[0.3em] uppercase text-*/25
```

### CTA links (not buttons)
```
font-body text-xs tracking-[0.22em] uppercase text-ember hover:text-ember/70
```

### No rounded corners
Sharp edges everywhere. `rounded-*` classes are never used except on portrait circles in the "Who It's For" section.

### Animation
- `EASE = [0.16, 1, 0.3, 1]` — use for all transitions
- Key animation components in `app/page.tsx`:
  - `HeroLine` — clip reveal on mount (hero headlines)
  - `Reveal` — clip from bottom on scroll
  - `FadeUp` — opacity + y translate on scroll
  - `WordReveal` — staggered word-by-word reveal on scroll

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server-side only, never expose) |
| `ANTHROPIC_API_KEY` | Claude AI for weekly insights + self-guided interview |
| `STRIPE_SECRET_KEY` | Stripe secret key (server-side) — set to `placeholder` to enable demo mode |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (client-side) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `RESEND_API_KEY` | Resend for transactional emails |
| `BOOKING_EMAIL` | Email address to receive booking notifications |
| `MUX_TOKEN_ID` | Mux API token ID |
| `MUX_TOKEN_SECRET` | Mux API token secret |
| `NEXT_PUBLIC_MUX_ENV_KEY` | Mux environment key for player |
| `NEXT_PUBLIC_APP_URL` | Full app URL (e.g. `https://urprofile.co`) — used in Stripe redirects |

**Demo mode:** If `STRIPE_SECRET_KEY` is `placeholder` or unset, the checkout API returns a redirect to `/book/success?demo=true` instead of creating a real Stripe session.

---

## Project Structure

```
app/
  page.tsx                   — Homepage (client component, all animations)
  layout.tsx                 — Root layout, fonts, smooth scroll
  globals.css                — Global styles
  book/
    page.tsx                 — Booking page (client component, tier selector + form + ContractModal)
    success/
      page.tsx               — Post-checkout confirmation page
  profile/
    [slug]/
      page.tsx               — Public profile page (server component, Mux video)
  dashboard/
    page.tsx                 — Client dashboard (analytics, profile status)
  login/
    page.tsx                 — Auth login page
  api/
    checkout/
      route.ts               — POST: create Stripe checkout session
    webhooks/
      stripe/
        route.ts             — POST: handle Stripe webhook events
    insight/
      route.ts               — AI-generated weekly insights (Anthropic)

components/
  Nav.tsx                    — Navigation (transparent/scrolled states)
  BookingForm.tsx            — Legacy form component (no longer used on book page)
  ContractModal.tsx          — Full-screen service agreement modal with e-signature
  MuxPlayer.tsx              — Mux video player wrapper
  ProfileCard.tsx            — Profile card component
  SmoothScroll.tsx           — Lenis smooth scroll provider
  Cursor.tsx                 — Custom cursor
  Intro.tsx                  — Intro/loading animation

lib/
  supabase.ts                — Supabase client, profile queries, analytics helpers
  types.ts                   — TypeScript interfaces (Profile, BookingFormData)

supabase/
  migrations/
    001_initial_schema.sql   — Full database schema (run in Supabase SQL editor)
```

---

## Database Schema (Summary)

All tables have Row Level Security (RLS) enabled.

| Table | Purpose |
|---|---|
| `profiles` | Client profile pages. Tracks tier, status, Mux video, NFC/shipping info. Status enum: `order-received → shoot-scheduled → shoot-complete → in-editing → review-ready → live → nfc-shipped` |
| `profile_events` | Analytics: views, contact clicks, NFC taps, shares. Anyone can insert; only profile owner can read. |
| `orders` | Payment records. Links to Stripe session/payment intent. Tracks fulfillment status. |
| `contracts` | Signed service agreements. Stores contract text, signature name, timestamp, IP. |
| `nfc_orders` | Add-on NFC card orders. Tracks quantity, payment, shipping. |
| `messages` | Client ↔ admin messaging thread. |
| `interview_sessions` | Self-guided AI interview sessions. Stores conversation history (JSONB), story brief, shot list, B-roll list, script framework. |
| `admin_users` | Simple admin role table. Insert a user's UUID to grant admin access. |

---

## Booking Flow

1. User selects tier on `/book` (default: Signature)
2. User fills form (name, email, phone, industry, message)
3. Form submit → `ContractModal` opens
4. User scrolls full agreement, checks box, types legal name
5. User clicks "Sign & Continue to Payment"
6. `ContractModal.onSign` fires → POST `/api/checkout` with tier + name + email
7. API creates Stripe checkout session (or returns demo URL if no Stripe key)
8. Browser redirects to Stripe checkout (or `/book/success?demo=true`)
9. On success, Stripe redirects to `/book/success?session_id=...`
10. Stripe webhook fires → `/api/webhooks/stripe` → logs payment (Phase 2: creates Supabase user + order record)

---

## Key Patterns

### Server vs Client Components
- `app/page.tsx` — `"use client"` (framer-motion animations require it)
- `app/book/page.tsx` — `"use client"` (state for tier selection, form, modal)
- `app/profile/[slug]/page.tsx` — Server component (SEO-friendly profile page)
- `app/dashboard/page.tsx` — Check if client or server; analytics requires client
- API routes — always server-side, no `"use client"`

### Supabase Auth Pattern
Use `getSupabaseClient()` from `lib/supabase.ts` for client-side queries.
Use `getSupabaseServerClient()` for server components and route handlers.
Service role key is only for admin operations — never expose to client.

### Images
- Use `<img>` (not Next.js `<Image>`) for Unsplash photos with `onLoad` opacity fade-in trick:
  ```jsx
  // eslint-disable-next-line @next/next/no-img-element
  <img
    className="opacity-0 transition-opacity duration-700"
    onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '0.5'; }}
  />
  ```
- Always add the `eslint-disable` comment above `<img>` tags to suppress the lint warning.
- Next.js `<Image>` component: `images.unsplash.com` and `image.mux.com` are both in `remotePatterns` in `next.config.mjs`.

### Animation Components
All animation components live at the top of `app/page.tsx` and should be copied/imported if needed in other pages:
- `HeroLine({ text, delay, className })` — mount-time clip reveal
- `Reveal({ children, delay, className })` — scroll-triggered clip
- `FadeUp({ children, delay, className })` — scroll-triggered fade+translate
- `WordReveal({ text, className, delay })` — staggered word reveal on scroll

### Stripe in Demo Mode
If `STRIPE_SECRET_KEY === "placeholder"` or is unset, `POST /api/checkout` returns:
```json
{ "url": "/book/success?demo=true", "demo": true }
```
The success page detects `?demo=true` and shows a notice about connecting Stripe.

---

## What's Been Built (Phase 1)

- [x] Homepage (`app/page.tsx`) — full marketing page with:
  - Hero with background image + overlay
  - "Why first impressions fail" — split layout with image
  - Demo profile showcase (Mux thumbnail + parallax)
  - How It Works (3 steps)
  - Two Ways section (Self Guided card + Concierge card)
  - Who It's For with portrait row + 7 audience types
  - Pricing — 4 tiers (Self Guided, Starter, Signature, Executive)
  - FAQ accordion
  - Book CTA section
  - Footer
- [x] Navigation (`components/Nav.tsx`) — transparent/scrolled, 3 center links, ember CTA
- [x] Booking page (`app/book/page.tsx`) — tier selector, form, ContractModal → Stripe
- [x] ContractModal (`components/ContractModal.tsx`) — scroll progress, e-signature, animated
- [x] Stripe checkout API (`app/api/checkout/route.ts`) — real + demo mode
- [x] Stripe webhook (`app/api/webhooks/stripe/route.ts`) — handles `checkout.session.completed`
- [x] Booking success page (`app/book/success/page.tsx`) — confirmation, demo note
- [x] Database schema (`supabase/migrations/001_initial_schema.sql`) — all tables + RLS
- [x] Environment variables documented (`.env.example`)
- [x] Profile page (`app/profile/[slug]/page.tsx`) — public profile with Mux video
- [x] Dashboard (`app/dashboard/page.tsx`) — analytics + profile status
- [x] AI insight API (`app/api/insight/route.ts`) — Claude-powered weekly insights

---

## Phase 2 Roadmap — Client Portal (`/portal`)

**Goal:** After payment, clients get a portal to track their profile's production status, message UrProfile, and access their deliverables.

### Routes
- `/portal` — Dashboard: production status tracker, messages, profile preview link
- `/portal/profile` — Edit profile details (bio, headline, contact info)
- `/portal/messages` — Messaging thread with UrProfile team
- `/portal/nfc` — Order additional NFC cards (Stripe)
- `/portal/settings` — Account settings, password change

### Status Tracker Component
Visual step-by-step tracker using the status enum:
`order-received → shoot-scheduled → shoot-complete → in-editing → review-ready → live → nfc-shipped`

### Email Notifications (Resend)
Trigger emails on status changes:
- Order received → welcome email with next steps
- Shoot scheduled → calendar details
- Review ready → "Your profile is ready to review" with preview link
- Live → "Your profile is live" with profile URL
- NFC shipped → tracking number

### Auth Flow
- After Stripe payment, webhook creates Supabase auth user (email + temp password)
- Sends welcome email with portal login link
- Client sets password on first login

---

## Phase 3 Roadmap — Self Guided AI Interview + Advanced Features

### Self Guided Interview (`/self-guided`)
- Landing page explaining the self-guided process
- AI interview flow: Claude asks 10-15 questions about the client's story, role, goals
- Generates personalized shot list + B-roll suggestions + script framework
- Client uploads clips → stored in Supabase Storage (or direct to Mux)
- Status tracks through same production pipeline

### File Uploads
- Supabase Storage for clip uploads
- Direct-to-Mux upload API for video processing
- Progress indicator during upload

### Analytics Tracking
- NFC tap events logged via API (edge function or route)
- Profile view tracking with device detection
- Watch duration tracking via Mux player events
- Analytics dashboard with Recharts: views over time, device breakdown, geographic map

### Stripe Customer Portal
- Allow clients to update payment method
- View past invoices
- Cancel/modify hosting subscription (Phase 3+)

### Additional NFC Cards
- Stripe payment flow for add-on NFC orders
- Admin fulfillment dashboard

### Admin Portal (`/admin`)
- View all orders + production status
- Update client status (triggers email notification)
- Upload finished profile video (Mux)
- Approve profiles before going live
- Manage messaging threads

---

## Notes for Future Sessions

- **Do not modify** these files unless explicitly asked: `app/profile/[slug]/page.tsx`, `app/dashboard/page.tsx`, `app/login/page.tsx`, `app/api/insight/route.ts`
- The homepage `app/page.tsx` is `"use client"` — it must stay that way for framer-motion
- Stripe webhook uses `req.text()` (raw body) — this works correctly in Next.js App Router
- All `<img>` tags need the `// eslint-disable-next-line @next/next/no-img-element` comment
- NFC card price: $25 each (updated from original $8 — the pricing section footer shows $25)
- Contact email: `hello@urprofile.co` (not .com)
