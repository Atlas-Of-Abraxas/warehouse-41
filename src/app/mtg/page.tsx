import { Calendar, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import {
  MTG_FORMATS,
  TIME_SLOT_LABELS,
  TIME_SLOTS,
  REGULAR_SLOT_PRICE,
  SPECIAL_NIGHT_LABELS,
} from "@/lib/mtg";
import MTGBookingForm from "./MTGBookingForm";

export default function MTGPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-10 h-10 text-[var(--color-accent)]" />
          <h1 className="text-5xl font-bold">
            <span className="text-[var(--color-accent)]">Magic: The Gathering</span>{" "}
            <span className="text-[var(--color-gold)]">at Warehouse 41</span>
          </h1>
        </div>
        <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          Reserve a time slot for play. Regular hours 11 AM – 11 PM every day we&apos;re open. ${REGULAR_SLOT_PRICE} per seat.
        </p>
      </div>

      {/* Formats */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-[var(--color-gold)]" />
          <h2 className="text-3xl font-bold">Formats</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {MTG_FORMATS.map((f) => (
            <div
              key={f}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-4 text-center"
            >
              <span className="font-semibold">{f}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Schedule */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-6 h-6 text-[var(--color-gold)]" />
          <h2 className="text-3xl font-bold">Daily Schedule</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {TIME_SLOTS.map((slot) => (
            <div
              key={slot}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-5"
            >
              <h3 className="font-bold text-lg">{TIME_SLOT_LABELS[slot]}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                4 tables &middot; ${REGULAR_SLOT_PRICE}/seat
              </p>
            </div>
          ))}
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Regular hours 11 AM – 11 PM every day we&apos;re open. ${String(REGULAR_SLOT_PRICE)} per seat. Each slot is a 3-hour block.
        </p>
      </section>

      {/* Special Nights */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-6 h-6 text-[var(--color-gold)]" />
          <h2 className="text-3xl font-bold">Featured Nights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(SPECIAL_NIGHT_LABELS).map(([, label]) => (
            <div
              key={label}
              className="bg-[var(--color-bg-card)] border border-[var(--color-gold)]/30 rounded-lg p-6"
            >
              <h3 className="font-bold text-lg text-[var(--color-gold)]">{label}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                Featured format highlighted in the booking form. All formats still welcome.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Form */}
      <section id="book" className="mb-16 max-w-2xl mx-auto">
        <MTGBookingForm />
      </section>

      {/* CTA */}
      <section className="text-center bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-10">
        <h2 className="text-2xl font-bold mb-3">Ready to Play?</h2>
        <p className="text-[var(--color-text-secondary)] mb-6 max-w-lg mx-auto">
          Drop in for a game, reserve a table, or check out our MTG singles and sealed product.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/shop?category=MTG"
            className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Shop MTG
          </Link>
          <Link
            href="/events?type=MTG"
            className="border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            View Events
          </Link>
          <a
            href="#book"
            className="border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-bg-primary)] px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Book a Time Slot
          </a>
        </div>
      </section>
    </div>
  );
}
