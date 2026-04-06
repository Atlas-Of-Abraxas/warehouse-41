import { prisma, dbQuery } from "@/lib/db";
import { DbWarningBanner } from "@/components/layout/DbWarningBanner";
import SessionBookingsClient from "./SessionBookingsClient";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookingsResult = await dbQuery(() =>
    prisma.booking.findMany({
      include: { session: true },
      orderBy: { createdAt: "desc" },
    })
  );
  const bookings = bookingsResult.ok ? bookingsResult.data : [];

  const initial = bookings.map((b) => ({
    id: b.id,
    customerName: b.customerName,
    customerEmail: b.customerEmail,
    seats: b.seats,
    status: b.status,
    paymentStatus: b.paymentStatus,
    paidInStore: b.paidInStore,
    notes: b.notes ?? null,
    createdAt: b.createdAt.toISOString(),
    sessionTitle: b.session.title,
    sessionPrice: b.session.price,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {!bookingsResult.ok && <DbWarningBanner />}
      <h1 className="text-3xl font-bold mb-2">Bookings</h1>
      <p className="text-[var(--color-text-secondary)] mb-8 text-sm">
        Filter the list, then edit status, payment, in-store payment, or notes and click Save.
      </p>

      {bookings.length === 0 ? (
        <p className="text-[var(--color-text-secondary)]">No bookings yet.</p>
      ) : (
        <SessionBookingsClient initial={initial} />
      )}
    </div>
  );
}
