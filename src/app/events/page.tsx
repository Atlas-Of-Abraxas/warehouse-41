import { prisma, dbQuery } from "@/lib/db";
import { formatDate, formatTime, formatPrice, EVENT_TYPES } from "@/lib/utils";
import { Calendar, Users, Clock, DollarSign } from "lucide-react";
import { DbWarningBanner } from "@/components/layout/DbWarningBanner";

export const dynamic = "force-dynamic";

// Static upcoming events from physical fliers (until admin image uploads exist).
const FLIER_EVENTS = [
  {
    image: "/events/warhammer-wednesday.jpg",
    eyebrow: "Kill Team",
    type: "KILL_TEAM",
    title: "Warhammer Wednesday",
    sortDate: "2026-05-27",
    dateLabel: "Every Wednesday · all day",
    price: "$10 entry",
    blurb: "All-day Kill Team play with rental teams (5+ to choose from) and multiple terrain boards.",
  },
  {
    image: "/events/first-strike-monday.png",
    eyebrow: "Kill Team",
    type: "KILL_TEAM",
    title: "First Strike Monday",
    sortDate: "2026-06-01",
    dateLabel: "1st & 3rd Mondays · 3:30–10 PM",
    price: null,
    blurb: "Kill Team combat zones — deploy, fight, and climb the standings. Doors 3:30 PM, last round 10 PM.",
  },
  {
    image: "/events/fling.png",
    eyebrow: "Performance",
    type: "CASUAL",
    title: "Fling",
    sortDate: "2026-06-07",
    dateLabel: "Sun, June 7 · 7 PM",
    price: "$5",
    blurb: "Low stakes, high focus, any genre — 5 minutes max. An open performance night with a supportive audience. Featuring Teddy, Shiner, Krow & Jeffrey Campbell.",
  },
] as const;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const where: Record<string, unknown> = { date: { gte: new Date() } };
  if (params.type) where.type = params.type;

  const eventsResult = await dbQuery(() =>
    prisma.event.findMany({
      where,
      orderBy: { date: "asc" },
    })
  );
  const events = eventsResult.ok ? eventsResult.data : [];

  const eventTypes = Object.entries(EVENT_TYPES).filter(([key]) => key === "KILL_TEAM");

  const flierEvents = FLIER_EVENTS.filter(
    (f) => !params.type || f.type === params.type
  ).sort((a, b) => a.sortDate.localeCompare(b.sortDate));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {!eventsResult.ok && <DbWarningBanner />}
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">Events Calendar</h1>
      <p className="text-[var(--color-text-secondary)] mb-8">
        Tournaments, leagues, casual nights, and special events.
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <a
          href="/events"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !params.type
              ? "bg-[var(--color-accent)] text-white"
              : "bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]"
          }`}
        >
          All Events
        </a>
        {eventTypes.map(([key, label]) => (
          <a
            key={key}
            href={`/events?type=${key}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              params.type === key
                ? "bg-[var(--color-accent)] text-white"
                : "bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]"
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Flier posters */}
      {flierEvents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {flierEvents.map((f) => (
            <article
              key={f.title}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden flex flex-col"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.image} alt={f.title} loading="lazy" className="w-full h-auto" />
              <div className="p-5 flex flex-col gap-2">
                <p className="eyebrow">{f.eyebrow}</p>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-text-primary)] leading-tight">
                  {f.title}
                </h3>
                <p className="text-sm text-[var(--color-accent)]">{f.dateLabel}</p>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{f.blurb}</p>
                {f.price && <p className="text-sm text-[var(--color-text-primary)]">{f.price}</p>}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Empty state */}
      {events.length === 0 && flierEvents.length === 0 && (
        <div className="text-center py-16 text-[var(--color-text-secondary)]">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No upcoming events found.</p>
          {params.type && (
            <a href="/events" className="text-[var(--color-accent)] hover:underline mt-2 inline-block">
              View all events
            </a>
          )}
        </div>
      )}

      {/* Database events */}
      {events.length > 0 && (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6 flex flex-col md:flex-row md:items-center gap-4"
            >
              {/* Date badge */}
              <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 text-center min-w-[80px]">
                <div className="text-2xl font-bold text-[var(--color-accent)]">
                  {new Date(event.date).getDate()}
                </div>
                <div className="text-xs text-[var(--color-text-secondary)] uppercase">
                  {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                </div>
              </div>

              {/* Event Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-0.5 rounded">
                    {EVENT_TYPES[event.type] || event.type}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  {event.description}
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-[var(--color-text-secondary)]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {formatTime(event.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {event.registered}/{event.capacity} registered
                  </span>
                  {event.price > 0 && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" /> {formatPrice(event.price)} entry
                    </span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="md:text-right">
                {event.registered < event.capacity ? (
                  <span className="text-sm text-green-400">
                    {event.capacity - event.registered} spots left
                  </span>
                ) : (
                  <span className="text-sm text-[var(--color-accent)]">Full</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
