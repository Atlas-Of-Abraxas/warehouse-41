import Link from "next/link";
import { Skull, Bug, Shield, Droplets, FlaskConical, Biohazard, Heart } from "lucide-react";

const NURGLE_UNITS = [
  {
    name: "Plague Champion",
    role: "Leader",
    wounds: 16,
    movement: "2⬡",
    skills: ["Grandfather's Blessing", "Plague Sword", "Blight Grenades"],
    desc: "Bloated champion of decay. Grants nearby allies a 5+ feel-no-pain. Carries blight grenades that leave lingering toxic clouds.",
  },
  {
    name: "Plague Marine (Gunner)",
    role: "Heavy Support",
    wounds: 14,
    movement: "2⬡",
    skills: ["Plague Spewer", "Disgustingly Resilient"],
    desc: "Wields a plague spewer — auto-hitting torrent weapon that ignores cover. Slow but devastating at close range.",
  },
  {
    name: "Plague Marine (Fighter)",
    role: "Assault",
    wounds: 14,
    movement: "2⬡",
    skills: ["Bubotic Axe", "Disgustingly Resilient", "Toxic Strike"],
    desc: "Melee specialist with a bubotic axe. Wounds that aren't killed take additional mortal wound at end of turn from infection.",
  },
  {
    name: "Plague Marine (Warrior)",
    role: "Warrior",
    wounds: 14,
    movement: "2⬡",
    skills: ["Boltgun", "Disgustingly Resilient", "Plague Knife"],
    desc: "Standard Plague Marine. Incredibly hard to kill. Shrugs off wounds that would fell lesser warriors. The backbone of the team.",
  },
  {
    name: "Plague Marine (Icon Bearer)",
    role: "Icon Bearer",
    wounds: 14,
    movement: "2⬡",
    skills: ["Icon of Despair", "Disgustingly Resilient", "Miasma"],
    desc: "Carries the Icon of Nurgle. Enemies within 3⬡ suffer -1 to hit from the choking miasma of decay.",
  },
  {
    name: "Poxwalker Swarm",
    role: "Swarm",
    wounds: 7,
    movement: "2⬡",
    skills: ["Mindless", "Diseased Claws", "Curse of the Walking Pox"],
    desc: "Shambling plague zombies. Weak individually, but enemies killed by them rise again as new Poxwalkers. Cannot hold objectives.",
  },
];

const TACTICAL_PLOYS = [
  { name: "Disgustingly Resilient", cost: "0 CP", desc: "Passive ability on all Plague Marines. Each time this operative would lose a wound, roll a D6 — on a 5+, that wound is not lost. The blessings of Grandfather Nurgle." },
  { name: "Grandfather's Gift", cost: "1 CP", desc: "Use when a friendly operative incapacitates an enemy in melee. Place a toxic cloud token on that spot. Any enemy moving through or ending activation within 1⬡ takes D3 mortal wounds." },
  { name: "Miasma of Pestilence", cost: "1 CP", desc: "Use at the start of the turning point. Pick one friendly operative — until next turning point, enemies targeting it with shooting subtract 1 from their hit rolls." },
  { name: "Virulent Discharge", cost: "2 CP", desc: "Use when a friendly Plague Marine is incapacitated. Every enemy within 2⬡ takes D3 mortal wounds as the warrior's body erupts in a fountain of infectious bile." },
  { name: "The Walking Pox", cost: "1 CP", desc: "Use when a Poxwalker incapacitates an enemy. Add a new Poxwalker operative to your kill team, placed within 1⬡ of the slain enemy. The cycle of decay continues." },
];

const NURGLE_LORE = [
  "Nurgle is the Chaos God of decay, disease, and entropy. He loves all living things — and shows that love through plague.",
  "The Death Guard are Nurgle's greatest champions. Once noble Space Marines, they embraced rot to become immortal.",
  "Grandfather Nurgle is strangely jovial. His followers feel no pain, only gratitude for the gifts of pestilence he bestows.",
  "In Nurgle's Garden, every disease ever conceived blooms in magnificent splendor. His daemons tend these plagues with loving care.",
  "The Death Guard do not hurry. They do not need to. Decay comes to all things in time. They are patient, inevitable, eternal.",
];

