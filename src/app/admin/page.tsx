import { prisma } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, Calendar, Sword, ShoppingCart, Users, Crosshair, Sparkles } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, eventCount, sessionCount, bookingCount, ktBookingCount, mtgBookingCount, recentOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.event.count(),
      prisma.session.count(),
      prisma.booking.count(),
      prisma.killTeamBooking.count(),
      prisma.mTGBooking.count(),
      prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { items: true } }),
    ]);

  const stats = [
    { label: "Products", count: productCount, icon: Package, href: "/admin/products" },
    { label: "Events", count: eventCount, icon: Calendar, href: "/admin/events" },
    { label: "Sessions", count: sessionCount, icon: Sword, href: "/admin/sessions" },
    { label: "Bookings", count: bookingCount, icon: Users, href: "/admin/bookings" },
    { label: "KT Bookings", count: ktBookingCount, icon: Crosshair, href: "/admin/killteam-bookings" },
    { label: "MTG Bookings", count: mtgBookingCount, icon: Sparkles, href: "/admin/mtg-bookings" },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-[var(--color-text-secondary)] mb-8">
        Manage your store, events, and sessions.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
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
          href="/admin/products?action=new"
          className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + New Product
        </Link>
        <Link
          href="/admin/events?action=new"
          className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + New Event
        </Link>
        <Link
          href="/admin/sessions?action=new"
          className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + New Session
        </Link>
      </div>

      {/* Recent Orders */}
      <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
      {recentOrders.length === 0 ? (
        <p className="text-[var(--color-text-secondary)]">No orders yet.</p>
      ) : (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left p-4 text-[var(--color-text-secondary)]">Order ID</th>
                <th className="text-left p-4 text-[var(--color-text-secondary)]">Customer</th>
                <th className="text-left p-4 text-[var(--color-text-secondary)]">Total</th>
                <th className="text-left p-4 text-[var(--color-text-secondary)]">Status</th>
                <th className="text-left p-4 text-[var(--color-text-secondary)]">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="p-4 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                  <td className="p-4">{order.customerName}</td>
                  <td className="p-4 text-[var(--color-gold)]">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <span className="text-xs px-2 py-1 rounded bg-[var(--color-bg-secondary)]">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--color-text-secondary)]">
                    {formatDate(order.createdAt)}
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
