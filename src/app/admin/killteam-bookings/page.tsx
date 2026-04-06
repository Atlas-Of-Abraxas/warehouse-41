import { prisma, dbQuery } from "@/lib/db";
import { DbWarningBanner } from "@/components/layout/DbWarningBanner";
import KillTeamBookingsClient from "./KillTeamBookingsClient";

export const dynamic = "force-dynamic";

function teamsLabel(teamsJson: string): string {
  try {
    const t = JSON.parse(teamsJson) as unknown;
    if (Array.isArray(t)) return t.join(", ");
    if (typeof t === "string") return t;
    return String(t);
  } catch {
    return teamsJson;
  }
}

export default async function AdminKillTeamBookingsPage() {
  const bookingsResult = await dbQuery(() =>
    prisma.killTeamBooking.findMany({
      orderBy: { date: "asc" },
    })
  );
  const bookings = bookingsResult.ok ? bookingsResult.data : [];

  const initial = bookings.map((b) => ({
    id: b.id,
    date: b.date.toISOString(),
    timeSlot: b.timeSlot,
    terrain: b.terrain,
    teamsLabel: teamsLabel(b.teams),
    customerName: b.customerName,
    customerEmail: b.customerEmail,
    status: b.status,
    paidInStore: b.paidInStore,
    notes: b.notes ?? null,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {!bookingsResult.ok && <DbWarningBanner />}
      <h1 className="text-3xl font-bold mb-2">Kill Team Bookings</h1>
      <p className="text-[var(--color-text-secondary)] mb-8 text-sm">
        Filter by status or date; update status, paid in store, or notes and Save.
      </p>

      {bookings.length === 0 ? (
        <p className="text-[var(--color-text-secondary)]">No Kill Team bookings yet.</p>
      ) : (
        <KillTeamBookingsClient initial={initial} />
      )}
    </div>
  );
}