const CONTAGIONS = [
  { name: "Nurgle's Rot", effect: "At end of each turning point, each enemy within 2⬡ of a Plague Marine rolls a D6. On a 1, they take 1 mortal wound.", severity: "Passive" },
  { name: "Blight Grenade", effect: "Throw within 6⬡. Creates a 2⬡ toxic cloud that lasts until end of next turning point. Enemies inside take D3 mortal wounds on activation.", severity: "Active" },
  { name: "Plague Spewer", effect: "Torrent weapon: auto-hits, ignores cover. 4 attacks, 3/4 damage. Short range but devastating against clustered enemies.", severity: "Weapon" },
  { name: "Toxic Miasma", effect: "Icon Bearer aura. Enemies within 3⬡ suffer -1 to hit rolls. Stacks with Miasma of Pestilence ploy for -2 total.", severity: "Aura" },
];

function severityColor(s: string) {
  if (s === "Passive") return "text-green-500";
  if (s === "Active") return "text-yellow-400";
  if (s === "Weapon") return "text-orange-400";
  return "text-emerald-400";
}

export default function NurglePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Toxic mist background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Top-left sickly green mist */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #2d5a1e 0%, #1a3a10 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Bottom-right decay cloud */}
        <div
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-12"
          style={{
            background: "radial-gradient(circle, #4a3a1a 0%, #2a2010 40%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        {/* Center toxic haze */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-6"
          style={{
            background: "radial-gradient(ellipse, #3a5a2a 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Dripping slime effects */}
        <div className="absolute top-0 left-[20%] w-3 h-32 opacity-15" style={{ background: "linear-gradient(to bottom, #4a6a2a, #2a4a1a 60%, transparent)", borderRadius: "0 0 50% 50%", filter: "blur(2px)" }} />
        <div className="absolute top-0 right-[30%] w-4 h-48 opacity-12" style={{ background: "linear-gradient(to bottom, #3a5a1a, #1a3a0a 50%, transparent)", borderRadius: "0 0 50% 50%", filter: "blur(3px)" }} />
        <div className="absolute top-0 left-[55%] w-2 h-20 opacity-20" style={{ background: "linear-gradient(to bottom, #5a7a2a, transparent)", borderRadius: "0 0 50% 50%", filter: "blur(1px)" }} />
        {/* Bubbling pustules */}
        <div className="absolute top-[25%] left-[10%] w-6 h-6 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #6a8a2a, #3a5a1a)", filter: "blur(3px)" }} />
        <div className="absolute top-[55%] right-[15%] w-8 h-8 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #8a7a2a, #4a3a1a)", filter: "blur(4px)" }} />
        <div className="absolute bottom-[30%] left-[35%] w-5 h-5 rounded-full opacity-12" style={{ background: "radial-gradient(circle, #5a7a3a, #2a4a1a)", filter: "blur(2px)" }} />
        <div className="absolute top-[70%] left-[70%] w-10 h-10 rounded-full opacity-8" style={{ background: "radial-gradient(circle, #7a6a1a, #3a3010)", filter: "blur(5px)" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Biohazard className="w-12 h-12 text-green-600" />
            <Bug className="w-8 h-8 text-green-800 -mt-4" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">
            <span className="text-green-600">EMBRACE</span>{" "}
            <span className="text-amber-700">THE</span>{" "}
            <span className="text-green-600">DECAY</span>
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-amber-600 tracking-widest uppercase mb-6">
            Grandfather Nurgle Loves You
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-green-700 to-transparent mx-auto mb-8" />
          <p className="text-lg text-green-300/60 max-w-2xl mx-auto italic">
            &quot;Do not despair. Grandfather Nurgle has a gift for you. Accept it, and you will never feel pain again.&quot;
          </p>
        </div>

        {/* Lore Cards */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-7 h-7 text-green-600" />
            <h2 className="text-3xl font-black text-green-500 uppercase tracking-wide">The Garden of Nurgle</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {NURGLE_LORE.map((lore, i) => (
              <div
                key={i}
                className="border border-green-900/40 bg-green-950/20 rounded-lg p-5 backdrop-blur-sm"
              >
                <Bug className="w-5 h-5 text-green-700 mb-3" />
                <p className="text-green-200/70 italic text-sm leading-relaxed">&quot;{lore}&quot;</p>
              </div>
            ))}
          </div>
        </section>

        {/* Unit Roster */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-7 h-7 text-green-600" />
            <h2 className="text-3xl font-black text-green-500 uppercase tracking-wide">Death Guard Kill Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NURGLE_UNITS.map((unit) => (
              <div
                key={unit.name}
                className="border border-green-900/40 bg-gradient-to-br from-green-950/30 to-neutral-950/50 rounded-lg p-6 backdrop-blur-sm hover:border-green-700/60 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-amber-500">{unit.name}</h3>
                  <span className="text-xs font-bold text-green-400 bg-green-900/30 px-2 py-1 rounded uppercase tracking-wider">
                    {unit.role}
                  </span>
                </div>
                <p className="text-sm text-green-200/50 mb-4">{unit.desc}</p>

                {/* Stats */}
                <div className="flex gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-amber-700" />
                    <span className="text-amber-500 font-semibold">{unit.wounds} W</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-green-300/50">{unit.movement} move</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {unit.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-medium text-green-300 bg-green-900/40 border border-green-800/30 px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contagions & Weapons */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <FlaskConical className="w-7 h-7 text-green-600" />
            <h2 className="text-3xl font-black text-green-500 uppercase tracking-wide">Contagions & Plagues</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CONTAGIONS.map((c) => (
              <div
                key={c.name}
                className="border border-green-900/40 bg-green-950/20 rounded-lg p-5 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-amber-500 text-lg">{c.name}</h3>
                  <span className={`text-xs font-bold uppercase tracking-wider ${severityColor(c.severity)}`}>
                    {c.severity}
                  </span>
                </div>
                <p className="text-sm text-green-200/50 leading-relaxed">{c.effect}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tactical Ploys */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Droplets className="w-7 h-7 text-green-600" />
            <h2 className="text-3xl font-black text-green-500 uppercase tracking-wide">Tactical Ploys</h2>
          </div>
          <div className="space-y-3">
            {TACTICAL_PLOYS.map((ploy) => (
              <div
                key={ploy.name}
                className="border border-green-900/40 bg-green-950/20 rounded-lg p-5 backdrop-blur-sm flex flex-col md:flex-row md:items-start gap-4"
              >
                <div className="shrink-0">
                  <span className="text-xs font-black text-amber-500 bg-amber-900/30 border border-amber-800/30 px-3 py-1.5 rounded uppercase">
                    {ploy.cost}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-amber-500 text-lg mb-1">{ploy.name}</h3>
                  <p className="text-sm text-green-200/50 leading-relaxed">{ploy.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="text-center border border-green-900/40 bg-gradient-to-br from-green-950/30 to-neutral-950/50 rounded-lg p-12 backdrop-blur-sm">
          <Biohazard className="w-10 h-10 text-green-600 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-green-500 uppercase mb-3">Join the Plague Host</h2>
          <p className="text-green-200/50 mb-8 max-w-lg mx-auto">
            Bring your Death Guard to Warehouse 41. Slow, relentless, unkillable.
            Grandfather Nurgle rewards patience and endurance above all.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/shop?category=KILL_TEAM"
              className="bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-colors"
            >
              Spread the Plague
            </Link>
            <Link
              href="/killteam"
              className="border border-amber-700 text-amber-600 hover:bg-amber-700 hover:text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-colors"
            >
              Back to Kill Team
            </Link>
          </div>
        </section>

        {/* Bottom decoration */}
        <div className="flex justify-center gap-8 mt-16 opacity-30">
          <Bug className="w-5 h-5 text-green-800" />
          <Biohazard className="w-5 h-5 text-green-800" />
          <Bug className="w-5 h-5 text-green-800" />
        </div>
      </div>
    </div>
  );
}
