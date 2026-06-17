export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const CATEGORIES: Record<string, string> = {
  MTG_SINGLES: "MTG Singles",
  MTG_SEALED: "MTG Sealed Product",
  KILL_TEAM: "Kill Team",
  WARGAMING: "Wargaming",
  METAL_MINIATURES: "Metal Miniatures",
  BITS: "Bits",
  PAINT_SUPPLIES: "Paint & Supplies",
  RPG_BOOKS: "RPG Books",
  ACCESSORIES: "Accessories",
};

/** Wargaming-flavored condition grades. Optional — only used on items where it matters. */
export const CONDITIONS: Record<string, string> = {
  SEALED: "Sealed",
  MINT: "Mint",
  PAINTED: "Painted",
  STRIPPED: "Stripped",
  DAMAGED: "Damaged",
};

export const PRODUCT_TYPES: Record<string, string> = {
  SINGLE: "Single",
  LOT: "Lot",
};

/** How long a sold-out item stays visible on the storefront before being hidden. */
export const SOLD_OUT_DISPLAY_HOURS = 12;

export const EVENT_TYPES: Record<string, string> = {
  MTG_TOURNAMENT: "MTG Tournament",
  KILL_TEAM: "Kill Team",
  DND_NIGHT: "D&D Night",
  WOD_SESSION: "World of Darkness",
  RELEASE_EVENT: "Release Event",
  CASUAL: "Casual Play",
};
