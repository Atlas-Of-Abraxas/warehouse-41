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
  WARGAMING: "Wargaming",
  PAINT_SUPPLIES: "Paint & Supplies",
  RPG_BOOKS: "RPG Books",
  ACCESSORIES: "Accessories",
};

export const EVENT_TYPES: Record<string, string> = {
  MTG_TOURNAMENT: "MTG Tournament",
  WARHAMMER_LEAGUE: "Warhammer League",
  DND_NIGHT: "D&D Night",
  WOD_SESSION: "World of Darkness",
  RELEASE_EVENT: "Release Event",
  CASUAL: "Casual Play",
};

export const GAME_SYSTEMS: Record<string, string> = {
  DND: "Dungeons & Dragons",
  WOD: "World of Darkness",
  PATHFINDER: "Pathfinder",
  OTHER: "Other",
};
