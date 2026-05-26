# Warehouse 41 — Design/Build Handoff

Last updated: 2026-04-24. Branch: `claude/add-readme-content-36l3w`.

This doc hands off an in-progress UI redesign to another Claude agent working
outside the app. Read the **Hard rules** section before writing any code — two
prior design directions were thrown out, and one was rejected specifically for
fabricating content.

---

## 1. What this project is

`warehouse-41` — a Next.js 16 (App Router, Turbopack) + React 19 site for a
brick-and-mortar tabletop game shop. Booking-focused: events, MTG table
reservations, Kill Team sessions, and tabletop RPG sessions, plus an admin area.

- **DB:** Postgres (Supabase) via Prisma 7, `@prisma/adapter-pg`, accessed
  through `src/lib/db.ts` (`dbQuery()` wrapper returns `{ ok, data }` and never
  throws — pages render an empty/placeholder state when the DB is unreachable).
- **Auth:** NextAuth credentials provider, role-based (`customer` / `admin`).
- **Deploy:** Vercel. Preview deployments per branch push are the ground-truth
  preview (the dev server in any sandbox is NOT reachable by the owner).

---

## 2. Hard rules (do not violate)

1. **Do not fabricate copy.** Hours, prices, addresses, house rules, schedules,
   event details, faction names, etc. must come from (a) the existing codebase,
   (b) real schema/DB data, or (c) the owner. If a section needs words that
   don't exist yet, insert a clearly marked `{/* TODO: copy from owner */}`
   placeholder and list it for the owner — do not invent plausible-sounding
   text. A previous pass "murdered the schedule" by overwriting real shop hours
   (`Mon-Sat 11am-9pm, Sun 12pm-6pm`) with invented ones. That eroded trust.
2. **Scope rule (owner-approved):** layout, typography, and structural
   reshuffles are fine; **copy stays factual.** Restyle existing strings; don't
   author new claims.
3. **Tone:** This is a shop run by people who love these games, for people who
   feel the same way — explicitly *anti* "card mill." NOT a video-game/arcade
   theme, NOT manufactured nostalgia. The reference points the owner endorsed
   are **Hill Farmstead** (indie, letter-from-the-owner voice, photo-led,
   restrained) and **Wyrmwood-for-tabletop** (warm, considered, product/hobby
   in the spotlight). A neon-arcade pass was explicitly rejected as "cartoony."
4. **The logo is sacred.** Do not recreate, redraw, or approximate it. It lives
   at `public/logo.jpg` (2000×427). Reference it; never regenerate it.
5. **Confirm before big moves.** Use the equivalent of a clarifying question
   for anything ambiguous (color, IA changes, copy) rather than guessing. The
   owner prefers being asked over cleanup.
6. **Commit + push to `claude/add-readme-content-36l3w`.** Build must pass
   (`npm run build`) before every push. Vercel rebuilds the preview on push.

---

## 3. Design system (already established)

Defined in `src/app/globals.css` (Tailwind v4 `@theme`). Fonts loaded via a
runtime `<link>` in `src/app/layout.tsx` — **do NOT switch to
`next/font/google`** (it fetches at build time; Vercel/sandbox builds failed on
that — see §6).

**Palette (warm near-black + single brass accent):**
| Token | Hex | Use |
|---|---|---|
| `--color-bg-primary` | `#0e0b0a` | page background |
| `--color-bg-secondary` | `#16110f` | bands/sections |
| `--color-bg-card` | `#1d1714` | cards |
| `--color-bg-elevated` | `#261e1a` | raised surfaces |
| `--color-text-primary` | `#ece4d3` | body/headlines (warm bone) |
| `--color-text-secondary` | `#b8ad97` | secondary text |
| `--color-text-muted` | `#8a8170` | muted/labels |
| `--color-accent` | `#a8763a` | antique brass — the ONLY accent |
| `--color-accent-hover` | `#c08a4a` | hover |
| `--color-border` | `#2a221d` | hairline borders |
| `--color-border-bright` | `#3d342c` | emphasized borders |
| `--color-gold` / `--color-gold-bright` | brass | legacy aliases (old pages still ref these; safe to keep) |

**Type:** `--font-display` = Fraunces (serif, headings), `--font-body` = Inter
(body), `--font-mono` = JetBrains Mono.

**Utilities (in globals.css):** `.eyebrow` (small-caps brass label),
`.rule-brass` (thin gradient divider), `.paper-grain` (near-invisible texture).

**Reusable components — NOT yet extracted.** The homepage (`src/app/page.tsx`)
defines `SectionHeader`, `PrimaryLink`, `QuietLink`, `PlayBlock`, `EventRow`,
`DetailRow` locally. **First refactor task:** lift `PrimaryLink`, `QuietLink`,
`SectionHeader`, and the eyebrow pattern into `src/components/ui/` so every
page styles consistently. Right now nothing is shared, which is the main risk
for drift.

---

## 4. Current state

