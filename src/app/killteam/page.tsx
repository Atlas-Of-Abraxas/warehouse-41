import { prisma } from "@/lib/db";
import { formatDate, formatTime, formatPrice } from "@/lib/utils";
import { Calendar, Clock, Users, Crosshair, Mountain, Swords } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const KILL_TEAMS = [
  { faction: "Space Marines", team: "Intercession Squad", playstyle: "Balanced / Elite", models: "6", difficulty: "Beginner" },
  { faction: "Death Guard", team: "Plague Marines", playstyle: "Durable / Slow", models: "6", difficulty: "Beginner" },
  { faction: "Aeldari", team: "Hand of the Archon", playstyle: "Glass Cannon / Fast", models: "7", difficulty: "Intermediate" },
  { faction: "Orks", team: "Kommandos", playstyle: "Aggressive / Melee", models: "10", difficulty: "Beginner" },
  { faction: "T'au Empire", team: "Pathfinders", playstyle: "Ranged / Support", models: "10", difficulty: "Intermediate" },
  { faction: "Adeptus Mechanicus", team: "Hunter Clade", playstyle: "Versatile / Techy", models: "10", difficulty: "Intermediate" },
  { faction: "Tyranids", team: "Brood Coven", playstyle: "Swarm / Adaptive", models: "10", difficulty: "Intermediate" },
  { faction: "Chaos Daemons", team: "Warp Coven", playstyle: "Psychic / Elite", models: "5", difficulty: "Advanced" },
  { faction: "Imperial Guard", team: "Veteran Guardsmen", playstyle: "Horde / Tactical", models: "10", difficulty: "Beginner" },
  { faction: "Necrons", team: "Hierotek Circle", playstyle: "Resilient / Tech", models: "7", difficulty: "Intermediate" },
  { faction: "Genestealer Cults", team: "Brood Brothers", playstyle: "Ambush / Tricky", models: "10", difficulty: "Advanced" },
  { faction: "Sisters of Battle", team: "Novitiates", playstyle: "Melee / Faith", models: "10", difficulty: "Intermediate" },
];

const TERRAIN_SETS = [
  { name: "Octarius Jungle", type: "Dense / Heavy Cover", pieces: 14, desc: "Ork scrap walls, jungle ruins, and barricades. Favors close-range teams." },
  { name: "Chalnath Ruins", type: "Open / Vantage Points", pieces: 12, desc: "Ruined Imperial city. Elevated positions and long sight lines for shooting teams." },
  { name: "Into the Dark (Space Hulk)", type: "Close Quarters", pieces: 18, desc: "Tight corridors and sealed rooms. No long-range shooting — pure CQB." },
  { name: "Bheta-Decima Forge", type: "Mixed / Industrial", pieces: 15, desc: "Mechanicus factory terrain. Balanced mix of cover and open lanes." },
  { name: "Volkus Underhive", type: "Vertical / Multi-level", pieces: 16, desc: "Stacked walkways and ladders. High ground matters. Great for experienced players." },
];

const TIME_SLOTS = [
  { day: "Tuesday", time: "6:00 PM - 9:00 PM", label: "Kill Team Night", type: "Open Play" },
  { day: "Thursday", time: "6:00 PM - 9:00 PM", label: "Kill Team League", type: "Competitive" },
  { day: "Saturday", time: "12:00 PM - 4:00 PM", label: "Weekend Kill Team", type: "Open Play" },
  { day: "Saturday", time: "4:00 PM - 8:00 PM", label: "Kill Team Tournament", type: "Tournament (Bi-weekly)" },
  { day: "Sunday", time: "1:00 PM - 5:00 PM", label: "Beginner Kill Team", type: "Learn to Play" },
];

function difficultyColor(d: string) {
  if (d === "Beginner") return "text-green-400";
  if (d === "Intermediate") return "text-yellow-400";
  return "text-red-400";
}

