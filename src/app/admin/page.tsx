import { prisma, dbQuery } from "@/lib/db";
import { Calendar, Crosshair, Sparkles, Receipt, Dices } from "lucide-react";
import Link from "next/link";
import { DbWarningBanner } from "@/components/layout/DbWarningBanner";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const dashboardResult = await dbQuery(() =>
    Promise.all([
      prisma.order.count(),
      prisma.event.count(),
      prisma.killTeamBooking.count(),
      prisma.mTGBooking.count(),
      prisma.openPlayBooking.count(),
    ])
  );

  let orderCount = 0;
  let eventCount = 0;
  let ktBookingCount = 0;
  let mtgBookingCount = 0;
  let openPlayBookingCount = 0;

  if (dashboardResult.ok) {
    [orderCount, eventCount, ktBookingCount, mtgBookingCount, openPlayBookingCount] =
      dashboardResult.data;
  }

  const stats = [
    { label: "Orders", count: orderCount, icon: Receipt, href: "/admin/orders" },
    { label: "Events", count: eventCount, icon: Calendar, href: "/admin/events" },
    { label: "KT Bookings", count: ktBookingCount, icon: Crosshair, href: "/admin/killteam-bookings" },
    { label: "MTG Bookings", count: mtgBookingCount, icon: Sparkles, href: "/admin/mtg-bookings" },
    { label: "Open Play", count: openPlayBookingCount, icon: Dices, href: "/admin/open-play-bookings" },
  ];

  return (
    <div>
      {!dashboardResult.ok && <DbWarningBanner />}
      <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-[var(--color-text-secondary)] mb-8">
        Manage events and table bookings. Product inventory lives in the database for when
        you enable the shop—open{" "}
        <Link href="/admin/products" className="text-[var(--color-accent)] hover:underline">
          /admin/products
        </Link>{" "}
        when you are ready to catalogue.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {stats.map(({ label, count, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6 hover:border-[var(--color-accent)] transition-colors"
          >
            <Icon className="w-8 h-8 text-[var(--color-accent)] mb-2" />
            <div className="text-3xl font-bold">{count}</div>
            <div className="text-sm text-[var(--color-text-secondary)]">{label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
      <div className="flex flex-wrap gap-3 mb-12">
        <Link
          href="/admin/events?action=new"
          className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + New Event
        </Link>
      </div>
    </div>
  );
}