**Redesigned to the editorial standard:**
- `src/app/page.tsx` (homepage)
- `src/components/layout/Navbar.tsx` (logo + plain sans links, brass hover)
- `src/components/layout/Footer.tsx` (logo wordmark, brass eyebrows)
- `src/app/globals.css`, `src/app/layout.tsx`

**NOT yet redesigned — still the old "barebones" look** (these inherit the new
palette + fonts automatically because they use `var(--color-*)` tokens, so they
render coherently but use the old layout language: `text-5xl font-bold`
two-tone accent+gold headings, `rounded-lg` cards, `bg-accent text-white`
buttons, lucide icons everywhere):
- `src/app/mtg/page.tsx` + `src/app/mtg/MTGBookingForm.tsx`
- `src/app/killteam/page.tsx` + `src/app/killteam/KillTeamBookingForm.tsx`
- `src/app/events/page.tsx`
- `src/app/about/page.tsx`
- `src/app/booking/page.tsx` + `src/app/booking/[id]/page.tsx`
- `src/app/login/page.tsx`, `src/app/register/page.tsx`
- `src/app/admin/**` (11 pages — internal tooling; lowest priority, arguably
  leave alone)

**Known placeholder copy on the homepage (owner aware, awaiting real copy):**
- Hero subhead paragraph
- "What we play" blurbs (MTG / Kill Team / RPG)
- "Visit" card rows: Reservations, House rules, Counter
- Footer description paragraph + tagline
Mark these and any new ones with `{/* TODO: copy from owner */}`.

**Data source of truth for Kill Team** is `src/lib/killteam.ts` — the
`KILL_TEAMS` array drives both the page list AND the booking-form validation.
Current roster (11 teams) is correct as of the last commit; don't change
without owner direction.

---

## 5. Remaining work — prioritized

1. **Extract shared UI components** (`src/components/ui/`): `PrimaryLink`,
   `QuietLink`, `SectionHeader`, `Eyebrow`, a `Card`, and a form-field set
   (label/input/error). Everything else depends on this.
2. **Navigation.** Current nav has 7 top-level links (`Home, Events, Kill Team,
   MTG, Book a Table, Book a Session, About`) plus auth. "Book a Table"
   (→`/mtg#book`) and "Book a Session" (→`/booking`) overlap with the game
   links and confuse the IA. Recommend grouping: primary links (Events, Magic,
   Kill Team, RPGs, About) + a single "Reserve" affordance, with the mobile menu
   reworked. Add active-route styling. **Confirm the IA with the owner first.**
3. **Public pages to editorial standard**, in this order: MTG, Kill Team
   (+ their booking forms), Events (has type filters), Booking list + `[id]`
   detail, About, then Login/Register.
4. **Forms** (`MTGBookingForm`, `KillTeamBookingForm`, auth): consistent field
   styling, focus/disabled/error states, success states. These are the fiddliest.
5. **Photography.** Homepage "From the paint table" section + per-section
   imagery are stubbed. Owner will provide JPGs (extractable from chat transcript
   if pasted — see §6). Build a responsive gallery; lazy-load; respect aspect
   ratios.
6. **Warmth/polish pass:** hover/transition consistency, empty/loading states,
   accessibility (focus rings, contrast, alt text, semantics), responsive QA.
7. **Admin** (optional): only if owner asks.

---

## 6. Gotchas / lessons learned

- **Fonts:** loaded via runtime `<link>` in `layout.tsx`. `next/font/google`
  was tried and **broke the Vercel build** (build-time fetch to
  fonts.googleapis.com failed). CSP in `next.config.ts` was widened to allow
  `https://fonts.googleapis.com` (style-src) and `https://fonts.gstatic.com`
  (font-src). Keep it that way.
- **DB unreachable in preview:** the Vercel preview has no DB, so any
  `dbQuery()`-backed list renders its empty state and `DbWarningBanner` shows.
  That's expected; design the empty states to read well (shop voice, not error
  overlay), and never block layout on data.
- **Preview access:** if the owner reports 403 on the `*.vercel.app` URL, it's
  Vercel Deployment Protection on previews — they fix it in project settings,
  it's not a code issue.
- **Images from chat:** the owner pastes images into chat. They are NOT written
  to disk, but the Claude client embeds them as base64 in the local transcript
  at `~/.claude/projects/<slug>/<session>.jsonl`. You can decode them out (find
  the `type:"image"` → `source.data` entries; pick the most recent). That's how
  `public/logo.jpg` was recovered. PIL is not installed in this environment;
  save the raw bytes with the correct extension (JPEG → `.jpg`).
- **Build before push, always.** `npm run build` must succeed. Watch for the
  `<img>` eslint rule — existing imgs use
  `{/* eslint-disable-next-line @next/next/no-img-element */}`.

---

## 7. Git / workflow

- Develop and push to **`claude/add-readme-content-36l3w`**.
- `git push -u origin claude/add-readme-content-36l3w`; retry network failures
  with backoff. Do NOT open a PR unless asked.
- Commit messages: imperative subject, a short body explaining the *why*. See
  existing branch history for tone.
- Do not push to `main`. Do not force-push. Do not skip hooks.
