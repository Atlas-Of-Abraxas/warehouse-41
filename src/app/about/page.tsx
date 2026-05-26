import { MapPin, Clock, Mail, Sword, ShoppingBag, Users, Palette } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">About Warehouse 41</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* About Text */}
        <div>
          <p className="text-[var(--color-text-secondary)] text-lg mb-6">
            Warehouse 41 is your friendly local game store and playspace, dedicated
            to the tabletop gaming community. Whether you&apos;re slinging spells in
            Magic: The Gathering, battling in Kill Team, rolling dice in
            D&amp;D, or navigating the politics of the World of Darkness, we&apos;ve
            got the space, the stock, and the community for you.
          </p>
          <p className="text-[var(--color-text-secondary)] text-lg mb-6">
            Founded by gamers, for gamers. Our 3,000 sq ft space features
            dedicated play areas, a fully stocked retail shop, and a welcoming
            atmosphere for veterans and newcomers alike.
          </p>

          {/* Services */}
          <h2 className="text-2xl font-bold mt-10 mb-6 text-[var(--color-gold)]">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: ShoppingBag, title: "Retail Shop", desc: "MTG singles & sealed, Kill Team kits & terrain, RPG books, paints, dice, and accessories." },
              { icon: Sword, title: "RPG Sessions", desc: "Weekly D&D and World of Darkness games run by experienced GMs. Inquire at the store for details." },
              { icon: Users, title: "Events & Tournaments", desc: "Friday Night Magic, Kill Team leagues & tournaments, pre-release events, and casual play nights." },
              { icon: Palette, title: "Paint Station", desc: "Free-to-use painting area with tools. Paint & Take workshops every month." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-4">
                <Icon className="w-6 h-6 text-[var(--color-accent)] mb-2" />
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Hours */}
        <div>
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-[var(--color-gold)]">Store Hours</h2>
            <ul className="space-y-2 text-[var(--color-text-secondary)]">
              <li className="flex justify-between"><span>Monday - Saturday</span><span className="text-[var(--color-text-primary)]">11:00 AM - 11:00 PM</span></li>
              <li className="flex justify-between"><span>Sunday</span><span className="text-[var(--color-text-primary)]">12:00 PM - 6:00 PM</span></li>
            </ul>
          </div>

          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-[var(--color-gold)]">Contact & Location</h2>
            <ul className="space-y-3 text-[var(--color-text-secondary)]">
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

          {/* Map */}
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg overflow-hidden">
            <iframe
              title="Warehouse 41 location"
              src="https://maps.google.com/maps?q=41%20Varick%20Ave%20%23216%2C%20Brooklyn%2C%20NY%2011237&output=embed"
              className="w-full aspect-video border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
}
