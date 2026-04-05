import { prisma, dbQuery } from "@/lib/db";
import { formatDate, formatTime, formatPrice, EVENT_TYPES } from "@/lib/utils";
import { Calendar, Users, Clock, DollarSign } from "lucide-react";
import { DbWarningBanner } from "@/components/layout/DbWarningBanner";

export const dynamic = "force-dynamic";

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

  const eventTypes = Object.entries(EVENT_TYPES);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {!eventsResult.ok && <DbWarningBanner />}
      <h1 className="text-4xl font-bold mb-2">Events Calendar</h1>
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

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-16 text-[var(--color-text-secondary)]">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No upcoming events found.</p>
          {params.type && (
            <a href="/events" className="text-[var(--color-accent)] hover:underline mt-2 inline-block">
              View all events
            </a>
          )}
        </div>
      ) : (
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
