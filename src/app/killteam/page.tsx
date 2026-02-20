import { prisma } from "@/lib/db";
import { formatDate, formatTime } from "@/lib/utils";
import { KILL_TEAMS, TERRAIN_SETS, DAY_NAMES, TIME_SLOT_LABELS } from "@/lib/killteam";
import { Calendar, Clock, Users, Crosshair, Mountain, Swords } from "lucide-react";
import Link from "next/link";
import KillTeamBookingForm from "./KillTeamBookingForm";

export const dynamic = "force-dynamic";

export default async function KillTeamPage() {
  const ktEvents = await prisma.event.findMany({
    where: { type: "KILL_TEAM", date: { gte: new Date() } },
    orderBy: { date: "asc" },
    take: 4,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crosshair className="w-10 h-10 text-[var(--color-accent)]" />
          <h1 className="text-5xl font-bold">
            <span className="text-[var(--color-accent)]">Kill Team</span>{" "}
            <span className="text-[var(--color-gold)]">at Warehouse 41</span>
          </h1>
        </div>
        <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          Fast-paced Warhammer 40K skirmish combat. Pick a team, choose your terrain,
          and fight for glory in the 41st millennium.
        </p>
      </div>

      {/* Kill Teams In Stock */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Swords className="w-6 h-6 text-[var(--color-gold)]" />
          <h2 className="text-3xl font-bold">Kill Teams In Stock</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {KILL_TEAMS.map((kt) => (
            <div
              key={kt.team}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-4 flex items-center gap-3"
            >
              <Crosshair className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
              <div>
                <span className="font-semibold">{kt.team}</span>
                <span className="text-sm text-[var(--color-text-secondary)] ml-2">({kt.faction})</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] mt-3">
          9 kill teams available for in-store games. Bring your own or borrow one of ours.
        </p>
      </section>

      {/* Available Terrain */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Mountain className="w-6 h-6 text-[var(--color-gold)]" />
          <h2 className="text-3xl font-bold">Available Terrain</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TERRAIN_SETS.map((t) => (
            <div
              key={t.name}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-5"
            >
              <h3 className="font-bold text-lg text-[var(--color-accent)]">{t.name}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2">{t.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Weekly Schedule */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-6 h-6 text-[var(--color-gold)]" />
          <h2 className="text-3xl font-bold">Weekly Schedule</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DAY_NAMES.map((day) => (
            <div
              key={day}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-5"
            >
              <h3 className="font-bold text-lg mb-3">{day}</h3>
              <div className="space-y-2">
                {Object.entries(TIME_SLOT_LABELS).map(([slot, label]) => (
                  <div
                    key={slot}
                    className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] mt-3">
          Each block is a 4-hour table rental. Book below to reserve your terrain.
        </p>
      </section>

      {/* Book a Table */}
      <section id="book" className="mb-16 max-w-2xl mx-auto">
        <KillTeamBookingForm />
      </section>

      {/* Upcoming Kill Team Events from DB */}
      {ktEvents.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[var(--color-gold)]" />
              <h2 className="text-3xl font-bold">Upcoming Kill Team Events</h2>
            </div>
            <Link href="/events?type=KILL_TEAM" className="text-[var(--color-accent)] hover:underline text-sm">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ktEvents.map((event) => (
              <div
                key={event.id}
                className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">{event.description}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-[var(--color-text-secondary)]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {formatDate(event.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {formatTime(event.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {event.registered}/{event.capacity} registered
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="text-center bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-10">
        <h2 className="text-2xl font-bold mb-3">Ready to Play?</h2>
        <p className="text-[var(--color-text-secondary)] mb-6 max-w-lg mx-auto">
          Drop in for open play, sign up for an event, or book a table.
          New players welcome &mdash; we&apos;ll teach you the ropes.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/shop?category=KILL_TEAM"
            className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Shop Kill Team
          </Link>
          <Link
            href="/events?type=KILL_TEAM"
            className="border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            View Events
          </Link>
          <a
            href="#book"
            className="border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-bg-primary)] px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Book a Table
          </a>
        </div>
      </section>
    </div>
  );
}
