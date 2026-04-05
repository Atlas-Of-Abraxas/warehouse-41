/**
 * One-off migration: copy data from SQLite (prisma/dev.db) to Postgres.
 * Run from project root: npx tsx scripts/migrate-sqlite-to-postgres.ts
 *
 * Requires: DATABASE_URL in .env pointing at Postgres.
 * If prisma/dev.db (or ./dev.db) is missing, this script exits and suggests running db:seed.
 */

import "dotenv/config";
import path from "path";
import fs from "fs";
import Database from "better-sqlite3";

const SQLITE_PATHS = [
  path.join(process.cwd(), "prisma", "dev.db"),
  path.join(process.cwd(), "dev.db"),
];

function findSqliteDb(): string | null {
  for (const p of SQLITE_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const DATE_FIELDS: Record<string, string[]> = {
  User: ["createdAt", "updatedAt"],
  Product: ["createdAt", "updatedAt"],
  Event: ["date", "endDate", "createdAt", "updatedAt"],
  Session: ["date", "createdAt", "updatedAt"],
  Order: ["createdAt", "updatedAt"],
  OrderItem: [],
  KillTeamBooking: ["date", "createdAt", "updatedAt"],
  MTGBooking: ["date", "createdAt", "updatedAt"],
};

const BOOLEAN_FIELDS: Record<string, string[]> = {
  Product: ["featured"],
  MTGBooking: ["afterHours"],
};

function toDate(val: unknown): Date {
  if (val instanceof Date) return val;
  if (typeof val === "string" || typeof val === "number") return new Date(val);
  return new Date();
}

function rowToRecord<T extends Record<string, unknown>>(
  row: T,
  dateFields: string[],
  booleanFields: string[]
): T {
  const out = { ...row };
  for (const key of dateFields) {
    if (key in out && out[key] != null) {
      (out as Record<string, unknown>)[key] = toDate(out[key]);
    }
  }
  for (const key of booleanFields) {
    if (key in out) {
      const v = out[key];
      (out as Record<string, unknown>)[key] = v === 1 || v === true || v === "1";
    }
  }
  return out;
}

async function main() {
  const sqlitePath = findSqliteDb();
  if (!sqlitePath) {
    console.log(
      "No SQLite database found at prisma/dev.db or ./dev.db. Nothing to migrate."
    );
    console.log(
      "To seed Postgres with initial data, run: npm run db:seed"
    );
    process.exit(0);
  }

  if (!process.env["DATABASE_URL"]?.startsWith("postgresql://")) {
    console.error("DATABASE_URL must be set to a Postgres URL in .env");
    process.exit(1);
  }

  console.log("Reading SQLite from:", sqlitePath);
  const sqlite = new Database(sqlitePath, { readonly: true });
  const { prisma } = await import("../src/lib/db.js");

  try {
    // Clear Postgres tables in dependency order so migration is re-runnable
    console.log("Clearing existing Postgres data...");
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.killTeamBooking.deleteMany({});
    await prisma.mTGBooking.deleteMany({});
    const tableToKey: Record<string, string> = {
      User: "user",
      Product: "product",
      Event: "event",
      Session: "session",
      Order: "order",
      OrderItem: "orderItem",
      KillTeamBooking: "killTeamBooking",
      MTGBooking: "mTGBooking",
    };

    for (const [tableName, clientKey] of Object.entries(tableToKey)) {
      const dateFields = DATE_FIELDS[tableName] ?? [];
      const booleanFields = BOOLEAN_FIELDS[tableName] ?? [];
      const rows = sqlite.prepare(`SELECT * FROM "${tableName}"`).all() as Record<string, unknown>[];
      if (rows.length === 0) {
        console.log(`  ${tableName}: 0 rows (skip)`);
        continue;
      }
      type CreateMany = (arg: { data: unknown[] }) => Promise<{ count: number }>;
      const model = (prisma as Record<string, { createMany: CreateMany }>)[clientKey];
      if (!model?.createMany) {
        console.warn(`  ${tableName}: no Prisma model found, skip`);
        continue;
      }
      const data = rows.map((row) => rowToRecord(row, dateFields, booleanFields));
      const result = await model.createMany({ data });
      console.log(`  ${tableName}: ${result.count} rows`);
    }

    console.log("Migration from SQLite to Postgres completed.");
  } finally {
    sqlite.close();
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
