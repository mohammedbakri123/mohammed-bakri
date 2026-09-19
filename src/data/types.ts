/**
 * Shape of everything in `info.json` plus the normalised repository record we
 * render in the projects grid.
 */

export interface SocialLink {
  label: string;
  handle: string;
  url: string;
}

export interface Fact {
  label: string;
  value: string;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface ExperienceEntry {
  role: string;
  company: string;
  url: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
}

export interface FeaturedProject {
  name: string;
  tagline: string;
  description: string;
  url: string;
  status: string;
  tags: string[];
  highlight?: boolean;
}

export interface GitHubConfig {
  username: string;
  maxProjects: number;
  includeForks: boolean;
  exclude: string[];
  preferredOrder: string[];
}

export interface TerminalIntro {
  command: string;
  output: string[];
}

export interface Info {
  name: string;
  handle: string;
  wordmark: string[];
  role: string;
  intro: string;
  location: string;
  email: string;
  avatar: string;
  openToWork: boolean;
  tagline: string;
  bio: string[];
  facts: Fact[];
  terminal: TerminalIntro;
  socials: SocialLink[];
  skills: SkillGroup[];
  experience: ExperienceEntry[];
  featured: FeaturedProject[];
  github: GitHubConfig;
  footer: { text: string };
}

/** A repository, normalised from the GitHub REST API. */
export interface GitHubRepo {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
}