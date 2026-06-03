import { MapPin, Clock, Mail, Users } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const SERVICES = [
  { icon: Users, title: "Events & Tournaments", desc: "Friday Night Magic, Kill Team leagues & tournaments, pre-release events, and casual play nights." },
];

export default function AboutPage() {
  return (
    <div>
      {/* ----------------------- HERO ----------------------- */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gallery/warehouse-facade.jpg"
          alt="The Warehouse 41 storefront"
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
        <div className="relative max-w-5xl mx-auto px-6 md:px-10 py-24 md:py-32">
          <p className="eyebrow">Brooklyn · Tabletop</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-6xl text-[var(--color-text-primary)] max-w-3xl leading-[1.05]">
            About Warehouse 41
          </h1>
          <p className="mt-6 text-lg text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            Your friendly local game store and playspace, dedicated to the tabletop gaming
            community of Brooklyn and the boroughs beyond.
          </p>
        </div>
      </section>

      {/* ----------------------- WHO WE ARE ----------------------- */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-24">
        <SectionHeader eyebrow="Our shop" title="Founded by gamers, for gamers." />
        <p className="mt-6 text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
          Dedicated tables for MTG and miniatures games, and a welcoming atmosphere for veterans
          and newcomers alike.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {SERVICES.map(({ icon: Icon, title, desc }) => (
            <article
              key={title}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 hover:border-[var(--color-accent)] transition-colors"
            >
              <Icon className="w-6 h-6 text-[var(--color-accent)]" />
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl text-[var(--color-text-primary)]">
                {title}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="rule-brass max-w-5xl mx-auto" />

      {/* ----------------------- VISIT ----------------------- */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-24">
        <SectionHeader eyebrow="Visit" title="Hours & location" />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 md:p-8">
              <p className="eyebrow">Open daily</p>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--color-text-primary)]">
                Store hours
              </h3>
              <ul className="mt-5 space-y-2 text-[var(--color-text-secondary)]">
                <li className="flex justify-between">
                  <span>Monday – Sunday</span>
                  <span className="text-[var(--color-text-primary)]">11:00 AM – 11:00 PM</span>
                </li>
              </ul>
            </div>

            <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 md:p-8">
              <p className="eyebrow">Get in touch</p>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--color-text-primary)]">
                Contact &amp; location
              </h3>
              <ul className="mt-5 space-y-3 text-[var(--color-text-secondary)]">
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
                  41 Varick Ave #216, Brooklyn, NY 11237
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
                  warehouse41k@outlook.com
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
                  Open 7 days a week
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-md border border-[var(--color-border)] overflow-hidden min-h-[20rem]">
            <iframe
              title="Warehouse 41 location"
              src="https://maps.google.com/maps?q=41%20Varick%20Ave%20%23216%2C%20Brooklyn%2C%20NY%2011237&output=embed"
              className="w-full h-full min-h-[20rem] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </div>
  );
}
