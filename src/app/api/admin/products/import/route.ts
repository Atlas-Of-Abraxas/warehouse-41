import { prisma } from "@/lib/db";
import { validateProduct } from "@/lib/validate";
import { CATEGORIES, CONDITIONS, PRODUCT_TYPES } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

/**
 * Admin-gated bulk import for Products. Rows are parsed client-side from CSV
 * and POSTed here as a JSON array. Each row is independent — failures are
 * reported per-row and don't roll back successful rows.
 *
 * Upsert key: `sku`. If a row has a SKU that matches an existing product,
 * we UPDATE it; otherwise we CREATE.
 */

interface ImportRow {
  sku?: string | null;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  productType?: string;
  lotSize?: number | null;
  condition?: string | null;
  era?: string | null;
  tags?: string[];
  weight?: number | null;
  image?: string;
  images?: string[];
  featured?: boolean;
  archived?: boolean;
  tcgPlayerProductId?: string | null;
}

type RowResult =
  | { line: number; status: "created"; id: string; name: string }
  | { line: number; status: "updated"; id: string; name: string }
  | { line: number; status: "error"; error: string };

const ALLOWED_CATEGORIES = new Set(Object.keys(CATEGORIES));
const ALLOWED_CONDITIONS = new Set(Object.keys(CONDITIONS));
const ALLOWED_PRODUCT_TYPES = new Set(Object.keys(PRODUCT_TYPES));

function fieldPayload(r: ImportRow, existingSoldOutAt: Date | null) {
  const stock = r.stock ?? 0;
  // Lifecycle: clear soldOutAt on restock; preserve existing stamp otherwise.
  const soldOutAt =
    stock > 0 && existingSoldOutAt ? null : existingSoldOutAt;

  return {
    name: r.name as string,
    description: r.description as string,
    price: r.price as number,
    category: r.category as string,
    stock,
    image: r.image && r.image.length > 0 ? r.image : "/images/placeholder.jpg",
    images: r.images ?? [],
    featured: r.featured === true,
    archived: r.archived === true,
    sku: r.sku && r.sku.length > 0 ? r.sku : null,
    productType: r.productType || "SINGLE",
    lotSize: r.lotSize ?? null,
    condition: r.condition || null,
    era: r.era || null,
    tags: r.tags ?? [],
    weight: r.weight ?? null,
    tcgPlayerProductId:
      r.tcgPlayerProductId && r.tcgPlayerProductId.length > 0 ? r.tcgPlayerProductId : null,
    soldOutAt,
  };
}

export async function POST(request: NextRequest) {
  let body: { rows?: ImportRow[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!Array.isArray(body.rows) || body.rows.length === 0) {
    return NextResponse.json({ error: "rows must be a non-empty array" }, { status: 400 });
  }
  if (body.rows.length > 1000) {
    return NextResponse.json(
      { error: "Too many rows in one import (max 1000)" },
      { status: 400 }
    );
  }

  const results: RowResult[] = [];

  for (let i = 0; i < body.rows.length; i++) {
    const line = i + 2; // +1 for 0-index, +1 for header row
    const r = body.rows[i] || {};

    try {
      // Enum allow-lists
      if (r.category && !ALLOWED_CATEGORIES.has(r.category)) {
        results.push({ line, status: "error", error: `Unknown category "${r.category}"` });
        continue;
      }
      if (r.condition && !ALLOWED_CONDITIONS.has(r.condition)) {
        results.push({ line, status: "error", error: `Unknown condition "${r.condition}"` });
        continue;
      }
      if (r.productType && !ALLOWED_PRODUCT_TYPES.has(r.productType)) {
        results.push({ line, status: "error", error: `Unknown productType "${r.productType}"` });
        continue;
      }
      if (r.productType === "LOT" && (r.lotSize === null || r.lotSize === undefined)) {
        results.push({ line, status: "error", error: "LOT rows require a lotSize" });
        continue;
      }

      const validation = validateProduct(r as Record<string, unknown>);
      if (!validation.valid) {
        results.push({ line, status: "error", error: validation.error });
        continue;
      }

      if (r.sku) {
        const existing = await prisma.product.findUnique({ where: { sku: r.sku } });
        if (existing) {
          const updated = await prisma.product.update({
            where: { id: existing.id },
            data: fieldPayload(r, existing.soldOutAt),
          });
          results.push({ line, status: "updated", id: updated.id, name: updated.name });
          continue;
        }
      }

      const created = await prisma.product.create({ data: fieldPayload(r, null) });
      results.push({ line, status: "created", id: created.id, name: created.name });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      results.push({ line, status: "error", error: msg });
    }
  }

  const created = results.filter((r) => r.status === "created").length;
  const updated = results.filter((r) => r.status === "updated").length;
  const errored = results.filter((r) => r.status === "error").length;

  return NextResponse.json({
    summary: { total: body.rows.length, created, updated, errored },
    results,
  });
}
