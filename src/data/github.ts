import { useEffect, useState } from "react";
import { FALLBACK_REPOS } from "./fallback-repos";
import type { GitHubConfig, GitHubRepo } from "./types";

const API_ROOT = "https://api.github.com";
const CACHE_PREFIX = "portfolio:github:";
const CACHE_TTL_MS = 30 * 60 * 1000;

/** In-flight requests, so parallel sections share a single network call. */
const inflight = new Map<string, Promise<GitHubRepo[]>>();

/** Subset of the GitHub REST API's repository payload that we care about. */
interface GitHubApiRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

const LANGUAGE_COLORS: Record<string, string> = {
  "C#": "#178600",
  "C++": "#f34b7d",
  CSS: "#563d7c",
  Dart: "#00b4ab",
  Go: "#00add8",
  HTML: "#e34c26",
  Java: "#b07219",
  JavaScript: "#f1e05a",
  Kotlin: "#a97bff",
  Python: "#3572a5",
  QML: "#44a51c",
  Shell: "#89e051",
  TypeScript: "#3178c6",
  Vue: "#41b883",
};

/** Colour dot used on repository cards — mirrors GitHub's language colours. */
export function languageColor(language: string | null): string {
  if (!language) {
    return "#86868b";
  }

  return LANGUAGE_COLORS[language] ?? "#86868b";
}

/** "2026-09-06" → "Sep 2026" */
export function formatUpdated(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function toRepo(repo: GitHubApiRepo): GitHubRepo {
  return {
    name: repo.name,
    description: repo.description,
    url: repo.html_url,
    homepage: repo.homepage && repo.homepage.length > 0 ? repo.homepage : null,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    topics: repo.topics ?? [],
    updatedAt: repo.pushed_at,
  };
}

/**
 * Drops repos the owner asked to hide, then orders the rest: explicitly
 * preferred names first, then by stars, then by most recently pushed.
 */
export function selectRepos(repos: GitHubRepo[], config: GitHubConfig): GitHubRepo[] {
  const excluded = new Set(config.exclude.map((name) => name.toLowerCase()));
  const preferred = new Map(config.preferredOrder.map((name, index) => [name.toLowerCase(), index]));
  const lastIndex = Number.MAX_SAFE_INTEGER;

  return repos
    .filter((repo) => !excluded.has(repo.name.toLowerCase()))
    .sort((a, b) => {
      const rankA = preferred.get(a.name.toLowerCase()) ?? lastIndex;
      const rankB = preferred.get(b.name.toLowerCase()) ?? lastIndex;

      if (rankA !== rankB) {
        return rankA - rankB;
      }

      if (a.stars !== b.stars) {
        return b.stars - a.stars;
      }

      return b.updatedAt.localeCompare(a.updatedAt);
    })
    .slice(0, config.maxProjects);
}

function readCache(username: string): GitHubRepo[] | null {
  try {
    const cached = sessionStorage.getItem(CACHE_PREFIX + username);

    if (!cached) {
      return null;
    }

    const parsed = JSON.parse(cached) as { storedAt: number; repos: GitHubRepo[] };

    if (Date.now() - parsed.storedAt > CACHE_TTL_MS) {
      return null;
    }

    return parsed.repos;
  } catch {
    return null;
  }
}

function writeCache(username: string, repos: GitHubRepo[]): void {
  try {
    sessionStorage.setItem(
      CACHE_PREFIX + username,
      JSON.stringify({ storedAt: Date.now(), repos }),
    );
  } catch {
    /* Storage can be unavailable (private mode, quota) — caching is optional. */
  }
}

/** Fetches the public repositories for a user, filtered and ordered for display. */
export async function fetchRepos(config: GitHubConfig): Promise<GitHubRepo[]> {
  const cached = readCache(config.username);

  if (cached) {
    return cached;
  }

  // Several sections ask for the same list on first paint; share one request.
  const pending = inflight.get(config.username);

  if (pending) {
    return pending;
  }

  const request = (async () => {
    const response = await fetch(
      `${API_ROOT}/users/${config.username}/repos?per_page=100&sort=pushed`,
      { headers: { Accept: "application/vnd.github+json" } },
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const payload = (await response.json()) as GitHubApiRepo[];

    const repos = payload
      .filter((repo) => !repo.archived && (config.includeForks || !repo.fork))
      .map(toRepo);

    const selected = selectRepos(repos, config);

    writeCache(config.username, selected);

    return selected;
  })();

  inflight.set(config.username, request);

  try {
    return await request;
  } finally {
    inflight.delete(config.username);
  }
}

export type RepoSource = "loading" | "live" | "fallback";

/**
 * Repository list for the projects grid.
 *
 * Renders the curated snapshot immediately, then swaps in live GitHub data when
 * the API responds. If the request fails the snapshot simply stays put.
 */
export function useGitHubRepos(config: GitHubConfig): {
  repos: GitHubRepo[];
  source: RepoSource;
} {
  const [repos, setRepos] = useState<GitHubRepo[]>(() => selectRepos(FALLBACK_REPOS, config));
  const [source, setSource] = useState<RepoSource>("loading");

  useEffect(() => {
    let cancelled = false;

    fetchRepos(config)
      .then((live) => {
        if (!cancelled && live.length > 0) {
          setRepos(live);
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
    // `config` is a stable object imported from info.json, so this runs once.
  }, [config]);

  return { repos, source };
}