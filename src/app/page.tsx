import Link from "next/link";

const GALLERY = [
  { src: "/gallery/shop/killteam-battle.jpg", alt: "A Kill Team skirmish underway on painted terrain" },
  { src: "/gallery/shop/game-night.jpg", alt: "Regulars around the table on game night" },
  { src: "/gallery/shop/display-case-minis.jpg", alt: "Painted miniatures in the shop display case" },
  { src: "/gallery/shop/mtg-strixhaven.jpg", alt: "Magic: The Gathering Strixhaven boosters and novel" },
  { src: "/gallery/shop/rpg-group.jpg", alt: "A group gathered for a tabletop RPG session" },
  { src: "/gallery/shop/painted-warband.jpg", alt: "A freshly painted warband on the paint mat" },
  { src: "/gallery/shop/mtg-cards.jpg", alt: "Magic: The Gathering cards laid out on a playmat" },
  { src: "/gallery/shop/rpg-table.jpg", alt: "Players mid-session at a roleplaying table" },
  { src: "/gallery/shop/character-booklet.jpg", alt: "A hand-bound RPG character booklet" },
  { src: "/gallery/shop/shop-talk.jpg", alt: "A talk in the Warehouse 41 event space" },
  { src: "/gallery/shop/character-sheets.jpg", alt: "D&D character sheets spread across the table" },
];

export default function HomePage() {
  return (
    <div>
      {/* ----------------------- HERO ----------------------- */}
      <section className="paper-grain px-6 md:px-10">
        <div className="max-w-5xl mx-auto pt-20 md:pt-28 pb-20 md:pb-24 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
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
            <PrimaryLink href="/book-a-table">Reserve a table</PrimaryLink>
            <QuietLink href="/events">See what&rsquo;s on the calendar</QuietLink>
          </div>
        </div>
        <div className="rule-brass max-w-5xl mx-auto" />
      </section>

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
              body="Painted terrain at the ready, rental rosters in the case, with an introduction to Kill Team, along with matched play every first and third Monday."
            />
            <PlayBlock
              href="/book-a-table"
              kicker="Browse our library or bring your own game"
              title="Open play"
              body="Reserve a table and play whatever you like — board games, your own minis, a pickup RPG. Add open play to any table booking; check the calendar for scheduled D&D and other one-shots."
            />
          </div>
        </div>
      </section>

      <div className="rule-brass max-w-5xl mx-auto" />

      {/* ----------------------- AROUND THE SHOP ----------------------- */}
      <section className="px-6 md:px-10 py-20 md:py-24">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="Around the shop"
            title="Game nights, painted minis, and the regulars."
          />
          <GalleryGrid />
        </div>
      </section>

      <div className="rule-brass max-w-5xl mx-auto" />

      {/* ----------------------- VISIT ----------------------- */}
      <section className="px-6 md:px-10 py-20 md:py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-12">
          <div>
            <p className="eyebrow">Visit</p>
            <h2 className="mt-3 text-3xl md:text-4xl text-[var(--color-text-primary)]">
              Stop by the shop.
            </h2>
            <p className="mt-6 text-[var(--color-text-secondary)] leading-relaxed">
              Walk in for open play or reserve a table ahead. The counter&rsquo;s usually staffed by
              someone who plays the game you&rsquo;re asking about.
            </p>
            <div className="mt-8">
              <PrimaryLink href="/about">Hours, address &amp; contact</PrimaryLink>
            </div>
          </div>

          <div className="border border-[var(--color-border)] rounded-sm p-6 sm:p-8 bg-[var(--color-bg-card)]">
            <dl className="space-y-5 text-sm">
              <DetailRow term="Hours">Mon–Sat 11 AM – 11 PM · Sun 12 – 6 PM</DetailRow>
              <DetailRow term="Address">41 Varick Ave #216, Brooklyn, NY 11237</DetailRow>
              <DetailRow term="Email">warehouse41k@outlook.com</DetailRow>
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

function GalleryGrid() {
  return (
    <div className="mt-12 columns-2 md:columns-3 gap-3 [&>*]:mb-3">
      {GALLERY.map((g) => (
        <div
          key={g.src}
          className="break-inside-avoid overflow-hidden rounded-sm border border-[var(--color-border)] bg-[var(--color-bg-card)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={g.src}
            alt={g.alt}
            loading="lazy"
            className="block w-full h-auto transition-transform duration-500 hover:scale-[1.03]"
          />
        </div>
      ))}
    </div>
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

function DetailRow({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[5rem_1fr] sm:grid-cols-[8rem_1fr] gap-4">
      <dt className="text-[var(--color-text-muted)] uppercase tracking-[0.15em] text-[11px] pt-0.5">
        {term}
      </dt>
      <dd className="text-[var(--color-text-primary)]">{children}</dd>
    </div>
  );
}
