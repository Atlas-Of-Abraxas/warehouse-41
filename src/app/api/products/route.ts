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

  // Explicitly pick allowed fields — prevent mass assignment
  const product = await prisma.product.create({
    data: {
      name: body.name as string,
      description: body.description as string,
      price: body.price as number,
      category: body.category as string,
      stock: body.stock as number,
      image: (body.image as string) || "/images/placeholder.jpg",
      featured: body.featured === true,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
