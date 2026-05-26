import { prisma, dbQuery } from "@/lib/db";
import { formatDate, formatTime } from "@/lib/utils";
import { KILL_TEAMS, TERRAIN_SETS, DAY_NAMES, TIME_SLOT_LABELS } from "@/lib/killteam";
import { Calendar, Clock, Users, Crosshair, Ruler, Dices, Layers, Box, Target } from "lucide-react";
import KillTeamBookingForm from "./KillTeamBookingForm";
import { DbWarningBanner } from "@/components/layout/DbWarningBanner";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function KillTeamPage() {
  const ktResult = await dbQuery(() =>
    prisma.event.findMany({
      where: { type: "KILL_TEAM", date: { gte: new Date() } },
      orderBy: { date: "asc" },
      take: 4,
    })
  );
  const ktEvents = ktResult.ok ? ktResult.data : [];

  return (
    <div>
      {!ktResult.ok && (
        <div className="max-w-6xl mx-auto px-6 pt-6">
          <DbWarningBanner />
        </div>
      )}

      {/* ----------------------- HERO ----------------------- */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gallery/rooftop-gantry.jpg"
          alt="Painted Sector Imperialis terrain on a Warehouse 41 table"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--color-bg-primary) 4%, rgba(14,11,10,0.82) 45%, rgba(14,11,10,0.55) 100%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-32">
          <p className="eyebrow">Warhammer 40,000 · Kill Team</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-6xl text-[var(--color-text-primary)] max-w-3xl leading-[1.05]">
            Kill Team at Warehouse 41
          </h1>
          <p className="mt-6 text-lg text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            Fast-paced Warhammer 40K skirmish combat. Pick a team, choose your terrain, and fight
            for glory in the 41st millennium.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="#book" variant="solid">Book a table</ButtonLink>
            <ButtonLink href="/events?type=KILL_TEAM" variant="primary">View events</ButtonLink>
          </div>
        </div>
      </section>

      {/* ----------------------- KILL TEAMS IN STOCK ----------------------- */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
        <SectionHeader eyebrow="Borrow & play" title="House library" />
        <p className="mt-6 text-[var(--color-text-secondary)] max-w-2xl">
          Bring your own specialists, or borrow from our expanding library.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {KILL_TEAMS.map((kt) => (
            <article
              key={kt.team}
              className="group relative rounded-md overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors bg-[var(--color-bg-card)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-bg-elevated)]">
                {kt.image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={kt.image}
                      alt={`${kt.team} — ${kt.faction}`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(14,11,10,0.92) 0%, rgba(14,11,10,0.25) 45%, transparent 70%)",
                      }}
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[var(--color-text-muted)]">
                    <Crosshair className="w-8 h-8 text-[var(--color-accent)] opacity-60" />
                    <span className="text-xs uppercase tracking-[0.18em]">Photo coming</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="eyebrow">{kt.faction}</p>
                  <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--color-text-primary)] leading-tight">
                    {kt.team}
                  </h3>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="rule-brass max-w-6xl mx-auto" />

      {/* ----------------------- AVAILABLE TERRAIN ----------------------- */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
        <SectionHeader eyebrow="The battlefield" title="Available terrain" />
        <div className="mt-12 space-y-6">
          {TERRAIN_SETS.map((t) => (
            <div
              key={t.name}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 md:p-8"
            >
              <p className="eyebrow">Terrain set</p>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--color-text-primary)]">
                {t.name}
              </h3>
              <p className="mt-3 text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
                {t.description}
              </p>
              {t.images.length > 0 && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {t.images.map((src) => (
                    <div
                      key={src}
                      className="relative overflow-hidden rounded-sm border border-[var(--color-border)] aspect-[16/10]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`${t.name} terrain at Warehouse 41`}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="rule-brass max-w-6xl mx-auto" />

      {/* ----------------------- WEEKLY SCHEDULE ----------------------- */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
        <SectionHeader eyebrow="When to play" title="Weekly schedule" />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {DAY_NAMES.map((day) => (
            <div
              key={day}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5"
            >
              <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-text-primary)] mb-4">
                {day}
              </h3>
              <div className="space-y-2">
                {Object.entries(TIME_SLOT_LABELS).map(([slot, label]) => (
                  <div
                    key={slot}
                    className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2"
                  >
                    <Clock className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] mt-5">
          Each block is a 4-hour table rental. Book below to reserve your terrain.
        </p>
        <p className="text-sm text-[var(--color-accent)] mt-2 font-medium">
          Table cost: $10 when you bring your own terrain and Kill Team.
        </p>
      </section>

      <div className="rule-brass max-w-6xl mx-auto" />

      {/* ----------------------- COMMAND STATION ----------------------- */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
        <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-[var(--color-text-primary)]">
          Included with your rental
        </h2>
        <p className="mt-6 text-[var(--color-text-secondary)] max-w-2xl">
          Every table rental comes with a command station. Accessories included:
        </p>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { icon: Ruler, label: "Rulers" },
            { icon: Dices, label: "Dice" },
            { icon: Layers, label: "Data cards" },
            { icon: Box, label: "Dice trays" },
            { icon: Target, label: "Objective, VP & CP trackers" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 flex flex-col items-center text-center gap-3"
            >
              <Icon className="w-7 h-7 text-[var(--color-accent)]" />
              <span className="text-sm text-[var(--color-text-primary)]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="rule-brass max-w-6xl mx-auto" />

      {/* ----------------------- BOOK A TABLE ----------------------- */}
      <section id="book" className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
        <SectionHeader eyebrow="Reserve" title="Book a table" />
        <div className="mt-12 max-w-2xl">
          <KillTeamBookingForm />
        </div>
      </section>

      {/* ----------------------- UPCOMING EVENTS ----------------------- */}
      {ktEvents.length > 0 && (
        <>
          <div className="rule-brass max-w-6xl mx-auto" />
          <section className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
            <SectionHeader
              eyebrow="On the calendar"
              title="Upcoming Kill Team events"
              link={{ href: "/events?type=KILL_TEAM", label: "View all" }}
            />
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
              {ktEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6"
                >
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-text-primary)]">
                    {event.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">{event.description}</p>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[var(--color-accent)]" /> {formatDate(event.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[var(--color-accent)]" /> {formatTime(event.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[var(--color-accent)]" /> {event.registered}/{event.capacity} registered
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ----------------------- CTA ----------------------- */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-24">
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-10 md:p-14 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-text-primary)]">
            Ready to play?
          </h2>
          <p className="mt-4 text-[var(--color-text-secondary)] max-w-lg mx-auto">
            Drop in for open play, sign up for an event, or book a table. New players welcome —
            we&apos;ll teach you the ropes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/events?type=KILL_TEAM" variant="solid">View events</ButtonLink>
            <ButtonLink href="#book" variant="primary">Book a table</ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
