import { rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = rateLimit(ip, { windowMs: 60_000, max: 10 });
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: { items?: { id: string; quantity: number }[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { items } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Validate item shape
  for (const item of items) {
    if (
      typeof item.id !== "string" ||
      typeof item.quantity !== "number" ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    ) {
      return NextResponse.json(
        { error: "Invalid item in cart" },
        { status: 400 }
      );
    }
  }

  // Look up real prices and stock from the database — never trust client prices
  const productIds = items.map((i) => i.id);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, price: true, stock: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  // Verify all products exist and have sufficient stock
  const errors: string[] = [];
  for (const item of items) {
    const product = productMap.get(item.id);
    if (!product) {
      errors.push(`Product not found: ${item.id}`);
    } else if (product.stock < item.quantity) {
      errors.push(
        `Insufficient stock for "${product.name}": requested ${item.quantity}, available ${product.stock}`
      );
    }
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors[0] }, { status: 400 });
  }

  // Calculate total from DB prices
  const verifiedItems = items.map((item) => {
    const product = productMap.get(item.id)!;
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    };
  });

  // Stripe integration placeholder
  // In production, create a Stripe Checkout Session here:
  //
  // const session = await stripe.checkout.sessions.create({
  //   payment_method_types: ['card'],
  //   line_items: verifiedItems.map(item => ({
  //     price_data: {
  //       currency: 'usd',
  //       product_data: { name: item.name },
  //       unit_amount: Math.round(item.price * 100),
  //     },
  //     quantity: item.quantity,
  //   })),
  //   mode: 'payment',
  //   success_url: `${process.env.NEXTAUTH_URL}/cart?success=true`,
  //   cancel_url: `${process.env.NEXTAUTH_URL}/cart?canceled=true`,
  // });
  // return NextResponse.json({ url: session.url });

  const total = verifiedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return NextResponse.json({
    message: "Checkout placeholder - configure Stripe keys to enable real payments",
    total,
    url: "/cart?success=true",
  });
}
