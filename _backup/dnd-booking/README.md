# D&D / RPG Session Booking — Backup

This folder contains a backup of the D&D (RPG session) booking feature, removed from the live site so only Kill Team table booking is shown. You can restore it later by copying these files back.

## Contents

- **app/booking/** — Public booking pages (session list + session detail + booking form)
- **app/admin/bookings/** — Admin page to view D&D session bookings
- **app/api/bookings/** — API route for creating and listing session bookings

## Restore instructions

1. Copy `app/booking/` back to `src/app/booking/`
2. Copy `app/admin/bookings/` back to `src/app/admin/bookings/`
3. Copy `app/api/bookings/` back to `src/app/api/bookings/`
4. Add back to `src/middleware.ts`: `"/api/bookings"` in the `ADMIN_FULL_PREFIXES` array
5. Add back to navbar, footer, homepage, and admin layout/dashboard as desired (see git history for previous links and labels)

Database models `Session` and `Booking` in Prisma are unchanged; no migration needed.
