export const KILL_TEAMS = [
  { team: "Nemesis Claw", faction: "Night Lords", image: "/gallery/teams/nemesis-claw.jpg", blurb: "Drawn from the most psychotic killers of the Night Lords Traitor Legion, a Nemesis Claw achieves its objectives through obscene violence and naked terror. Masters of ambush and darkness, they flay their victims alive or pick them off from range, slinking through the shadows to spread dread before the killing blow falls." },
  { team: "Fellgore Ravagers", faction: "Slaves to Darkness", image: "/gallery/teams/fellgore-ravagers.jpg", blurb: "The mightiest of the mutant Beastmen sworn to the Dark Gods, Fellgore Ravagers believe themselves Chaos's favoured. Strong, savage and enduring, they stalk space hulks, underhives and warp-tainted ruins, using keen animal senses to track unsuspecting prey through the dark before butchering their foes with braying, frenzied glee." },
  { team: "Death Guard", faction: "Nurgle", image: "/gallery/teams/death-guard.jpg", blurb: "Corrupted sons of Mortarion, these Plague Marines are bloated with rot and blessed by Nurgle, the Plague God. Slow but horrifyingly resilient, their cracked, rusted armour shrugs off wounds that would fell any other warrior. They trudge inexorably toward their objectives, spreading contagion and unleashing hails of poisoned boltfire." },
  { team: "Angels of Death", faction: "Space Marines", image: "/gallery/teams/angels-of-death.jpg", blurb: "Genetically engineered transhuman warriors, Space Marines are among Humanity's most elite soldiers. An Angels of Death strike team gathers specialists trained in myriad forms of war, equally lethal at range or in brutal close combat. Resilient, relentless and tactically flexible, they are built to overcome almost any foe." },
  { team: "Phobos Strike Team", faction: "Space Marines", image: "/gallery/teams/phobos-strike-team.jpg", blurb: "Clad in lightweight Phobos armour built for stealth and speed, these Infiltrator and Incursor Space Marines specialise in fighting behind enemy lines. Masters of hit-and-run, guerrilla-style warfare, they strike swiftly with overwhelming coordination, then melt back into the shadows before the enemy can retaliate." },
  { team: "Goremongers of Khorne", faction: "Khorne", image: "/gallery/teams/goremongers-of-khorne.jpg", blurb: "Eight savage warriors who witnessed a Bloodletter in battle and survived, the Goremongers are obsessed with becoming perfect killers in Khorne's image. They graft mechanical legs onto their bodies and inject daemon-blood stimms, wielding chainblades and cleavers. Unlike mindless berserkers, they butcher with cold, lucid, tactical precision." },
  { team: "Wrecka Krew", faction: "Orks", image: "/gallery/teams/wrecka-krew.jpg", blurb: "An ad-hoc alliance of Ork Tankbustas and Breaka Boyz, a Wrecka Krew lives for explosive destruction. Armed with wildly inaccurate rokkit launchas, pneumatic knucklebustas and volatile tankhammers, they smash straight through walls and grow faster and deadlier as the din of battle swells, bound more by rivalry than cooperation." },
  { team: "Hierotek Circle", faction: "Necrons", image: null, blurb: "Deathless warriors of the xenos Necrons, a Hierotek Circle is gathered to serve the arcane agendas of its Cryptek master. Forged from living metal, these elite soldiers heal between fights and can rise again after being struck down. Patient and relentless, they hunt ancient technology and the enemies of their dynasty." },
  { team: "Inquisitorial Agents", faction: "Ordo Xenos", image: "/gallery/teams/inquisitorial-agents.jpg", blurb: "A clandestine band of acolytes and henchmen serving an Inquisitor of the Ordo Xenos, dispatched to root out alien infiltration and heresy where the Imperium's armies are too slow. Backed by gun servitors and tome-skulls, this versatile, varied warband blends faith, firepower and forbidden xenos lore to safeguard Mankind." },
  { team: "Death Korps", faction: "Astra Militarum", image: "/gallery/teams/death-korps.jpg", blurb: "The Death Korps of Krieg are grim, unquestioningly loyal Astra Militarum soldiers who march into the meat grinder without thought for their own lives. Veteran specialists hardened by siege warfare and the worst conditions imaginable, they fight in disciplined numbers, following their Watchmaster's orders to grind down any foe." },
  { team: "Vespid Stingwings", faction: "T'au Empire", image: "/gallery/teams/vespid-stingwings.jpg", blurb: "Insectoid alien auxiliaries of the T'au Empire, the Vespid Stingwings are agile fliers deployed for covert operations demanding aerial superiority. Directed by a Strain Leader who relays their handler's commands, they soar above the killzone and rain down deadly neutron weaponry, blending swarming manoeuvrability with sudden, precise lethality." },
] as const;

