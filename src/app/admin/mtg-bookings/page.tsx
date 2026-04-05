import { prisma, dbQuery } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { TIME_SLOT_LABELS } from "@/lib/mtg";
import { DbWarningBanner } from "@/components/layout/DbWarningBanner";

export const dynamic = "force-dynamic";

export default async function AdminMTGBookingsPage() {
  const bookingsResult = await dbQuery(() =>
    prisma.mTGBooking.findMany({
      orderBy: { date: "asc" },
    })
  );
  const bookings = bookingsResult.ok ? bookingsResult.data : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {!bookingsResult.ok && <DbWarningBanner />}
      <h1 className="text-3xl font-bold mb-8">MTG Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-[var(--color-text-secondary)]">No MTG bookings yet.</p>
      ) : (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left p-4 text-[var(--color-text-secondary)]">Date</th>
                <th className="text-left p-4 text-[var(--color-text-secondary)]">Time Slot</th>
                <th className="text-left p-4 text-[var(--color-text-secondary)]">Table</th>
                <th className="text-left p-4 text-[var(--color-text-secondary)]">Format</th>
                <th className="text-left p-4 text-[var(--color-text-secondary)]">Customer</th>
                <th className="text-left p-4 text-[var(--color-text-secondary)]">Email</th>
                <th className="text-left p-4 text-[var(--color-text-secondary)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="p-4">{formatDate(b.date)}</td>
                  <td className="p-4">{TIME_SLOT_LABELS[b.timeSlot] ?? b.timeSlot}</td>
                  <td className="p-4">{b.table ?? "—"}</td>
                  <td className="p-4">{b.format ?? "—"}</td>
                  <td className="p-4">
                    {b.afterHours ? (
                      <span className="text-xs px-2 py-1 rounded bg-[var(--color-gold)]/10 text-[var(--color-gold)]">Yes</span>
                    ) : (
                      <span className="text-xs text-[var(--color-text-secondary)]">No</span>
                    )}
                  </td>
                  <td className="p-4 font-medium">{b.customerName}</td>
                  <td className="p-4 text-[var(--color-text-secondary)]">{b.customerEmail}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      b.status === "confirmed"
                        ? "bg-green-400/10 text-green-400"
                        : b.status === "cancelled"
                        ? "bg-red-400/10 text-red-400"
                        : "bg-yellow-400/10 text-yellow-400"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
