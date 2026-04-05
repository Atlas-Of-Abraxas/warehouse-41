import { prisma, dbQuery } from "@/lib/db";
import { formatPrice, formatDate, formatTime, GAME_SYSTEMS } from "@/lib/utils";
import { Calendar, Clock, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookingForm from "./BookingForm";
import { DbWarningBanner } from "@/components/layout/DbWarningBanner";

export const dynamic = "force-dynamic";

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sessionResult = await dbQuery(() =>
    prisma.session.findUnique({ where: { id } })
  );

  if (!sessionResult.ok) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <DbWarningBanner />
        <p className="text-[var(--color-text-secondary)] mt-6">
          Session details could not be loaded.
        </p>
        <Link href="/booking" className="text-[var(--color-accent)] mt-4 inline-block">
          Back to Sessions
        </Link>
      </div>
    );
  }

  const session = sessionResult.data;
  if (!session) notFound();

  const spotsLeft = session.maxPlayers - session.currentPlayers;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/booking"
        className="inline-flex items-center gap-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Sessions
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Session Details */}
        <div className="md:col-span-2">
          <span className="text-sm font-medium text-[var(--color-gold)] bg-[var(--color-gold)]/10 px-2 py-1 rounded">
            {GAME_SYSTEMS[session.gameSystem] || session.gameSystem}
          </span>
          <h1 className="text-3xl font-bold mt-3">{session.title}</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            GM: {session.gmName}
          </p>

          <div className="flex flex-wrap gap-4 mt-6 text-sm text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> {formatDate(session.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {formatTime(session.date)} ({session.duration / 60}h)
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" /> {session.currentPlayers}/{session.maxPlayers} players
            </span>
          </div>

          <p className="text-[var(--color-text-secondary)] mt-6 leading-relaxed">
            {session.description}
          </p>

          <div className="mt-6 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Price per seat</span>
              <span className="text-xl font-bold text-[var(--color-gold)]">
                {formatPrice(session.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div>
          <BookingForm
            sessionId={session.id}
            price={session.price}
            spotsLeft={spotsLeft}
          />
        </div>
      </div>
    </div>
  );
}
