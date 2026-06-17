type ValidationResult =
  | { valid: true }
  | { valid: false; error: string };

function checkString(
  value: unknown,
  field: string,
  maxLen = 500
): string | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    return `${field} is required and must be a non-empty string`;
  }
  if (value.length > maxLen) {
    return `${field} must be at most ${maxLen} characters`;
  }
  return null;
}

function checkNumber(
  value: unknown,
  field: string,
  { min, max, integer }: { min?: number; max?: number; integer?: boolean } = {}
): string | null {
  if (typeof value !== "number" || isNaN(value)) {
    return `${field} must be a number`;
  }
  if (integer && !Number.isInteger(value)) {
    return `${field} must be an integer`;
  }
  if (min !== undefined && value < min) {
    return `${field} must be at least ${min}`;
  }
  if (max !== undefined && value > max) {
    return `${field} must be at most ${max}`;
  }
  return null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALLOWED_CONDITIONS = new Set(["SEALED", "MINT", "PAINTED", "STRIPPED", "DAMAGED"]);
const ALLOWED_PRODUCT_TYPES = new Set(["SINGLE", "LOT"]);

export function validateProduct(data: Record<string, unknown>): ValidationResult {
  const err =
    checkString(data.name, "name", 200) ||
    checkString(data.description, "description", 2000) ||
    checkNumber(data.price, "price", { min: 0 }) ||
    checkString(data.category, "category", 100) ||
    checkNumber(data.stock, "stock", { min: 0, integer: true });
  if (err) return { valid: false, error: err };

  // Optional fields — only validate when present
  if (data.sku !== undefined && data.sku !== null && data.sku !== "") {
    const e = checkString(data.sku, "sku", 100);
    if (e) return { valid: false, error: e };
  }
  if (data.productType !== undefined && data.productType !== null && data.productType !== "") {
    if (typeof data.productType !== "string" || !ALLOWED_PRODUCT_TYPES.has(data.productType)) {
      return { valid: false, error: "productType must be SINGLE or LOT" };
    }
  }
  if (data.lotSize !== undefined && data.lotSize !== null) {
    const e = checkNumber(data.lotSize, "lotSize", { min: 1, max: 100000, integer: true });
    if (e) return { valid: false, error: e };
  }
  if (data.condition !== undefined && data.condition !== null && data.condition !== "") {
    if (typeof data.condition !== "string" || !ALLOWED_CONDITIONS.has(data.condition)) {
      return { valid: false, error: "condition must be SEALED, MINT, PAINTED, STRIPPED, or DAMAGED" };
    }
  }
  if (data.era !== undefined && data.era !== null && data.era !== "") {
    const e = checkString(data.era, "era", 100);
    if (e) return { valid: false, error: e };
  }
  if (data.tags !== undefined && data.tags !== null) {
    if (!Array.isArray(data.tags)) return { valid: false, error: "tags must be an array" };
    if (data.tags.length > 30) return { valid: false, error: "Too many tags (max 30)" };
    for (const t of data.tags) {
      if (typeof t !== "string" || t.length === 0 || t.length > 60) {
        return { valid: false, error: "Each tag must be a 1–60 character string" };
      }
    }
  }
  if (data.images !== undefined && data.images !== null) {
    if (!Array.isArray(data.images)) return { valid: false, error: "images must be an array" };
    if (data.images.length > 20) return { valid: false, error: "Too many images (max 20)" };
    for (const im of data.images) {
      if (typeof im !== "string" || im.length === 0 || im.length > 500) {
        return { valid: false, error: "Each image must be a non-empty URL" };
      }
    }
  }
  if (data.weight !== undefined && data.weight !== null) {
    const e = checkNumber(data.weight, "weight", { min: 0, max: 100000 });
    if (e) return { valid: false, error: e };
  }
  if (data.tcgPlayerProductId !== undefined && data.tcgPlayerProductId !== null && data.tcgPlayerProductId !== "") {
    const e = checkString(data.tcgPlayerProductId, "tcgPlayerProductId", 100);
    if (e) return { valid: false, error: e };
  }

  return { valid: true };
}

export function validateEvent(data: Record<string, unknown>): ValidationResult {
  const err =
    checkString(data.title, "title", 200) ||
    checkString(data.description, "description", 2000) ||
    checkString(data.type, "type", 100);

  if (err) return { valid: false, error: err };

  if (!data.date || isNaN(Date.parse(data.date as string))) {
    return { valid: false, error: "date must be a valid date string" };
  }

  return { valid: true };
}

export function validateSession(data: Record<string, unknown>): ValidationResult {
  const err =
    checkString(data.title, "title", 200) ||
    checkString(data.description, "description", 2000) ||
    checkString(data.gameSystem, "gameSystem", 100) ||
    checkString(data.gmName, "gmName", 200);

  if (err) return { valid: false, error: err };

  if (!data.date || isNaN(Date.parse(data.date as string))) {
    return { valid: false, error: "date must be a valid date string" };
  }

  const maxErr = checkNumber(data.maxPlayers, "maxPlayers", {
    min: 1,
    max: 100,
    integer: true,
  });
  if (maxErr) return { valid: false, error: maxErr };

  return { valid: true };
}

export function validateBooking(data: Record<string, unknown>): ValidationResult {
  const err =
    checkString(data.sessionId, "sessionId", 100) ||
    checkString(data.customerName, "customerName", 200) ||
    (typeof data.customerEmail === "string" && EMAIL_RE.test(data.customerEmail)
      ? null
      : "customerEmail must be a valid email");

  if (err) return { valid: false, error: err };

  const seatsErr = checkNumber(data.seats, "seats", { min: 1, max: 20, integer: true });
  if (seatsErr) return { valid: false, error: seatsErr };

  return { valid: true };
}

export function validateOrder(data: Record<string, unknown>): ValidationResult {
  const err =
    checkString(data.customerName, "customerName", 200) ||
    (typeof data.customerEmail === "string" && EMAIL_RE.test(data.customerEmail)
      ? null
      : "customerEmail must be a valid email");
  if (err) return { valid: false, error: err };

  if (!Array.isArray(data.items) || data.items.length === 0) {
    return { valid: false, error: "items must be a non-empty array" };
  }
  if (data.items.length > 100) {
    return { valid: false, error: "Too many items in one order" };
  }
  for (const item of data.items as unknown[]) {
    if (typeof item !== "object" || item === null) {
      return { valid: false, error: "Each item must be an object" };
    }
    const { id, quantity } = item as Record<string, unknown>;
    if (typeof id !== "string" || id.trim().length === 0) {
      return { valid: false, error: "Each item needs a product id" };
    }
    const qtyErr = checkNumber(quantity, "quantity", { min: 1, max: 999, integer: true });
    if (qtyErr) return { valid: false, error: qtyErr };
  }

  if (data.notes !== undefined && data.notes !== null) {
    const notesErr = checkString(data.notes, "notes", 1000);
    if (notesErr) return { valid: false, error: notesErr };
  }

  return { valid: true };
}

export function validateRegistration(data: Record<string, unknown>): ValidationResult {
  const nameErr = data.name !== undefined ? checkString(data.name, "name", 200) : null;
  if (nameErr) return { valid: false, error: nameErr };

  if (typeof data.email !== "string" || !EMAIL_RE.test(data.email)) {
    return { valid: false, error: "A valid email address is required" };
  }

  if (typeof data.password !== "string" || data.password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters" };
  }

  if (data.password.length > 128) {
    return { valid: false, error: "Password must be at most 128 characters" };
  }

  return { valid: true };
}

