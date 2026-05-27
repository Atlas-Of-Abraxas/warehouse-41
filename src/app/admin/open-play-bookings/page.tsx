import { prisma, dbQuery } from "@/lib/db";
import { DbWarningBanner } from "@/components/layout/DbWarningBanner";
import OpenPlayBookingsClient from "./OpenPlayBookingsClient";

export const dynamic = "force-dynamic";

export default async function AdminOpenPlayBookingsPage() {
  const bookingsResult = await dbQuery(() =>
    prisma.openPlayBooking.findMany({
      orderBy: { date: "asc" },
    })
  );
  const bookings = bookingsResult.ok ? bookingsResult.data : [];

  const initial = bookings.map((b) => ({
    id: b.id,
    date: b.date.toISOString(),
    timeSlot: b.timeSlot,
    customerName: b.customerName,
    customerEmail: b.customerEmail,
    status: b.status,
    paidInStore: b.paidInStore,
    notes: b.notes ?? null,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {!bookingsResult.ok && <DbWarningBanner />}
      <h1 className="text-3xl font-bold mb-2">Open Play Bookings</h1>
      <p className="text-[var(--color-text-secondary)] mb-8 text-sm">
        Filter by status or date; update status, paid in store, or notes and Save.
      </p>

      {bookings.length === 0 ? (
        <p className="text-[var(--color-text-secondary)]">No open play bookings yet.</p>
      ) : (
        <OpenPlayBookingsClient initial={initial} />
      )}
    </div>
  );
}
