import { Warehouse, MapPin, Clock, Phone, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold text-[var(--color-accent)] mb-4">
              <Warehouse className="w-6 h-6" />
              Warehouse 41
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Your local game store and playspace. Magic: The Gathering,
              Kill Team, D&D, World of Darkness, and more.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[var(--color-gold)] mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">Shop</Link></li>
              <li><Link href="/events" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">Events</Link></li>
              <li><Link href="/booking" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">Book a Session</Link></li>
              <li><Link href="/about" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[var(--color-gold)] mb-4">Visit Us</h3>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" /> 41 Commerce St, Anytown, USA
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0" /> Mon-Sat 11am-9pm, Sun 12pm-6pm
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" /> (555) 041-GAME
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" /> info@warehouse41.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] mt-8 pt-8 text-center text-sm text-[var(--color-text-secondary)]">
          &copy; {new Date().getFullYear()} Warehouse 41. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
