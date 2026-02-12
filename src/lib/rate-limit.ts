const rateMap = new Map<string, { count: number; resetAt: number }>();

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateMap) {
    if (val.resetAt < now) rateMap.delete(key);
  }
}, 5 * 60 * 1000);

export function rateLimit(
  ip: string,
  { windowMs = 60_000, max = 10 }: { windowMs?: number; max?: number } = {}
): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || entry.resetAt < now) {
    rateMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: max - 1 };
  }

  entry.count++;
  if (entry.count > max) {
    return { success: false, remaining: 0 };
  }

  return { success: true, remaining: max - entry.count };
}
