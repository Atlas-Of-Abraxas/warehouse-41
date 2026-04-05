import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { session: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-[var(--color-text-secondary)]">No bookings yet.</p>
      ) : (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left p-4 text-[var(--color-text-secondary)]">Customer</th>
                <th className="text-left p-4 text-[var(--color-text-secondary)]">Email</th>
                <th className="text-left p-4 text-[var(--color-text-secondary)]">Session</th>
                <th className="text-left p-4 text-[var(--color-text-secondary)]">Seats</th>
                <th className="text-left p-4 text-[var(--color-text-secondary)]">Total</th>
                <th className="text-left p-4 text-[var(--color-text-secondary)]">Status</th>
                <th className="text-left p-4 text-[var(--color-text-secondary)]">Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="p-4 font-medium">{b.customerName}</td>
                  <td className="p-4 text-[var(--color-text-secondary)]">{b.customerEmail}</td>
                  <td className="p-4">{b.session.title}</td>
                  <td className="p-4">{b.seats}</td>
                  <td className="p-4 text-[var(--color-gold)]">{formatPrice(b.seats * b.session.price)}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      b.paymentStatus === "paid"
                        ? "bg-green-400/10 text-green-400"
                        : b.paymentStatus === "cancelled"
                        ? "bg-red-400/10 text-red-400"
                        : "bg-yellow-400/10 text-yellow-400"
                    }`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--color-text-secondary)]">{formatDate(b.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
