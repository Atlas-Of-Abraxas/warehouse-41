import Link from "next/link";
import { Skull, Flame, Swords, Droplets, Shield, Crosshair } from "lucide-react";

const KHORNE_UNITS = [
  {
    name: "Khorne Berzerker",
    role: "Assault",
    wounds: 12,
    movement: "3⬡",
    skills: ["Blood for the Blood God", "Furious Charge"],
    desc: "Frenzied close-combat killers. +1 attack on charge. Cannot be given Overwatch orders.",
  },
  {
    name: "Berzerker Champion",
    role: "Leader",
    wounds: 14,
    movement: "3⬡",
    skills: ["Skulls for the Skull Throne", "Inspiring Carnage", "Plasma Pistol"],
    desc: "Leads through slaughter. Nearby allies re-roll 1s in melee. Carries a plasma pistol for ranged threat.",
  },
  {
    name: "Khorne Bloodbound",
    role: "Heavy Assault",
    wounds: 10,
    movement: "3⬡",
    skills: ["Gorefist", "Brass Collar of Khorne"],
    desc: "Armored brawler with a gorefist. 5+ save against psychic powers. Punishes enemies who miss in melee.",
  },
  {
    name: "Bloodreaper",
    role: "Specialist",
    wounds: 11,
    movement: "3⬡",
    skills: ["Reap and Tear", "Undying Fury"],
    desc: "Eviscerator specialist. Can fight twice when below half wounds. Gets deadlier as it takes damage.",
  },
  {
    name: "Skull Champion",
    role: "Icon Bearer",
    wounds: 12,
    movement: "3⬡",
    skills: ["Banner of Rage", "Bloodtithe"],
    desc: "Carries the Icon of Khorne. Each enemy kill grants the team a Bloodtithe point for tactical ploys.",
  },
  {
    name: "World Eater Initiate",
    role: "Warrior",
    wounds: 9,
    movement: "3⬡",
    skills: ["The Nails", "Butcher's Chain"],
    desc: "Driven mad by the Butcher's Nails. Must charge if able. Immune to shock and morale effects.",
  },
];

const TACTICAL_PLOYS = [
  { name: "Blood for the Blood God", cost: "1 CP", desc: "Use when a friendly operative kills an enemy in melee. That operative may immediately fight again against another visible enemy within engagement range." },
  { name: "Skulls for the Skull Throne", cost: "1 CP", desc: "Use at the start of the Firefight phase. Pick one friendly operative — it gains +1 to hit in melee this turning point. If it kills an enemy, it regains D3 wounds." },
  { name: "Brass Stampede", cost: "2 CP", desc: "Use in the movement phase. Up to 3 friendly operatives may make a free dash action toward the nearest visible enemy. They cannot shoot this turning point." },
  { name: "Let the Galaxy Burn", cost: "1 CP", desc: "Use when a friendly operative is incapacitated. Before removing it, it may make one final melee attack at full profile against an enemy in engagement range." },
  { name: "Undying Rage", cost: "1 CP", desc: "Use when a friendly operative would be incapacitated. Roll a D6 — on a 4+, it stays alive with 1 wound remaining instead." },
];

const KHORNE_LORE = [
  "Khorne cares not from whence the blood flows, only that it flows.",
  "Kill! Maim! Burn! The mantra of every true servant of the Blood God.",
  "The Skull Throne grows ever higher. Each kill is an offering. Each death a prayer.",
  "Khorne despises sorcery and cowardice. There is only the blade, and the will to use it.",
  "In the World Eaters, the Butcher's Nails drive warriors past the point of madness — and past the point of death.",
];

