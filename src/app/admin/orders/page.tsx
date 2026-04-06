import { prisma, dbQuery } from "@/lib/db";
import { DbWarningBanner } from "@/components/layout/DbWarningBanner";
import OrdersTable, { type OrderAdminRow } from "./OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const result = await dbQuery(() =>
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { product: { select: { name: true } } } },
      },
    })
  );

  const initial: OrderAdminRow[] = result.ok
    ? result.data.map((o) => ({
        id: o.id,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        total: o.total,
        status: o.status,
        posReference: o.posReference ?? null,
        notes: o.notes ?? null,
        stripePaymentId: o.stripePaymentId ?? null,
        createdAt: o.createdAt.toISOString(),
        items: o.items.map((i) => ({
          id: i.id,
          quantity: i.quantity,
          price: i.price,
          product: { name: i.product.name },
        })),
      }))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {!result.ok && <DbWarningBanner />}
      <h1 className="text-3xl font-bold mb-2">Orders (POS / manual)</h1>
      <p className="text-[var(--color-text-secondary)] mb-8 max-w-2xl">
        Track in-store and external sales. Payment is handled outside this site; use status and POS
        reference to match your terminal or inventory workflow.
      </p>
      <OrdersTable initial={initial} />
    </div>
  );
}
