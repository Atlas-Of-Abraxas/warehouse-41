import { prisma } from "@/lib/db";
import { formatPrice, formatDate, formatTime, GAME_SYSTEMS } from "@/lib/utils";
import { Calendar, Users, Clock, Sword } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ system?: string }>;
}) {
  const params = await searchParams;
  const where: Record<string, unknown> = { date: { gte: new Date() } };
  if (params.system) where.gameSystem = params.system;

  const sessions = await prisma.session.findMany({
    where,
    orderBy: { date: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2">Book a Session</h1>
      <p className="text-[var(--color-text-secondary)] mb-8">
        Book a seat for MTG Legacy, Commander, World of Darkness, D&amp;D, and more.
      </p>

      {/* System Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <a
          href="/booking"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !params.system
              ? "bg-[var(--color-accent)] text-white"
              : "bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]"
          }`}
        >
          All Systems
        </a>
        {Object.entries(GAME_SYSTEMS).map(([key, label]) => (
          <a
            key={key}
            href={`/booking?system=${key}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              params.system === key
                ? "bg-[var(--color-accent)] text-white"
                : "bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]"
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Session Cards */}
      {sessions.length === 0 ? (
        <div className="text-center py-16 text-[var(--color-text-secondary)]">
          <Sword className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No upcoming sessions found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map((session) => {
            const spotsLeft = session.maxPlayers - session.currentPlayers;
            return (
              <Link
                key={session.id}
                href={`/booking/${session.id}`}
                className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6 hover:border-[var(--color-accent)] transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-[var(--color-gold)] bg-[var(--color-gold)]/10 px-2 py-0.5 rounded">
                    {GAME_SYSTEMS[session.gameSystem] || session.gameSystem}
                  </span>
                  {spotsLeft <= 0 && (
                    <span className="text-xs font-medium text-red-400 bg-red-400/10 px-2 py-0.5 rounded">
                      Full
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold">{session.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  GM: {session.gmName}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] mt-2 line-clamp-2">
                  {session.description}
                </p>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-[var(--color-text-secondary)]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {formatDate(session.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {formatTime(session.date)} ({session.duration / 60}h)
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {session.currentPlayers}/{session.maxPlayers}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[var(--color-gold)] font-bold">
                    {formatPrice(session.price)}/seat
                  </span>
                  {spotsLeft > 0 && (
                    <span className="text-sm text-green-400">{spotsLeft} spots left</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
