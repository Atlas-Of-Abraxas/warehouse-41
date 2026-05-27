import {
  TIME_SLOT_LABELS,
  TIME_SLOTS,
  REGULAR_SLOT_PRICE,
} from "@/lib/mtg";
import MTGBookingForm from "./MTGBookingForm";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";

export default function MTGPage() {
  return (
    <div>
      {/* ----------------------- HERO ----------------------- */}
      <section className="paper-grain border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28">
          <p className="eyebrow">Trading card game</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-6xl text-[var(--color-text-primary)] max-w-3xl leading-[1.05]">
            Magic: The Gathering at Warehouse 41
          </h1>
          <p className="mt-6 text-lg text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            Reserve a time slot for play. Regular hours 11 AM – 11 PM every day we&apos;re open.
            ${REGULAR_SLOT_PRICE} per seat.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="#book" variant="solid">Book a time slot</ButtonLink>
            <ButtonLink href="/events?type=MTG" variant="primary">View events</ButtonLink>
          </div>
        </div>
      </section>

      {/* ----------------------- DAILY SCHEDULE ----------------------- */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
        <SectionHeader eyebrow="When to play" title="Daily schedule" />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {TIME_SLOTS.map((slot) => (
            <div
              key={slot}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5"
            >
              <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-text-primary)]">
                {TIME_SLOT_LABELS[slot]}
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                4 tables &middot; ${REGULAR_SLOT_PRICE}/seat
              </p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm text-[var(--color-text-secondary)]">
          Regular hours 11 AM – 11 PM every day we&apos;re open. ${String(REGULAR_SLOT_PRICE)} per
          seat. Each slot is a 3-hour block.
        </p>
      </section>

      <div className="rule-brass max-w-6xl mx-auto" />

      {/* ----------------------- BOOK ----------------------- */}
      <section id="book" className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
        <SectionHeader eyebrow="Reserve" title="Book a time slot" />
        <div className="mt-12 max-w-2xl">
          <MTGBookingForm />
        </div>
      </section>

      {/* ----------------------- CTA ----------------------- */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-24">
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-10 md:p-14 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-text-primary)]">
            Ready to play?
          </h2>
          <p className="mt-4 text-[var(--color-text-secondary)] max-w-lg mx-auto">
            Drop in for a game, reserve a table, or join an event — singles and sealed are available
            in store.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/events?type=MTG" variant="solid">View events</ButtonLink>
            <ButtonLink href="#book" variant="primary">Book a time slot</ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
