import Link from "next/link";
import { prisma, dbQuery } from "@/lib/db";
import { formatPrice, formatDate, EVENT_TYPES } from "@/lib/utils";
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
      take: 4,
    })
  );
  if (loaded.ok) upcomingEvents = loaded.data;

  return (
    <div>
      {!loaded.ok && <DbWarningBanner />}

      {/* ----------------------- HERO ----------------------- */}
      <section className="paper-grain px-6 md:px-10">
        <div className="max-w-5xl mx-auto pt-20 md:pt-28 pb-20 md:pb-24 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="Warehouse 41"
              className="w-full max-w-2xl h-auto"
            />
          </div>

          <h1 className="text-3xl md:text-[2.4rem] leading-[1.15] text-[var(--color-text-primary)] max-w-3xl mx-auto">
            A tabletop game shop, run by people who play.
          </h1>

          <p className="mt-6 text-[var(--color-text-secondary)] text-lg leading-relaxed max-w-2xl mx-auto">
            Painted terrain, ongoing campaigns, table reservations, and the kind of staff who&rsquo;ll
            actually talk through a deck or a roster with you. No mill, no churn, no plastic-wrapped
            booster wall as the welcome mat.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <PrimaryLink href="/booking">Reserve a table</PrimaryLink>
            <QuietLink href="/events">See what&rsquo;s on the calendar</QuietLink>
          </div>
        </div>
        <div className="rule-brass max-w-5xl mx-auto" />
      </section>

      {/* ----------------------- THIS WEEK ----------------------- */}
      <section className="px-6 md:px-10 py-20 md:py-24">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="This week"
            title="On the calendar"
            link={{ href: "/events", label: "All events" }}
          />
          {upcomingEvents.length === 0 ? (
            <p className="mt-10 text-[var(--color-text-muted)] italic">
              The calendar will populate once the database is connected. For now, walk in
              Thursday–Sunday — there&rsquo;s almost always a game in progress.
            </p>
          ) : (
            <ul className="mt-10 divide-y divide-[var(--color-border)]">
              {upcomingEvents.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </ul>
          )}
        </div>
      </section>

      <div className="rule-brass max-w-5xl mx-auto" />

      {/* ----------------------- WHAT WE PLAY ----------------------- */}
      <section className="px-6 md:px-10 py-20 md:py-24">
        <div className="max-w-5xl mx-auto">
          <SectionHeader eyebrow="What we play" title="If you&rsquo;re new, here&rsquo;s where to start." />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
            <PlayBlock
              href="/mtg"
              kicker="Card game"
              title="Magic: The Gathering"
              body="Sealed and Draft on weekends, Modern and Commander pods through the week. Casual seats are usually open; the regulars are happy to teach if you&rsquo;re new."
            />
            <PlayBlock
              href="/killteam"
              kicker="Miniatures skirmish"
              title="Kill Team"
              body="Painted terrain at the ready, rental rosters in the case, and open play every Saturday. Bring your own kill team or borrow one of ours."
            />
            <PlayBlock
              href="/booking"
              kicker="Roleplay"
              title="D&D & one-shots"
              body="A rotating slate of GMs running Dungeons & Dragons, World of Darkness, and the occasional indie one-shot. Drop into an open seat or book ahead."
            />
          </div>
        </div>
      </section>

      <div className="rule-brass max-w-5xl mx-auto" />

      {/* ----------------------- FROM THE PAINT TABLE ----------------------- */}
      <section className="px-6 md:px-10 py-20 md:py-24">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="From the paint table"
            title="Recent work from the shop and our regulars."
          />
          <p className="mt-6 text-[var(--color-text-secondary)] max-w-2xl">
            Photos of terrain, rental rosters, and games in progress live here. Drop the JPGs into{" "}
            <code className="font-mono text-sm text-[var(--color-accent)]">public/gallery/</code> and
            they&rsquo;ll show up below.
          </p>
        </div>
      </section>

      <div className="rule-brass max-w-5xl mx-auto" />

      {/* ----------------------- VISIT ----------------------- */}
      <section className="px-6 md:px-10 py-20 md:py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-12">
          <div>
            <p className="eyebrow">Visit</p>
            <h2 className="mt-3 text-3xl md:text-4xl text-[var(--color-text-primary)]">
              The shop is open Thursday through Sunday.
            </h2>
            <p className="mt-6 text-[var(--color-text-secondary)] leading-relaxed">
              Walk in for open play or reserve a table ahead. The counter&rsquo;s usually staffed by
              someone who plays the game you&rsquo;re asking about. We don&rsquo;t do high-pressure
              singles, and the snack shelf is honest.
            </p>
            <div className="mt-8">
              <PrimaryLink href="/about">Hours, address &amp; contact</PrimaryLink>
            </div>
          </div>

          <div className="border border-[var(--color-border)] rounded-sm p-8 bg-[var(--color-bg-card)]">
            <dl className="space-y-5 text-sm">
              <DetailRow term="Open play">Thursday–Sunday · noon to close</DetailRow>
              <DetailRow term="Reservations">Always free · cancel any time</DetailRow>
              <DetailRow term="House rules">Be kind. Finish your game. Sleeve your cards.</DetailRow>
              <DetailRow term="Counter">Run by people who play. Ask anything.</DetailRow>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ----------------------- COMPONENTS ----------------------- */

function SectionHeader({
  eyebrow,
  title,
  link,
}: {
  eyebrow: string;
  title: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 text-3xl md:text-4xl text-[var(--color-text-primary)] max-w-3xl">
          {title}
        </h2>
      </div>
      {link && (
        <Link
          href={link.href}
          className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-hover)] underline underline-offset-4 decoration-[var(--color-border-bright)] hover:decoration-[var(--color-accent)] transition-colors"
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
}

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg-primary)] transition-colors rounded-sm"
    >
      {children}
    </Link>
  );
}

function QuietLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] underline underline-offset-4 decoration-[var(--color-border-bright)] hover:decoration-[var(--color-accent)] transition-colors"
    >
      {children}
    </Link>
  );
}

function PlayBlock({
  href,
  kicker,
  title,
  body,
}: {
  href: string;
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <article>
      <p className="eyebrow">{kicker}</p>
      <h3 className="mt-3 text-2xl text-[var(--color-text-primary)]">{title}</h3>
      <p className="mt-4 text-[var(--color-text-secondary)] leading-relaxed">{body}</p>
      <Link
        href={href}
        className="mt-5 inline-block text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline underline-offset-4 decoration-[var(--color-border-bright)] hover:decoration-[var(--color-accent)] transition-colors"
      >
        More on {title} →
      </Link>
    </article>
  );
}

function EventRow({ event }: { event: EventList[number] }) {
  const d = new Date(event.date);
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  return (
    <li className="py-6 grid grid-cols-[auto_1fr_auto] gap-6 items-start">
      <div className="text-center min-w-[3rem]">
        <div className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-accent)] leading-none">
          {day}
        </div>
        <div className="mt-1 text-[10px] tracking-[0.22em] text-[var(--color-text-muted)]">
          {month}
        </div>
      </div>
      <div>
        <p className="eyebrow">{EVENT_TYPES[event.type] || event.type}</p>
        <h3 className="mt-1 text-lg text-[var(--color-text-primary)]">{event.title}</h3>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)] line-clamp-2 max-w-2xl">
          {event.description}
        </p>
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">{formatDate(event.date)}</p>
      </div>
      <div className="text-right text-sm">
        {event.price > 0 ? (
          <span className="text-[var(--color-text-primary)]">{formatPrice(event.price)}</span>
        ) : (
          <span className="text-[var(--color-text-muted)] italic">Free</span>
        )}
      </div>
    </li>
  );
}

function DetailRow({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-4">
      <dt className="text-[var(--color-text-muted)] uppercase tracking-[0.15em] text-[11px] pt-0.5">
        {term}
      </dt>
      <dd className="text-[var(--color-text-primary)]">{children}</dd>
    </div>
  );
}
