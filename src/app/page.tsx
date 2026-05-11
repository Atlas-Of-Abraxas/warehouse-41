import Link from "next/link";
import { prisma, dbQuery } from "@/lib/db";
import { formatPrice, formatDate, EVENT_TYPES } from "@/lib/utils";
import { Calendar, Crosshair, Sparkles, ArrowRight, Dices } from "lucide-react";
import type { PrismaClient } from "@prisma/generated";
import { DbWarningBanner } from "@/components/layout/DbWarningBanner";

export const dynamic = "force-dynamic";

type EventList = Awaited<ReturnType<PrismaClient["event"]["findMany"]>>;

export default async function HomePage() {
  let upcomingEvents: EventList = [];
  const loaded = await dbQuery(() =>
    prisma.event.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: "asc" },
      take: 3,
    })
  );
  if (loaded.ok) upcomingEvents = loaded.data;

  return (
    <div>
      {!loaded.ok && <DbWarningBanner />}

      {/* ----------------------- HERO ----------------------- */}
      <section className="relative crt-scanlines overflow-hidden">
        {/* Backdrop glow */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,46,136,0.18), transparent 70%), radial-gradient(ellipse 60% 50% at 80% 70%, rgba(0,231,255,0.15), transparent 70%), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(255,179,71,0.12), transparent 70%)",
          }}
        />

        {/* Marquee bar */}
        <div className="border-y border-[var(--color-border-bright)] bg-black/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3 text-xs font-mono tracking-wider uppercase">
            <span className="blink text-[var(--color-neon-pink)]">●</span>
            <span className="text-[var(--color-text-secondary)]">
              Now Playing — Friday Night Magic · Saturday Kill Team Open · Sunday RPG Sessions
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 text-center relative">
          {/* Logo — user-provided PNG dropped into public/logo.png */}
          <div className="flex justify-center mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Warehouse 41"
              className="w-full max-w-3xl h-auto drop-shadow-[0_0_24px_rgba(230,57,70,0.55)]"
            />
          </div>

          <p className="text-lg md:text-2xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 flicker">
            <span className="neon-glow-cyan font-[family-name:var(--font-arcade)] text-base md:text-lg tracking-widest">
              INSERT COIN
            </span>
            <br />
            <span className="mt-3 inline-block">
              Your local game store & playspace. Reserve tables, join events, and play with the community.
            </span>
          </p>

          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <ArcadeButton href="/booking" color="pink">Book a Session</ArcadeButton>
            <ArcadeButton href="/events" color="amber">View Events</ArcadeButton>
            <ArcadeButton href="/killteam#book" color="cyan">Book Kill Team</ArcadeButton>
            <ArcadeButton href="/mtg#book" color="violet">Book MTG Table</ArcadeButton>
          </div>
        </div>
      </section>

      {/* ----------------------- FEATURED GAMES ----------------------- */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <SectionHeading eyebrow="Select Game" title="Choose Your Battlefield" color="pink" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <GameCard
              href="/mtg"
              accent="cyan"
              eyebrow="01"
              title="Magic: The Gathering"
              blurb="Standard, Modern, Commander, Draft & Sealed. Tables nightly, plus Friday Night Magic."
              icon={<Sparkles className="w-7 h-7" />}
            />
            <GameCard
              href="/killteam"
              accent="amber"
              eyebrow="02"
              title="Kill Team"
              blurb="Painted terrain, ready-to-play rosters in stock, weekly open play and league nights."
              icon={<Crosshair className="w-7 h-7" />}
            />
            <GameCard
              href="/booking"
              accent="pink"
              eyebrow="03"
              title="Tabletop RPGs"
              blurb="D&D, World of Darkness, and one-shots from rotating GMs. Drop into an open seat."
              icon={<Dices className="w-7 h-7" />}
            />
          </div>
        </div>
      </section>

      {/* ----------------------- UPCOMING EVENTS ----------------------- */}
      <section className="py-20 px-4 bg-[var(--color-bg-secondary)] border-y border-[var(--color-border)] relative crt-scanlines">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <SectionHeading eyebrow="High Scores" title="Upcoming Events" color="amber" align="left" />
            <Link
              href="/events"
              className="font-[family-name:var(--font-arcade)] text-sm tracking-wider text-[var(--color-neon-cyan)] hover:text-white inline-flex items-center gap-2 transition-colors"
            >
              ALL EVENTS <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="border border-dashed border-[var(--color-border-bright)] rounded-md p-12 text-center text-[var(--color-text-muted)] font-mono text-sm">
              [ NO EVENTS LOADED — CONNECT DATABASE TO LIGHT UP THIS BOARD ]
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event, i) => (
                <EventCard key={event.id} event={event} index={i + 1} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ----------------------- VISIT US ----------------------- */}
      <section className="py-20 px-4 relative">
        <div className="max-w-5xl mx-auto text-center">
          <SectionHeading eyebrow="Player 2 Ready" title="Drop By the Shop" color="cyan" />
          <p className="text-[var(--color-text-secondary)] mt-6 max-w-2xl mx-auto">
            Open play tables, painted terrain, snacks at the counter, and a community that actually finishes
            its games. Reserve a seat ahead of time or just walk in.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <ArcadeButton href="/about" color="amber">Find the Shop</ArcadeButton>
            <ArcadeButton href="/register" color="pink">Create Account</ArcadeButton>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ----------------------- COMPONENTS ----------------------- */