export const TERRAIN_SETS = [
  {
    name: "Volkus",
    description: "Industrial multi-level terrain with walkways, pipes, and vantage points.",
    images: [
      "/gallery/terrain/volkus-1.jpg",
      "/gallery/terrain/volkus-2.jpg",
      "/gallery/terrain/volkus-3.jpg",
      "/gallery/terrain/volkus-4.jpg",
    ],
  },
  {
    name: "Starter Set Terrain",
    description: "Versatile scatter terrain with barricades and ruins. Great for balanced games.",
    images: [
      "/gallery/terrain/starter-set-1.jpg",
      "/gallery/terrain/starter-set-2.jpg",
    ],
  },
  // Tombworld is unfinished — hidden until ready. Restore to re-enable on the page, booking form, and validation.
  // { name: "Tombworld", description: "Necron-themed terrain with monoliths and ancient structures. Eerie atmosphere.", images: [] },
] as const;

export const SCHEDULE_DAYS = [1, 2, 3, 6] as const; // Mon, Tue, Wed, Sat
export const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Saturday"] as const;
export const TIME_SLOTS = ["11:00-15:00", "16:00-20:00"] as const;
export const TIME_SLOT_LABELS: Record<string, string> = {
  "11:00-15:00": "11 AM \u2013 3 PM",
  "16:00-20:00": "4 PM \u2013 8 PM",
};

const TEAM_NAMES: Set<string> = new Set(KILL_TEAMS.map((t) => t.team));
const TERRAIN_NAMES: Set<string> = new Set(TERRAIN_SETS.map((t) => t.name));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ValidationResult =
  | { valid: true }
  | { valid: false; error: string };

export function validateKillTeamBooking(data: Record<string, unknown>): ValidationResult {
  // date
  if (!data.date || typeof data.date !== "string" || isNaN(Date.parse(data.date))) {
    return { valid: false, error: "date must be a valid date string" };
  }
  const date = new Date(data.date);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  if (date < now) {
    return { valid: false, error: "date cannot be in the past" };
  }
  const day = date.getUTCDay();
  if (!(SCHEDULE_DAYS as readonly number[]).includes(day)) {
    return { valid: false, error: "Kill Team tables are only available Monday, Tuesday, Wednesday, and Saturday" };
  }

  // timeSlot
  if (typeof data.timeSlot !== "string" || !(TIME_SLOTS as readonly string[]).includes(data.timeSlot)) {
    return { valid: false, error: "timeSlot must be '11:00-15:00' or '16:00-20:00'" };
  }

  // terrain
  if (typeof data.terrain !== "string" || !TERRAIN_NAMES.has(data.terrain)) {
    return { valid: false, error: "terrain must be a valid terrain set name" };
  }

  // teams
  if (!Array.isArray(data.teams) || data.teams.length < 1 || data.teams.length > 2) {
    return { valid: false, error: "teams must be an array of 1-2 team names" };
  }
  for (const t of data.teams) {
    if (typeof t !== "string" || !TEAM_NAMES.has(t)) {
      return { valid: false, error: `Invalid team name: ${t}` };
    }
  }
  if (new Set(data.teams).size !== data.teams.length) {
    return { valid: false, error: "Duplicate team selections are not allowed" };
  }

  // customerName
  if (typeof data.customerName !== "string" || data.customerName.trim().length === 0) {
    return { valid: false, error: "customerName is required" };
  }
  if (data.customerName.length > 200) {
    return { valid: false, error: "customerName must be at most 200 characters" };
  }

  // customerEmail
  if (typeof data.customerEmail !== "string" || !EMAIL_RE.test(data.customerEmail)) {
    return { valid: false, error: "customerEmail must be a valid email address" };
  }

  return { valid: true };
}
