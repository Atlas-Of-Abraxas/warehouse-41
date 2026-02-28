import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice, formatDate, EVENT_TYPES } from "@/lib/utils";
import { Calendar, Crosshair, ShoppingBag, Users, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, upcomingEvents] = await Promise.all([
    prisma.product.findMany({ where: { featured: true }, take: 4 }),
    prisma.event.findMany({ where: { date: { gte: new Date() } }, orderBy: { date: "asc" }, take: 3 }),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg-primary)] py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-[var(--color-accent)]">Warehouse</span>{" "}
            <span className="text-[var(--color-gold)]">41</span>
          </h1>
          <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
            Your local game store and playspace. Cards, miniatures, RPGs, and the
            community to enjoy them with.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse the Shop
            </Link>
            <Link
              href="/events"
              className="border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-bg-primary)] px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View Events
            </Link>
            <Link
              href="/killteam#book"
              className="border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)] px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Book a Table
            </Link>
          </div>
        </div>

        {/* Feature icons */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: ShoppingBag, label: "MTG & Kill Team" },
            { icon: Calendar, label: "Weekly Events" },
            { icon: Crosshair, label: "Table Booking" },
            { icon: Users, label: "Community" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-[var(--color-text-secondary)]">
              <Icon className="w-8 h-8 text-[var(--color-gold)]" />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link href="/shop" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg overflow-hidden hover:border-[var(--color-accent)] transition-colors group"
            >
              <div className="aspect-square bg-[var(--color-bg-secondary)] flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-[var(--color-text-secondary)] opacity-30" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold group-hover:text-[var(--color-accent)] transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-[var(--color-gold)] font-bold mt-2">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-[var(--color-bg-secondary)] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Link href="/events" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] flex items-center gap-1">
              All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6"
              >
                <span className="text-xs font-medium text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-1 rounded">
                  {EVENT_TYPES[event.type] || event.type}
                </span>
                <h3 className="font-semibold text-lg mt-3">{event.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  {event.description}
                </p>
                <div className="flex items-center gap-2 mt-4 text-sm text-[var(--color-text-secondary)]">
                  <Calendar className="w-4 h-4" />
                  {formatDate(event.date)}
                </div>
                {event.price > 0 && (
                  <p className="text-[var(--color-gold)] font-semibold mt-2">
                    {formatPrice(event.price)} entry
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
