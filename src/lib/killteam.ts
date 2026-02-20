export const KILL_TEAMS = [
  { team: "Nemesis Claw", faction: "Night Lords" },
  { team: "Fellgore Ravagers", faction: "Slaves to Darkness" },
  { team: "Death Guard", faction: "Nurgle" },
  { team: "Angels of Death", faction: "Space Marines" },
  { team: "Phobos Strike Team", faction: "Space Marines" },
  { team: "Goremongers of Khorne", faction: "Khorne" },
  { team: "Wrecka Krew", faction: "Orks" },
  { team: "Hierotek Circle", faction: "Necrons" },
  { team: "Canoptek Court", faction: "Necrons" },
] as const;

export const TERRAIN_SETS = [
  { name: "Volkus", description: "Industrial multi-level terrain with walkways, pipes, and vantage points." },
  { name: "Starter Set Terrain", description: "Versatile scatter terrain with barricades and ruins. Great for balanced games." },
  { name: "Tombworld", description: "Necron-themed terrain with monoliths and ancient structures. Eerie atmosphere." },
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
