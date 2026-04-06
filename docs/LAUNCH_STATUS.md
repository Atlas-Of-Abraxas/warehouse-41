## Warehouse-41 Launch Status (Pre-LLC / Pre-Domain)

### Tech baseline

- **Framework**: Next.js 16 (App Router, Turbopack) + React 19.
- **DB**: Postgres on Supabase (`DATABASE_URL` in `.env`), wired via Prisma 7 with the `@prisma/adapter-pg` adapter in `src/lib/db.ts`.
- **Auth**: Email/password with roles (`User.role`), NextAuth credentials provider, admin settings page for updating email/password.
- **Environment**: `.env` (gitignored) holds `DATABASE_URL`, `NEXTAUTH_*`, and admin bootstrap credentials.

### Data model (booking + future store)

- **User**
  - Fields: `id`, `email` (unique), `password`, `role` (default `"customer"`), `createdAt`, `updatedAt`.
- **Product / Order**
  - `Product`: name, description, price, category, image, stock, `featured`, timestamps.
  - `Order` / `OrderItem`: schema retained for future POS or online sales; public `/shop` and `/cart` are not deployed—`/api/products` is admin-only; `/admin/products` is reachable by URL for catalogue prep.
- **Events**
  - `Event`: title, description, `date` / `endDate`, `type`, `capacity`, `registered`, `price`, image, timestamps.
- **Sessions & session bookings**
  - `Session`: title, description, `gameSystem`, `gmName`, `date`, `duration`, `price`, `maxPlayers`, `currentPlayers`, image, timestamps.
  - `Booking`: links to `Session` and tracks:
    - `sessionId`, `customerName`, `customerEmail`, `seats`.
    - `paymentStatus` (`"pending"` / `"paid"` / `"refunded"`).
    - `status` (`"confirmed"` by default, supports `"pending"`, `"cancelled"`, `"no_show"` via API).
    - `paidInStore` (boolean) and optional `notes`.
- **MTGBooking**
  - Fields: `date`, `timeSlot`, optional `table`/`format`, `afterHours`, `customerName`, `customerEmail`.
  - `status` (`"confirmed"` default, supports `"cancelled"`, `"no_show"`), `paidInStore`, `notes`, timestamps.
- **KillTeamBooking**
  - Fields: `date`, `timeSlot`, `terrain`, `teams` (JSON string), `customerName`, `customerEmail`.
  - `status` (`"confirmed"` default, supports `"cancelled"`, `"no_show"`), `paidInStore`, `notes`, timestamps.

Schema is in `prisma/schema.prisma`, and the live Supabase database is in sync via `npx prisma db push`.

### Key routes and behavior

- **Public**
  - `/` (home), `/about` – booking-focused home (no public shop).
  - `/events` – event listing.
  - `/booking`, `/booking/[id]` – session discovery and booking.
  - `/mtg`, `/killteam` – MTG and Kill Team marketing pages with embedded booking forms.
  - `/login`, `/register` – auth.
- **Admin (role-based access)**
  - `/admin` – dashboard with counts for events, sessions, and bookings (MTG/Kill Team included); link to `/admin/products` for future inventory work.
  - `/admin/products` – full CRUD for products (not in sidebar while the public shop is off).
  - `/admin/orders` – list orders with line items; update status, POS reference, and notes (no online payment; matches external POS).
  - `/admin/events` – full CRUD for events.
  - `/admin/sessions` – full CRUD for bookable sessions.
  - `/admin/bookings` – list of session `Booking` records with status/payment display.
  - `/admin/mtg-bookings`, `/admin/killteam-bookings` – lists of MTG/Kill Team bookings with status display.
  - `/admin/settings` – admin can change their email/password via `/api/admin/settings`.

### Booking APIs (for admin tooling)

- **Session bookings** – `src/app/api/bookings/route.ts`
  - `GET` – returns all bookings with `session` included, newest first.
  - `POST` – validates body, checks capacity atomically, increments `Session.currentPlayers`, creates a `Booking` with:
    - `paymentStatus: "pending"`, `status: "confirmed"`.
  - `PUT` – admin-focused update:
    - Request body: `{ id, status?, paymentStatus?, paidInStore?, notes? }`.
    - Validates `status` in `["pending","confirmed","cancelled","no_show"]`.
    - Validates `paymentStatus` in `["pending","paid","refunded"]`.
    - Updates the provided fields on the booking.
- **MTG bookings** – `src/app/api/mtg/bookings/route.ts`
  - `GET` – lists MTG bookings ordered by `date`.
  - `POST` – validates, enforces unique (`date`,`timeSlot`) for non-cancelled bookings, creates booking with `status: "confirmed"`.
  - `PUT` – admin update:
    - Body: `{ id, status?, paidInStore?, notes? }`.
    - `status` in `["confirmed","cancelled","no_show"]`.
