import { prisma } from "@/lib/db";
import { validateOrder } from "@/lib/validate";
import { queueOrderConfirmation } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

/**
 * Public order creation for in-store pickup. Payment is handled in store for now
 * (status "pending"). Prices and stock are read server-side from the database —
 * the client-supplied amounts are never trusted.
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const validation = validateOrder(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const customerName = (body.customerName as string).trim();
  const customerEmail = (body.customerEmail as string).trim();
  const notes = typeof body.notes === "string" ? body.notes.trim() : null;
  const reqItems = body.items as { id: string; quantity: number }[];

  // Collapse duplicate product ids into a single quantity.
  const qtyById = new Map<string, number>();
  for (const it of reqItems) {
    qtyById.set(it.id, (qtyById.get(it.id) ?? 0) + it.quantity);
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const ids = [...qtyById.keys()];
      const products = await tx.product.findMany({ where: { id: { in: ids } } });

      if (products.length !== ids.length) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      const lineItems = products.map((p) => {
        const quantity = qtyById.get(p.id)!;
        if (p.stock < quantity) {
          throw new Error(`OUT_OF_STOCK:${p.name}`);
        }
        return { product: p, quantity, price: p.price };
      });

      const total = lineItems.reduce((sum, li) => sum + li.price * li.quantity, 0);

      const order = await tx.order.create({
        data: {
          customerName,
          customerEmail,
          total,
          status: "pending",
          notes,
          items: {
            create: lineItems.map((li) => ({
              productId: li.product.id,
              quantity: li.quantity,
              price: li.price,
            })),
          },
        },
      });

      for (const li of lineItems) {
        await tx.product.update({
          where: { id: li.product.id },
          data: { stock: { decrement: li.quantity } },
        });
      }

      return { order, lineItems, total };
    });

    queueOrderConfirmation({
      to: customerEmail,
      customerName,
      orderId: result.order.id,
      total: result.total,
      items: result.lineItems.map((li) => ({
        name: li.product.name,
        quantity: li.quantity,
        price: li.price,
      })),
    });

    return NextResponse.json(
      { id: result.order.id, total: result.total, status: result.order.status },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Error && err.message === "PRODUCT_NOT_FOUND") {
      return NextResponse.json(
        { error: "One or more items are no longer available. Please refresh your cart." },
        { status: 409 }
      );
    }
    if (err instanceof Error && err.message.startsWith("OUT_OF_STOCK:")) {
      const name = err.message.slice("OUT_OF_STOCK:".length);
      return NextResponse.json(
        { error: `Not enough stock for "${name}". Please adjust your cart.` },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Order failed" }, { status: 500 });
  }
}
