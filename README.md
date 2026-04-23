# Warehouse 41

Your local game store and playspace. Reserve tables, join events, and play with the community — Magic: the Gathering, Kill Team, RPGs, and more.

Warehouse 41 is a booking-focused Next.js site for a brick-and-mortar tabletop shop: public pages for events, MTG table reservations, Kill Team sessions, and faction showcases, plus an admin area for managing bookings.

## Gallery

A few shots from the shop floor — painted terrain and models that live on our tables.

![Painted Imperial warehouse terrain — skull cogitator and pipework](public/gallery/terrain-warehouse-facade.jpg)
*Imperial warehouse facade — one of the centerpiece terrain sections used on our Kill Team tables.*

![Minotaur Beastman clashing with a Space Marine on catwalks](public/gallery/killteam-minotaur-vs-marine.jpg)
*Kill Team skirmish: a Beastman stalks a Primaris Marine across the upper gantries.*

![Imperial Inquisitor retinue advancing through rubble](public/gallery/killteam-inquisition-retinue.jpg)
*An Inquisition retinue pushes across the rubble, scout and operative flanking the objective.*

![Group shot of Space Marine and Death Guard Kill Teams](public/gallery/roster-marines-and-deathguard.jpg)
*Opposing rosters lined up pre-game — Space Marines and Plague Marines of the Death Guard.*

![Two operatives hold a rooftop gantry above fuel tanks](public/gallery/terrain-rooftop-gantry.jpg)
*High ground, oil drums, and a sniper's perch — classic Sector Imperialis board.*

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack) + React 19
- **Database:** Postgres (Supabase) via Prisma 7 with `@prisma/adapter-pg`
- **Auth:** NextAuth credentials provider, role-based (`customer` / `admin`)
- **Styling:** Tailwind CSS 4
- **Email:** Resend for booking confirmations
- **Monitoring:** Sentry
- **Analytics:** Vercel Analytics

## Features

- **Events** — browse and sign up for shop events at `/events`
- **MTG table booking** — reserve a table for Magic at `/mtg`
- **Kill Team** — book Kill Team sessions with terrain/teams at `/killteam`, plus faction pages (Nurgle, Khorne)
- **Accounts** — email/password sign-in at `/login`, registration at `/register`
- **Admin** — booking dashboards with filters and inline saves at `/admin`

## Getting started

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, NEXTAUTH_*, admin bootstrap creds
npx prisma db push
npm run dev
```

The dev server runs at http://localhost:3000.

### Useful scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | Lint the codebase |
| `npm run db:push` | Sync Prisma schema to the database |
| `npm run db:seed` | Seed development data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:check-url` | Verify `DATABASE_URL` is reachable |

## Environment

See `.env.example` for the full list. At minimum you'll need `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, and `ADMIN_EMAIL` / `ADMIN_PASSWORD` for the initial admin bootstrap.

## Project docs

- `docs/LAUNCH_STATUS.md` — current launch status, data model, and routes
- `docs/EXECUTION_CHECKLIST.md` — pre-launch checklist