- **Kill Team bookings** – `src/app/api/killteam/bookings/route.ts`
  - `GET` – lists Kill Team bookings ordered by `date`.
  - `POST` – validates, enforces unique (`date`,`timeSlot`,`terrain`) for non-cancelled bookings, creates booking with `status: "confirmed"`.
  - `PUT` – admin update:
    - Body: `{ id, status?, paidInStore?, notes? }`.
    - `status` in `["confirmed","cancelled","no_show"]`.

### How to rebuild and run

- **Install deps**: `npm install`
- **Dev server**: `npm run dev` (uses `.env` for `DATABASE_URL` etc.).
- **Build check**: `npm run build` (currently passes).
- **Prisma / DB**
  - Generate client: `npx prisma generate`
  - Sync schema to Postgres: `npx prisma db push`
  - (Optional) Dev seed: `npm run db:seed`
  - One-off SQLite → Postgres migration script (if `dev.db` exists): `npx tsx scripts/migrate-sqlite-to-postgres.ts`

### Supabase / Postgres notes

- **Connection**: Use the **Supabase pooler** URI (transaction mode) in `DATABASE_URL` for Vercel/serverless. Keep credentials only in `.env` / Vercel env, not in git.
- **Migrations**:
  - The live DB schema was synced using `prisma db push` (no Prisma migration files yet).
  - For future, prefer:
    - `npx prisma migrate dev --name <change>` (local dev).
    - `npx prisma migrate deploy` (prod).

### Security & RBAC snapshot

- **Auth**:
  - Credential-based login; passwords hashed with bcrypt.
  - `User.role` is present and used to gate admin areas (see `src/middleware.ts` and admin routes).
- **Least privilege (future refinement)**:
  - Current code supports roles; you can extend policy as:
    - `admin` / `manager`: full access to admin routes and config.
    - `staff`: limited to bookings and perhaps events/sessions; no product or user management.
  - Enforcement should remain both server-side (in API/middleware) and client-side (UI visibility).

### Vercel redeploy (public)

1. **Git**: Push the branch you want; Vercel builds with `npm run build` (after `postinstall` → `prisma generate`).
2. **Environment variables** (Vercel → Project → Settings → Environment Variables), production:
   - `DATABASE_URL` — Supabase **pooler** connection string (recommended `postgresql://…pooler.supabase.com:6543/…?pgbouncer=true`); app adds `pgbouncer` if missing for pooler hosts.
   - `NEXTAUTH_URL` — `https://<your-deployment>.vercel.app` or your custom domain (must match the public URL).
   - `NEXTAUTH_SECRET` — strong random secret (same value as local or a new prod-only secret).
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` — if Supabase client features are used.
   - `AI_GATEWAY_API_KEY` — only if `/api/admin/ai/chat` is used.
   - `RESEND_API_KEY` — booking confirmation emails; optional `EMAIL_FROM` after domain verify in Resend.
   - `NEXT_PUBLIC_SENTRY_DSN` — Sentry error monitoring (omit to disable the SDK).
   - Do **not** set `SKIP_DB_SSL_VERIFY` in production unless you have a documented TLS issue (weakens verification).
3. **Smoke test after deploy**: home page loads without DB banner, `/events`, `/booking`, MTG/Kill Team forms submit, admin login.

### Known open areas (post-pause TODOs)

- **Admin bookings UI**:
  - Filters + inline save on `/admin/bookings`, `/admin/mtg-bookings`, `/admin/killteam-bookings` (see `SessionBookingsClient`, `MTGBookingsClient`, `KillTeamBookingsClient`).
  - Optional: per-booking detail pages, CSV export.
- **Email / notifications**:
  - **Resend** wired for booking confirmations (session, MTG, Kill Team) when `RESEND_API_KEY` is set. Set `EMAIL_FROM` after verifying a domain in Resend.
- **Payments**:
  - Intentionally out-of-scope on the website for now; the store uses a separate POS/terminal workflow.
  - Future: optional online checkout or POS sync can be added without the Stripe packages that were previously removed.
- **Analytics / monitoring**:
  - **Vercel Analytics** is enabled in `layout.tsx`.
  - **Sentry** (`@sentry/nextjs`): set `NEXT_PUBLIC_SENTRY_DSN` in Vercel (and locally) to enable. Optional: `SENTRY_AUTH_TOKEN` + org/project in `withSentryConfig` for source maps in CI.

