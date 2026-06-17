import { prisma } from "@/lib/db";
import { validateProduct } from "@/lib/validate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const newStock = body.stock as number;
    // Lifecycle: stamp soldOutAt the first time stock hits 0; clear it on restock.
    let soldOutAt: Date | null | undefined = undefined;
    if (newStock <= 0 && existing.stock > 0) soldOutAt = new Date();
    else if (newStock > 0 && existing.stock <= 0) soldOutAt = null;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name as string,
        description: body.description as string,
        price: body.price as number,
        category: body.category as string,
        stock: newStock,
        image: (body.image as string) || undefined,
        images: Array.isArray(body.images) ? (body.images as string[]) : undefined,
        featured: typeof body.featured === "boolean" ? body.featured : undefined,
        archived: typeof body.archived === "boolean" ? body.archived : undefined,
        sku: typeof body.sku === "string" && body.sku.trim() ? body.sku.trim() : null,
        productType:
          typeof body.productType === "string" && body.productType ? body.productType : undefined,
        lotSize: typeof body.lotSize === "number" ? body.lotSize : null,
        condition: typeof body.condition === "string" && body.condition ? body.condition : null,
        era: typeof body.era === "string" && body.era.trim() ? body.era.trim() : null,
        tags: Array.isArray(body.tags) ? (body.tags as string[]) : undefined,
        weight: typeof body.weight === "number" ? body.weight : null,
        tcgPlayerProductId:
          typeof body.tcgPlayerProductId === "string" && body.tcgPlayerProductId.trim()
            ? body.tcgPlayerProductId.trim()
            : null,
        ...(soldOutAt !== undefined ? { soldOutAt } : {}),
      },
    });
    return NextResponse.json(product);
  } catch (err) {
    if (err instanceof Error && err.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "SKU already in use" }, { status: 409 });
    }
    throw err;
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
