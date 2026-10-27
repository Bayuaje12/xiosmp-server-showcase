// Bansos event: every Thursday 19:00–21:00 WIB (UTC+7) = Thursday 12:00–14:00 UTC.
const START_UTC_H = 12;
const DURATION_MS = 2 * 3600_000;

export function bansosState(now: Date): { live: boolean; msLeft: number } {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), START_UTC_H));
  d.setUTCDate(d.getUTCDate() + ((4 - d.getUTCDay() + 7) % 7));
  const t = now.getTime();
  if (t >= d.getTime() && t < d.getTime() + DURATION_MS) return { live: true, msLeft: d.getTime() + DURATION_MS - t };
  if (t >= d.getTime() + DURATION_MS) d.setUTCDate(d.getUTCDate() + 7);
  return { live: false, msLeft: d.getTime() - t };
}