export default function KhornePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Blood splatter background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Top-right splatter */}
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #8b0000 0%, #5c0000 40%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        {/* Bottom-left splatter */}
        <div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #a00000 0%, #600000 35%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
        {/* Mid drip */}
        <div
          className="absolute top-1/3 left-1/4 w-64 h-96 opacity-8"
          style={{
            background: "radial-gradient(ellipse at top, #700000 0%, transparent 70%)",
            filter: "blur(30px)",
            borderRadius: "0 0 50% 50%",
          }}
        />
        {/* Right side drip */}
        <div
          className="absolute top-1/2 right-10 w-4 h-48 opacity-20"
          style={{
            background: "linear-gradient(to bottom, #8b0000, #5c0000 60%, transparent)",
            borderRadius: "0 0 50% 50%",
            filter: "blur(2px)",
          }}
        />
        {/* Scattered small splatters */}
        <div className="absolute top-20 left-[15%] w-8 h-8 rounded-full opacity-20" style={{ background: "#700000", filter: "blur(4px)" }} />
        <div className="absolute top-[60%] right-[25%] w-6 h-6 rounded-full opacity-15" style={{ background: "#8b0000", filter: "blur(3px)" }} />
        <div className="absolute top-[40%] left-[60%] w-10 h-10 rounded-full opacity-10" style={{ background: "#600000", filter: "blur(6px)" }} />
        <div className="absolute bottom-[20%] left-[40%] w-5 h-12 opacity-15" style={{ background: "linear-gradient(to bottom, #8b0000, transparent)", borderRadius: "50% 50% 50% 50%", filter: "blur(2px)" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Skull className="w-12 h-12 text-red-600" />
            <Skull className="w-8 h-8 text-red-800 -mt-4" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">
            <span className="text-red-600">BLOOD</span>{" "}
            <span className="text-amber-700">FOR THE</span>{" "}
            <span className="text-red-600">BLOOD GOD</span>
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-amber-600 tracking-widest uppercase mb-6">
            Skulls for the Skull Throne
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-red-700 to-transparent mx-auto mb-8" />
          <p className="text-lg text-red-300/70 max-w-2xl mx-auto italic">
            &quot;Khorne cares not from whence the blood flows, only that it flows without cease.&quot;
          </p>
        </div>

        {/* Lore Cards */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Flame className="w-7 h-7 text-red-600" />
            <h2 className="text-3xl font-black text-red-500 uppercase tracking-wide">The Way of Khorne</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {KHORNE_LORE.map((lore, i) => (
              <div
                key={i}
                className="border border-red-900/40 bg-red-950/20 rounded-lg p-5 backdrop-blur-sm"
              >
                <Droplets className="w-5 h-5 text-red-700 mb-3" />
                <p className="text-red-200/80 italic text-sm leading-relaxed">&quot;{lore}&quot;</p>
              </div>
            ))}
          </div>
        </section>

        {/* Unit Roster */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Swords className="w-7 h-7 text-red-600" />
            <h2 className="text-3xl font-black text-red-500 uppercase tracking-wide">Kill Team Roster</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {KHORNE_UNITS.map((unit) => (
              <div
                key={unit.name}
                className="border border-red-900/40 bg-gradient-to-br from-red-950/30 to-neutral-950/50 rounded-lg p-6 backdrop-blur-sm hover:border-red-700/60 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-amber-500">{unit.name}</h3>
                  <span className="text-xs font-bold text-red-400 bg-red-900/30 px-2 py-1 rounded uppercase tracking-wider">
                    {unit.role}
                  </span>
                </div>
                <p className="text-sm text-red-200/60 mb-4">{unit.desc}</p>

                {/* Stats */}
                <div className="flex gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-amber-700" />
                    <span className="text-amber-500 font-semibold">{unit.wounds} W</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-red-300/60">{unit.movement} move</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {unit.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-medium text-red-300 bg-red-900/40 border border-red-800/30 px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tactical Ploys */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Crosshair className="w-7 h-7 text-red-600" />
            <h2 className="text-3xl font-black text-red-500 uppercase tracking-wide">Tactical Ploys</h2>
          </div>
          <div className="space-y-3">
            {TACTICAL_PLOYS.map((ploy) => (
              <div
                key={ploy.name}
                className="border border-red-900/40 bg-red-950/20 rounded-lg p-5 backdrop-blur-sm flex flex-col md:flex-row md:items-start gap-4"
              >
                <div className="shrink-0">
                  <span className="text-xs font-black text-amber-500 bg-amber-900/30 border border-amber-800/30 px-3 py-1.5 rounded uppercase">
                    {ploy.cost}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-amber-500 text-lg mb-1">{ploy.name}</h3>
                  <p className="text-sm text-red-200/60 leading-relaxed">{ploy.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="text-center border border-red-900/40 bg-gradient-to-br from-red-950/30 to-neutral-950/50 rounded-lg p-12 backdrop-blur-sm">
          <Skull className="w-10 h-10 text-red-600 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-red-500 uppercase mb-3">Claim Your Skull Tally</h2>
          <p className="text-red-200/60 mb-8 max-w-lg mx-auto">
            Bring your World Eaters to Warehouse 41. Open play every Tuesday.
            League matches every Thursday. The Blood God demands tribute.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/shop?category=KILL_TEAM"
              className="bg-red-700 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-colors"
            >
              Arm Yourself
            </Link>
            <Link
              href="/killteam"
              className="border border-amber-700 text-amber-600 hover:bg-amber-700 hover:text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-colors"
            >
              Back to Kill Team
            </Link>
          </div>
        </section>

        {/* Bottom blood drip decoration */}
        <div className="flex justify-center gap-8 mt-16 opacity-30">
          <Droplets className="w-5 h-5 text-red-800" />
          <Skull className="w-5 h-5 text-red-800" />
          <Droplets className="w-5 h-5 text-red-800" />
        </div>
      </div>
    </div>
  );
}
