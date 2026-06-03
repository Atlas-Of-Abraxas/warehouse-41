import { prisma, dbQuery } from "@/lib/db";
import { formatTime, formatPrice, EVENT_TYPES } from "@/lib/utils";
import { Calendar, Users, Clock, DollarSign } from "lucide-react";
import { DbWarningBanner } from "@/components/layout/DbWarningBanner";

export const dynamic = "force-dynamic";

// June 2026 monthly calendar, parsed from the printed schedule.
type CalEvent = { day: number; type: string; title: string; sub?: string };

const JUNE_2026: CalEvent[] = [
  { day: 1, type: "KILL_TEAM", title: "First Strike Day", sub: "Kill Team" },
  { day: 2, type: "MTG_TOURNAMENT", title: "EDH Turbo", sub: "Tournament / open play" },
  { day: 3, type: "KILL_TEAM", title: "Warhammer Wednesday", sub: "All-day Kill Team · $10 entry" },
  { day: 4, type: "CASUAL", title: "Open Play: Magic" },
  { day: 5, type: "CASUAL", title: "Open Play: Magic" },
  { day: 6, type: "CASUAL", title: "Open Play: Magic" },
  { day: 7, type: "DND_NIGHT", title: "D&D / Beyond the Tabletop" },
  { day: 7, type: "CASUAL", title: "Fling", sub: "Open performance night · 7 PM · $5" },
  { day: 8, type: "KILL_TEAM", title: "First Strike Day", sub: "Kill Team" },
  { day: 9, type: "CASUAL", title: "Open Play: Magic" },
  { day: 10, type: "KILL_TEAM", title: "Warhammer Wednesday", sub: "All-day Kill Team · $10 entry" },
  { day: 11, type: "CASUAL", title: "Open Play: Magic" },
  { day: 12, type: "CASUAL", title: "Open Play: Magic" },
  { day: 13, type: "MTG_TOURNAMENT", title: "Magic Fight Night" },
  { day: 14, type: "DND_NIGHT", title: "D&D / Beyond the Tabletop" },
  { day: 15, type: "KILL_TEAM", title: "First Strike Day", sub: "Kill Team" },
  { day: 16, type: "MTG_TOURNAMENT", title: "EDH Turbo", sub: "Tournament / open play" },
  { day: 17, type: "KILL_TEAM", title: "Warhammer Wednesday", sub: "All-day Kill Team · $10 entry" },
  { day: 18, type: "CASUAL", title: "Open Play: Magic" },
  { day: 19, type: "CASUAL", title: "Open Play: Magic" },
  { day: 20, type: "CASUAL", title: "Open Play: Magic" },
  { day: 21, type: "DND_NIGHT", title: "D&D / Beyond the Tabletop" },
  { day: 22, type: "KILL_TEAM", title: "First Strike Day", sub: "Kill Team" },
  { day: 23, type: "CASUAL", title: "Open Play: Magic" },
  { day: 24, type: "KILL_TEAM", title: "Warhammer Wednesday", sub: "All-day Kill Team · $10 entry" },
  { day: 25, type: "CASUAL", title: "Open Play: Magic" },
  { day: 26, type: "CASUAL", title: "Open Play: Magic" },
  { day: 27, type: "MTG_TOURNAMENT", title: "Magic Fight Night" },
  { day: 28, type: "DND_NIGHT", title: "D&D / Beyond the Tabletop" },
  { day: 29, type: "KILL_TEAM", title: "First Strike Day", sub: "Kill Team" },
  { day: 30, type: "MTG_TOURNAMENT", title: "EDH Turbo", sub: "Tournament / open play" },
];

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

  const calendar = JUNE_2026.filter((e) => !params.type || e.type === params.type);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {!eventsResult.ok && <DbWarningBanner />}
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">Events Calendar</h1>
      <p className="text-[var(--color-text-secondary)] mb-8">
        June 2026 — Kill Team, Magic, EDH, D&amp;D, and open play. Open daily 11 AM – 11 PM.
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

      {/* June 2026 schedule */}
      {calendar.length > 0 && (
        <div className="mb-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] divide-y divide-[var(--color-border)]">
          {calendar.map((e, i) => {
            const date = new Date(2026, 5, e.day);
            return (
              <div key={`${e.day}-${i}`} className="flex items-center gap-4 p-4">
                <div className="bg-[var(--color-bg-secondary)] rounded-lg px-3 py-2 text-center min-w-[64px]">
                  <div className="text-[10px] tracking-[0.18em] text-[var(--color-text-muted)] uppercase">
                    {WEEKDAY[date.getDay()]}
                  </div>
                  <div className="text-xl font-bold text-[var(--color-accent)] leading-none mt-0.5">
                    {e.day}
                  </div>
                  <div className="text-[10px] text-[var(--color-text-muted)] uppercase">Jun</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)]">
                      {e.title}
                    </h3>
                    <span className="text-xs font-medium text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-0.5 rounded">
                      {EVENT_TYPES[e.type] || e.type}
                    </span>
                  </div>
                  {e.sub && (
                    <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">{e.sub}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {events.length === 0 && calendar.length === 0 && (
        <div className="text-center py-16 text-[var(--color-text-secondary)]">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No events match this filter.</p>
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
