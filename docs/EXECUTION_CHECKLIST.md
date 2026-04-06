# Fast path: production readiness (steps 1–6)

Do these **in order** where a step depends on the previous one. Parallel items are marked.

---

## 1. Vercel environment variables (required)

**You:** Vercel → Project → **Settings** → **Environment Variables** → **Production** (and Preview if you use it).

| Variable | What to put |
|----------|-------------|
| `DATABASE_URL` | Supabase **transaction pooler** URI (port 6543, host `*.pooler.supabase.com`), with password. |
| `NEXTAUTH_URL` | Exact public URL: `https://YOURPROJECT.vercel.app` or `https://yourdomain.com` (no trailing slash). |
| `NEXTAUTH_SECRET` | Random string (e.g. `openssl rand -base64 32`). Never commit. |
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase → Settings → API, if you use Supabase JS helpers. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase anon/publishable key, if used. |

**Do not** set `SKIP_DB_SSL_VERIFY` in Production.

**Parallel while waiting:** Confirm Supabase project is not paused.

---

## 2. Resend (booking emails)

**You:**

1. [resend.com](https://resend.com) → sign up → **API Keys** → create key.
2. Vercel → add `RESEND_API_KEY` = that key.
3. (Soon) **Domains** → add your domain → verify DNS → set `EMAIL_FROM` = `Warehouse 41 <bookings@yourdomain.com>`.

Until domain verify, test emails may only reach your own inbox when using Resend’s test sender.

**Parallel:** Nothing blocks deploy; emails simply won’t send until the key is set.

---

## 3. Smoke test (after deploy)

**You:** When Production build is green, click through:

- [ ] `/` — no yellow DB banner  
- [ ] `/events`  
- [ ] `/booking` — submit a test booking (then cancel with admin if needed)  
- [ ] `/mtg` and `/killteam` — submit test bookings  
- [ ] `/login` → `/admin` — dashboard loads  
- [ ] `/admin/bookings` (and MTG / Kill Team) — filters/edits work if implemented  

**Parallel:** Fix any env typo and **Redeploy** if something 500s.

---

## 4. Admin bookings UX (filters + inline actions)

**Code (done in repo):** Session, MTG, and Kill Team admin pages include search/status filters (plus date window for MTG/KT), and **Save** updates via existing `PUT` APIs.

**You:** Merge/deploy this branch, then smoke-test the three admin booking pages as admin.

---

## 5. Custom domain

**You:**

1. Buy/connect domain at your registrar.
2. Vercel → Project → **Settings** → **Domains** → add domain → follow DNS records (usually A/CNAME to Vercel).
3. When SSL is ready, set **`NEXTAUTH_URL`** to `https://yourdomain.com` (exact) and redeploy.

**Parallel:** Nothing else depends on this for “going live” on `*.vercel.app`.

---

## 6. Dependabot / npm advisories

**You:** GitHub → **Security** → **Dependabot** (or **Pull requests** from Dependabot).

- Review one PR at a time; run `npm run build` locally on a branch if unsure.
- Prefer **patch/minor** bumps first; read notes for majors (e.g. Next major).

**Parallel:** Can wait until after launch traffic is stable.

---

## Fastest overall timeline

| Day | Focus |
|-----|--------|
| **Today** | 1 + deploy + 3 (smoke test). Add 2 when Resend key is ready. |
| **Soon** | 5 when DNS is ready. |
| **Ongoing** | 6 in small batches. |

**Optional:** `NEXT_PUBLIC_SENTRY_DSN` only if you create a Sentry project later.
