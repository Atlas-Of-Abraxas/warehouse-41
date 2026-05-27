import { SectionHeader } from "@/components/ui/SectionHeader";
import BookATableForm from "./BookATableForm";

export const metadata = {
  title: "Book a Table — Warehouse 41",
};

export default function BookATablePage() {
  return (
    <div>
      {/* ----------------------- HERO ----------------------- */}
      <section className="paper-grain border-b border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28">
          <p className="eyebrow">Reserve</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-6xl text-[var(--color-text-primary)] max-w-3xl leading-[1.05]">
            Book a Table
          </h1>
          <p className="mt-6 text-lg text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            Reserve a table and add what you need to play — borrow a Kill Team with terrain, grab an
            MTG time slot, or both on the same visit.
          </p>
        </div>
      </section>

      {/* ----------------------- FORM ----------------------- */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <SectionHeader eyebrow="Your table" title="Pick a date, then add to it." />
        <div className="mt-10 max-w-2xl">
          <BookATableForm />
        </div>
      </section>
    </div>
  );
}
