/**
 * Validates DB URL shape for Supabase + Vercel. Run: npm run db:check-url
 * Same resolution order as src/lib/db.ts (Vercel+Supabase integration vars included).
 */
import "dotenv/config";

const raw =
  process.env.DATABASE_URL?.trim() ??
  process.env.POSTGRES_PRISMA_URL?.trim() ??
  process.env.POSTGRES_URL?.trim();
if (!raw) {
  console.error(
    "No database URL. Set DATABASE_URL, or POSTGRES_PRISMA_URL / POSTGRES_URL (from Vercel+Supabase)."
  );
  process.exit(1);
}

let urlStr = raw;
if (urlStr.startsWith("postgres://")) {
  urlStr = `postgresql://${urlStr.slice("postgres://".length)}`;
}

let u: URL;
try {
  u = new URL(urlStr);
} catch {
  console.error("DATABASE_URL is not a valid URL.");
  process.exit(1);
}

const host = u.hostname.toLowerCase();
const port = u.port || "5432";
const isDirectSupabase = host.startsWith("db.") && host.endsWith(".supabase.co");
const isPooler =
  host.includes("pooler.supabase.com") ||
  host.includes("pooler.supabase.co");
const hasPgbouncer = u.searchParams.get("pgbouncer") === "true";

console.log("DATABASE_URL host:", host);
console.log("Port:", port);

if (isPooler) {
  console.log("✓ Using a pooler host (good for Vercel / serverless).");
  if (!hasPgbouncer) {
    console.warn(
      "⚠ Add ?pgbouncer=true to the URL for Prisma + transaction pooler (or rely on app code that adds it)."
    );
  } else {
    console.log("✓ pgbouncer=true is set.");
  }
} else if (isDirectSupabase) {
  console.warn(
    "⚠ Direct db.*.supabase.co — often fails from Vercel (P1001). Use the Transaction pooler URI from Supabase → Database → Connection string."
  );
} else {
  console.log("(Not a Supabase db.* / pooler host — skipping pooler checks.)");
}

if (!u.searchParams.has("sslmode") && host.includes("supabase")) {
  console.warn("⚠ Consider sslmode=require if connections fail (app may add this automatically).");
}

console.log("\nDone.");
process.exit(0);