type NeonColor = "pink" | "cyan" | "amber" | "violet";

const colorMap: Record<NeonColor, { ring: string; text: string; glow: string; chipBg: string }> = {
  pink:   { ring: "var(--color-neon-pink)",   text: "var(--color-neon-pink)",   glow: "rgba(255,46,136,0.55)",  chipBg: "rgba(255,46,136,0.10)" },
  cyan:   { ring: "var(--color-neon-cyan)",   text: "var(--color-neon-cyan)",   glow: "rgba(0,231,255,0.55)",   chipBg: "rgba(0,231,255,0.10)" },
  amber:  { ring: "var(--color-neon-amber)",  text: "var(--color-neon-amber)",  glow: "rgba(255,179,71,0.55)",  chipBg: "rgba(255,179,71,0.10)" },
  violet: { ring: "var(--color-neon-violet)", text: "var(--color-neon-violet)", glow: "rgba(177,75,255,0.55)",  chipBg: "rgba(177,75,255,0.10)" },
};

function ArcadeButton({
  href,
  color,
  children,
}: {
  href: string;
  color: NeonColor;
  children: React.ReactNode;
}) {
  const c = colorMap[color];
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center justify-center px-6 py-3 font-[family-name:var(--font-arcade)] text-sm tracking-widest uppercase transition-all hover:-translate-y-0.5"
      style={{
        color: c.text,
        boxShadow: `inset 0 0 0 1px ${c.ring}, 0 0 12px ${c.glow}`,
        background: "rgba(0,0,0,0.55)",
      }}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: c.chipBg, boxShadow: `inset 0 0 24px ${c.glow}` }}
      />
    </Link>
  );
}

function SectionHeading({
  eyebrow,
  title,
  color,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  color: NeonColor;
  align?: "left" | "center";
}) {
  const c = colorMap[color];
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <p
        className="font-mono text-xs tracking-[0.3em] uppercase mb-2"
        style={{ color: c.text, textShadow: `0 0 8px ${c.glow}` }}
      >
        &gt; {eyebrow}
      </p>
      <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-[var(--color-text-primary)]">
        {title}
      </h2>
    </div>
  );
}

function GameCard({
  href,
  accent,
  eyebrow,
  title,
  blurb,
  icon,
}: {
  href: string;
  accent: NeonColor;
  eyebrow: string;
  title: string;
  blurb: string;
  icon: React.ReactNode;
}) {
  const c = colorMap[accent];
  return (
    <Link
      href={href}
      className="group relative block rounded-lg p-px transition-transform hover:-translate-y-1"
      style={{ background: `linear-gradient(160deg, ${c.ring}, transparent 60%)` }}
    >
      <div
        className="rounded-[7px] bg-[var(--color-bg-card)] p-6 h-full flex flex-col"
        style={{ boxShadow: `inset 0 0 30px ${c.chipBg}` }}
      >
        <div className="flex items-center justify-between mb-6">
          <span
            className="font-mono text-xs tracking-widest"
            style={{ color: c.text }}
          >
            {eyebrow}
          </span>
          <span style={{ color: c.text, filter: `drop-shadow(0 0 8px ${c.glow})` }}>{icon}</span>
        </div>
        <h3
          className="font-[family-name:var(--font-arcade)] text-2xl text-[var(--color-text-primary)] mb-3"
          style={{ textShadow: `0 0 12px ${c.glow}` }}
        >
          {title}
        </h3>
        <p className="text-[var(--color-text-secondary)] text-sm flex-1">{blurb}</p>
        <span
          className="mt-6 font-[family-name:var(--font-arcade)] text-xs tracking-widest inline-flex items-center gap-2"
          style={{ color: c.text }}
        >
          PRESS START <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function EventCard({ event, index }: { event: EventList[number]; index: number }) {
  const d = new Date(event.date);
  return (
    <div className="relative rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] p-6 hover:border-[var(--color-neon-amber)] transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="font-mono text-xs text-[var(--color-text-muted)] tracking-widest">
          #{String(index).padStart(2, "0")}
        </div>
        <span
          className="font-mono text-[10px] tracking-widest uppercase px-2 py-1 rounded"
          style={{
            color: "var(--color-neon-amber)",
            background: "rgba(255,179,71,0.10)",
            boxShadow: "inset 0 0 0 1px rgba(255,179,71,0.4)",
          }}
        >
          {EVENT_TYPES[event.type] || event.type}
        </span>
      </div>
      <div className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-neon-amber)] mb-1 leading-none">
        {d.getDate()}
      </div>
      <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)] mb-4">
        {d.toLocaleString("en-US", { month: "short", weekday: "short" })}
      </div>
      <h3 className="font-[family-name:var(--font-arcade)] text-lg text-[var(--color-text-primary)] mb-2">
        {event.title}
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2">{event.description}</p>
      <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-mono">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {formatDate(event.date)}
        </span>
        {event.price > 0 && (
          <span className="text-[var(--color-gold-bright)]">{formatPrice(event.price)}</span>
        )}
      </div>
    </div>
  );
}