export default async function KillTeamPage() {
  const ktEvents = await prisma.event.findMany({
    where: { type: "KILL_TEAM", date: { gte: new Date() } },
    orderBy: { date: "asc" },
    take: 4,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crosshair className="w-10 h-10 text-[var(--color-accent)]" />
          <h1 className="text-5xl font-bold">
            <span className="text-[var(--color-accent)]">Kill Team</span>{" "}
            <span className="text-[var(--color-gold)]">at Warehouse 41</span>
          </h1>
        </div>
        <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          Fast-paced Warhammer 40K skirmish combat. Pick a team, choose your terrain,
          and fight for glory in the 41st millennium.
        </p>
      </div>

      {/* Teams Chart */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Swords className="w-6 h-6 text-[var(--color-gold)]" />
          <h2 className="text-3xl font-bold">Choose Your Kill Team</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="py-3 px-4 text-sm font-semibold text-[var(--color-gold)]">Faction</th>
                <th className="py-3 px-4 text-sm font-semibold text-[var(--color-gold)]">Kill Team</th>
                <th className="py-3 px-4 text-sm font-semibold text-[var(--color-gold)]">Playstyle</th>
                <th className="py-3 px-4 text-sm font-semibold text-[var(--color-gold)] text-center">Models</th>
                <th className="py-3 px-4 text-sm font-semibold text-[var(--color-gold)]">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {KILL_TEAMS.map((kt) => (
                <tr
                  key={kt.team}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-card)] transition-colors"
                >
                  <td className="py-3 px-4 font-medium">{kt.faction}</td>
                  <td className="py-3 px-4 text-[var(--color-accent)]">{kt.team}</td>
                  <td className="py-3 px-4 text-sm text-[var(--color-text-secondary)]">{kt.playstyle}</td>
                  <td className="py-3 px-4 text-sm text-center">{kt.models}</td>
                  <td className={`py-3 px-4 text-sm font-medium ${difficultyColor(kt.difficulty)}`}>
                    {kt.difficulty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] mt-3">
          Don&apos;t have a team? We have loaner Kill Teams available for open play nights.
        </p>
      </section>

      {/* Time Slots */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-6 h-6 text-[var(--color-gold)]" />
          <h2 className="text-3xl font-bold">Weekly Schedule</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TIME_SLOTS.map((slot) => (
            <div
              key={`${slot.day}-${slot.time}`}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg">{slot.day}</span>
                <span className="text-xs font-medium text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-1 rounded">
                  {slot.type}
                </span>
              </div>
              <p className="text-[var(--color-gold)] font-semibold">{slot.label}</p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {slot.time}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Terrain */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Mountain className="w-6 h-6 text-[var(--color-gold)]" />
          <h2 className="text-3xl font-bold">Available Terrain</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TERRAIN_SETS.map((terrain) => (
            <div
              key={terrain.name}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-5"
            >
              <h3 className="font-bold text-lg text-[var(--color-accent)]">{terrain.name}</h3>
              <span className="text-xs font-medium text-[var(--color-gold)] bg-[var(--color-gold)]/10 px-2 py-0.5 rounded">
                {terrain.type}
              </span>
              <p className="text-sm text-[var(--color-text-secondary)] mt-3">{terrain.desc}</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-2">
                {terrain.pieces} terrain pieces
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Kill Team Events from DB */}
      {ktEvents.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[var(--color-gold)]" />
              <h2 className="text-3xl font-bold">Upcoming Kill Team Events</h2>
            </div>
            <Link href="/events?type=KILL_TEAM" className="text-[var(--color-accent)] hover:underline text-sm">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ktEvents.map((event) => (
              <div
                key={event.id}
                className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">{event.description}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-[var(--color-text-secondary)]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {formatDate(event.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {formatTime(event.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {event.registered}/{event.capacity} registered
                  </span>
                  {event.price > 0 && (
                    <span className="text-[var(--color-gold)] font-semibold">
                      {formatPrice(event.price)} entry
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Faction Spotlight */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Faction Spotlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/killteam/khorne"
            className="group border border-red-900/40 bg-gradient-to-br from-red-950/30 to-neutral-950/50 rounded-lg p-6 hover:border-red-600/60 transition-colors"
          >
            <span className="text-2xl font-black text-red-500 group-hover:text-red-400 transition-colors">KHORNE</span>
            <p className="text-sm text-red-200/50 mt-2">Blood for the Blood God. Full roster, skills, and tactical ploys for the World Eaters Kill Team.</p>
          </Link>
          <Link
            href="/killteam/nurgle"
            className="group border border-green-900/40 bg-gradient-to-br from-green-950/30 to-neutral-950/50 rounded-lg p-6 hover:border-green-600/60 transition-colors"
          >
            <span className="text-2xl font-black text-green-500 group-hover:text-green-400 transition-colors">NURGLE</span>
            <p className="text-sm text-green-200/50 mt-2">Embrace the decay. Death Guard roster, contagions, and tactical ploys for the Plague Host.</p>
          </Link>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] mt-3">
          More faction pages coming soon.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-10">
        <h2 className="text-2xl font-bold mb-3">Ready to Play?</h2>
        <p className="text-[var(--color-text-secondary)] mb-6 max-w-lg mx-auto">
          Drop in for open play, sign up for our league, or grab a starter set from the shop.
          New players welcome — we&apos;ll teach you the ropes.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/shop?category=KILL_TEAM"
            className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Shop Kill Team
          </Link>
          <Link
            href="/events?type=KILL_TEAM"
            className="border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-bg-primary)] px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            View Events
          </Link>
        </div>
      </section>
    </div>
  );
}
