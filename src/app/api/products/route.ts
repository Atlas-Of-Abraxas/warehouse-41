import { prisma } from "@/lib/db";
import { validateProduct } from "@/lib/validate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const where: Record<string, unknown> = {};
  if (category) where.category = category;

  const products = await prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

/** Build the create/update payload from a validated body — explicit allow-list to block mass assignment. */
function pickProductFields(body: Record<string, unknown>) {
  const stock = body.stock as number;
  return {
    name: body.name as string,
    description: body.description as string,
    price: body.price as number,
    category: body.category as string,
    stock,
    image: (body.image as string) || "/images/placeholder.jpg",
    images: Array.isArray(body.images) ? (body.images as string[]) : [],
    featured: body.featured === true,
    archived: body.archived === true,
    sku: typeof body.sku === "string" && body.sku.trim() ? body.sku.trim() : null,
    productType: typeof body.productType === "string" && body.productType ? body.productType : "SINGLE",
    lotSize: typeof body.lotSize === "number" ? body.lotSize : null,
    condition: typeof body.condition === "string" && body.condition ? body.condition : null,
    era: typeof body.era === "string" && body.era.trim() ? body.era.trim() : null,
    tags: Array.isArray(body.tags) ? (body.tags as string[]) : [],
    weight: typeof body.weight === "number" ? body.weight : null,
    tcgPlayerProductId:
      typeof body.tcgPlayerProductId === "string" && body.tcgPlayerProductId.trim()
        ? body.tcgPlayerProductId.trim()
        : null,
    // New items start with no sold-out stamp regardless of stock: a stock=0 item
    // wasn't sold out, it was never stocked yet. The 12h window only applies to
    // items that transition from in-stock → out-of-stock.
    soldOutAt: null,
  };
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const validation = validateProduct(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const product = await prisma.product.create({ data: pickProductFields(body) });
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "SKU already in use" }, { status: 409 });
    }
    throw err;
  }
}
