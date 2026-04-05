export const MTG_FORMATS = [
  "Standard",
  "Pioneer",
  "Modern",
  "Legacy",
  "Pauper",
  "cEDH",
] as const;

export const MTG_TABLES = ["Table 1", "Table 2", "Table 3", "Table 4"] as const;

export const TIME_SLOTS = [
  "11:00-14:00",
  "14:00-17:00",
  "17:00-20:00",
  "20:00-23:00",
] as const;

export const TIME_SLOT_LABELS: Record<string, string> = {
  "11:00-14:00": "11 AM – 2 PM",
  "14:00-17:00": "2 PM – 5 PM",
  "17:00-20:00": "5 PM – 8 PM",
  "20:00-23:00": "8 PM – 11 PM",
};

export const REGULAR_SLOT_PRICE = 5;   // $5 per seat

// Day-of-week (0=Sun … 6=Sat) → featured formats
export const SPECIAL_NIGHTS: Record<number, string[]> = {
  3: ["Legacy"],   // Wednesday
  5: ["cEDH"],     // Friday
};

export const SPECIAL_NIGHT_LABELS: Record<number, string> = {
  3: "Wednesday — Legacy Night",
  5: "Friday — Commander / cEDH Night",
};

const SLOT_SET = new Set<string>(TIME_SLOTS);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ValidationResult =
  | { valid: true }
  | { valid: false; error: string };

/** Time-slot-only MTG booking: date, timeSlot, customerName, customerEmail. Table/format optional. */
export function validateMTGBooking(data: Record<string, unknown>): ValidationResult {
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

  // timeSlot
  if (typeof data.timeSlot !== "string" || !SLOT_SET.has(data.timeSlot)) {
    return { valid: false, error: "timeSlot must be a valid time slot" };
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
