import "dotenv/config";
import { PrismaClient } from "@prisma/generated";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { prismaClient?: PrismaClient };

/** Resolved once; prefer DATABASE_URL, then Vercel+Supabase integration vars. */
function getDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL
  );
}

function normalizeDatabaseUrl(raw: string | undefined): string {
  if (!raw || !raw.trim()) {
    throw new Error(
      "No database URL. Set DATABASE_URL, or connect Supabase on Vercel so POSTGRES_PRISMA_URL / POSTGRES_URL is injected."
    );
  }
  let url = raw.trim();
  // Node/pg accept postgresql://; some dashboards copy postgres://
  if (url.startsWith("postgres://")) {
    url = `postgresql://${url.slice("postgres://".length)}`;
  }
  if (!url.startsWith("postgresql://")) {
    throw new Error(
      "DATABASE_URL must be a PostgreSQL URL (postgresql:// or postgres://). Check Vercel environment variables."
    );
  }
  let out = ensureSslModeForManagedPostgres(url);
  out = ensurePgbouncerParamForSupabasePooler(out);
  warnIfSupabaseDirectHostOnVercel(out);
  return out;
}

/** Prisma + Supabase transaction pooler expects `pgbouncer=true` (see Prisma PgBouncer docs). */
function ensurePgbouncerParamForSupabasePooler(urlStr: string): string {
  try {
    const u = new URL(urlStr);
    const h = u.hostname.toLowerCase();
    if (h.includes("pooler.supabase.com") && !u.searchParams.has("pgbouncer")) {
      u.searchParams.set("pgbouncer", "true");
      return u.href;
    }
  } catch {
    /* ignore */
  }
  return urlStr;
}

function warnIfSupabaseDirectHostOnVercel(urlStr: string): void {
  if (process.env.VERCEL !== "1") return;
  try {
    const u = new URL(urlStr);
    const h = u.hostname.toLowerCase();
    if (h.startsWith("db.") && h.endsWith(".supabase.co")) {
      console.warn(
        "[db] DATABASE_URL uses direct host db.*.supabase.co. On Vercel, use the Transaction pooler string instead (Supabase → Project Settings → Database → Connection string)."
      );
    }
  } catch {
    /* ignore */
  }
}

/** Supabase / Neon often need explicit SSL when sslmode is omitted from the copied URL. */
function ensureSslModeForManagedPostgres(urlStr: string): string {
  if (urlStr.includes("sslmode=")) {
    return urlStr;
  }
  try {
    const u = new URL(urlStr);
    const h = u.hostname.toLowerCase();
    if (
      h.endsWith(".supabase.co") ||
      h.includes("pooler.supabase.com") ||
      h.includes("neon.tech")
    ) {
      u.searchParams.set("sslmode", "require");
      return u.href;
    }
  } catch {
    /* ignore parse errors */
  }
  return urlStr;
}

export type DbQueryResult<T> = { ok: true; data: T } | { ok: false };

/** Run a Prisma call without taking down the whole page on connection errors. */
export async function dbQuery<T>(fn: () => Promise<T>): Promise<DbQueryResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (err) {
    console.error("[prisma]", err);
    return { ok: false };
  }
}

/** When sslmode=require is in the URL, node-pg may still verify the chain strictly; strip it when we pass explicit ssl options. */
function stripSslModeQuery(urlStr: string): string {
  try {
    const u = new URL(urlStr);
    u.searchParams.delete("sslmode");
    return u.href;
  } catch {
    return urlStr;
  }
}

function createPgPool(): Pool {
  let url = normalizeDatabaseUrl(getDatabaseUrl());
  const skipVerify = process.env.SKIP_DB_SSL_VERIFY === "1";
  if (skipVerify && process.env.NODE_ENV === "production") {
    console.warn(
      "[db] SKIP_DB_SSL_VERIFY=1 weakens TLS verification — use only when necessary (e.g. local SSL inspection)."
    );
  }
  if (skipVerify) {
    url = stripSslModeQuery(url);
    return new Pool({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
    });
  }
  return new Pool({ connectionString: url });
}

function createPrismaClient() {
  const adapter = new PrismaPg(createPgPool());
  return new PrismaClient({ adapter });
}

function getOrCreatePrisma(): PrismaClient {
  if (globalForPrisma.prismaClient) {
    return globalForPrisma.prismaClient;
  }
  const client = createPrismaClient();
  globalForPrisma.prismaClient = client;
  return client;
}

/** Lazy client so importing this module does not throw when DATABASE_URL is unset (fails on first query). */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getOrCreatePrisma(), prop, receiver);
  },
});
