import { MapPin, Clock, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)] mt-auto">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link href="/" className="inline-block mb-5" aria-label="Warehouse 41 — Home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Warehouse 41" className="h-10 w-auto" />
            </Link>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
              A tabletop game shop, run by people who play. Expanding library of tabletop and card
              games, feel welcome to bring your personal favorites or start a new campaign with our
              sourcebooks and supplements.
            </p>
          </div>

          <div>
            <p className="eyebrow mb-4">Find your way</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/events" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">Events</Link></li>
              <li><Link href="/mtg#book" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">Reserve an MTG table</Link></li>
              <li><Link href="/killteam#book" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">Book a Kill Team match</Link></li>
              <li><Link href="/book-a-table" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">Book a table</Link></li>
              <li><Link href="/about" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">About the shop</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4">Visit</p>
            <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[var(--color-accent)]" />
                <span>41 Varick Ave #216, Brooklyn, NY 11237</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-[var(--color-accent)]" />
                <span>Mon–Sat 11 AM – 11 PM · Sun 12 – 6 PM</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 shrink-0 mt-0.5 text-[var(--color-accent)]" />
                <span>warehouse41k@outlook.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] mt-12 pt-8 text-xs text-[var(--color-text-muted)] flex flex-wrap justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} Warehouse 41</span>
          <span className="italic">Be kind. Finish your game. Sleeve your cards.</span>
        </div>
      </div>
    </footer>
  );
}
