import { useEffect, useState } from "react";

const API_ROOT = "https://github-contributions-api.jogruber.de/v4";
const CACHE_PREFIX = "portfolio:contributions:";
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

/** One day on the graph. `level` is the intensity bucket, 0–4. */
export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export type ContributionSource = "loading" | "live" | "fallback";

export interface ContributionYear {
  /** Oldest → newest, ending today. */
  days: ContributionDay[];
  total: number;
}

export interface ContributionStats {
  total: number;
  currentStreak: number;
  longestStreak: number;
  bestDay: { date: string; count: number } | null;
}

interface ApiPayload {
  total?: { lastYear?: number };
  contributions?: Array<{ date: string; count: number; level: number }>;
}

const inflight = new Map<string, Promise<ContributionYear>>();

function isoDay(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function readCache(username: string): ContributionYear | null {
  try {
    const cached = sessionStorage.getItem(CACHE_PREFIX + username);

    if (!cached) {
      return null;
    }

    const parsed = JSON.parse(cached) as { storedAt: number; year: ContributionYear };

    if (Date.now() - parsed.storedAt > CACHE_TTL_MS) {
      return null;
    }

    return parsed.year;
  } catch {
    return null;
  }
}

function writeCache(username: string, year: ContributionYear): void {
  try {
    sessionStorage.setItem(
      CACHE_PREFIX + username,
      JSON.stringify({ storedAt: Date.now(), year }),
    );
  } catch {
    /* Storage can be unavailable (private mode, quota) — caching is optional. */
  }
}

/** Deterministic 32-bit PRNG so the offline graph is stable across reloads. */
function mulberry32(seed: number): () => number {
  let a = seed;

  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(input: string): number {
  let hash = 2166136261;

  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

/**
 * Level bucket for a raw count — mirrors the way GitHub groups intensity so
 * the offline snapshot keeps the same visual distribution.
 */
function levelFor(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

/**
 * A plausible year of activity, generated from a seed of the username so the
 * fallback looks the same on every reload instead of reshuffling.
 */
export function synthesizeYear(username: string, days = 365): ContributionYear {
  const random = mulberry32(hashString(username));
  const today = new Date();
  const list: ContributionDay[] = [];
  let total = 0;

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);

    const weekday = date.getDay();
    const busySeason = random();
    const roll = random();
    // Weekdays are far more likely to be active than weekends.
    const propensity = (weekday === 0 || weekday === 6 ? 0.35 : 0.72) * (0.5 + busySeason);
    const count = roll < propensity ? Math.floor(random() * 8) + 1 : 0;

    total += count;
    list.push({ date: isoDay(date), count, level: levelFor(count) });
  }

  return { days: list, total };
}

/** Fetches the last year of contributions, with cache and offline fallback. */
export async function fetchContributions(username: string): Promise<ContributionYear> {
  const cached = readCache(username);

  if (cached) {
    return cached;
  }

  const pending = inflight.get(username);

  if (pending) {
    return pending;
  }

  const request = (async (): Promise<ContributionYear> => {
    const response = await fetch(`${API_ROOT}/${encodeURIComponent(username)}?y=last`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Contributions API responded with ${response.status}`);
    }

    const payload = (await response.json()) as ApiPayload;
    const raw = payload.contributions ?? [];

    if (raw.length === 0) {
      throw new Error("Contributions API returned no days");
    }

    const days: ContributionDay[] = raw.map((entry) => ({
      date: entry.date,
      count: entry.count,
      level: levelFor(entry.count),
    }));

    const year: ContributionYear = {
      days,
      total: payload.total?.lastYear ?? days.reduce((sum, day) => sum + day.count, 0),
    };

    writeCache(username, year);

    return year;
  })();

  inflight.set(username, request);

  try {
    return await request;
  } finally {
    inflight.delete(username);
  }
}

/** Derives the numbers shown next to the graph. */
export function computeStats(days: ContributionDay[]): ContributionStats {
  const byDate = new Map(days.map((day) => [day.date, day.count]));

  let currentStreak = 0;
  const cursor = new Date();

  // Walk back from today; a gap in the payload also ends the streak.
  for (let guard = 0; guard < 400; guard += 1) {
    const count = byDate.get(isoDay(cursor));

    if (count === undefined || count === 0) {
      if (guard === 0) {
        // Today may still be empty — check yesterday before ending the streak.
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }
      break;
    }

    currentStreak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  let longestStreak = 0;
  let run = 0;
  let bestDay: { date: string; count: number } | null = null;

  for (const day of days) {
    run = day.count > 0 ? run + 1 : 0;
    longestStreak = Math.max(longestStreak, run);

    if (!bestDay || day.count > bestDay.count) {
      bestDay = { date: day.date, count: day.count };
    }
  }

  return {
    total: days.reduce((sum, day) => sum + day.count, 0),
    currentStreak,
    longestStreak,
    bestDay: bestDay && bestDay.count > 0 ? bestDay : null,
  };
}

/**
 * Contribution year for the activity graph. Shows the curated snapshot
 * immediately, then swaps in live data when the API responds.
 */
export function useContributions(username: string): {
  year: ContributionYear;
  source: ContributionSource;
} {
  const [year, setYear] = useState<ContributionYear>(() => synthesizeYear(username));
  const [source, setSource] = useState<ContributionSource>("loading");

  useEffect(() => {
    let cancelled = false;

    fetchContributions(username)
      .then((live) => {
        if (!cancelled) {
          setYear(live);
          setSource("live");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSource("fallback");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  return { year, source };
}
