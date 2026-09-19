import { useState } from "react";
import { info } from "@/data/info";
import { useGitHubRepos } from "@/data/github";
import { cn } from "@/lib/cn";
import { useTypewriter } from "@/lib/useTypewriter";
import { FIG } from "@/lib/figures";
import { Figure } from "./ui/Figure";
import { PixelText } from "./ui/PixelText";

type TerminalTab = "whoami" | "stack" | "contact";

const TERMINAL_DATA: Record<TerminalTab, { command: string; output: string[] }> = {
  whoami: {
    command: "whoami",
    output: [
      "mohammed-bakri",
      "software developer · backend & ai-powered applications",
      "cs student @ sana'a university · founder of tabib",
    ],
  },
  stack: {
    command: "cat stack.json",
    output: [
      "backend: ASP.NET Core, C#, Entity Framework Core, SQL Server",
      "frontend: React 19, TypeScript, Tailwind CSS 4",
      "mobile: Flutter, Dart, Android SDK",
      "ai & ml: Python, NumPy, Scikit-learn, Computer Vision",
    ],
  },
  contact: {
    command: "curl -s api/contact",
    output: [
      `email: ${info.email}`,
      `location: ${info.location} (UTC+3)`,
      `github: https://github.com/${info.handle}`,
      `tabib: https://tabib.bond (clinic management)`,
    ],
  },
};

const TECH_BADGES = [
  "ASP.NET Core",
  "React",
  "TypeScript",
  "Python / AI",
  "Flutter",
  "SQL Server",
];

/**
 * Hero: authentic OpenCode pixel wordmark logo, role tagline,
 * interactive developer terminal with real command tabs, and live GitHub stats.
 */
export function Hero() {
  const { repos } = useGitHubRepos(info.github);
  const [activeTab, setActiveTab] = useState<TerminalTab>("whoami");
  const { text: typedCommand, done } = useTypewriter(TERMINAL_DATA[activeTab].command);

  const totalStars = repos.reduce((total, repo) => total + repo.stars, 0);

  const stats = [
    { value: String(repos.length), caption: "public repositories on GitHub", figure: FIG.repos },
    { value: String(totalStars), caption: "stars earned across projects", figure: FIG.stars },
    {
      value: String(info.featured.length),
      caption: "products shipped end-to-end",
      figure: FIG.products,
    },
  ];

  return (
    <section id="top" className="relative isolate overflow-hidden border-b border-border-muted">
      <div
        className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-20 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-14">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-fg-muted uppercase">
              <span className="text-fg-disabled">[*]</span>
              <span>{info.intro} · {info.location}</span>
            </div>

            {/* Authentic OpenCode Pixel Wordmark with Subtle Backlight Glow */}
            <div className="relative mt-5 inline-block">
              <div
                className="pointer-events-none absolute -inset-6 -z-10 blur-2xl opacity-40 bg-radial from-white/[0.08] to-transparent"
                aria-hidden="true"
              />
              <h1>
                <PixelText
                  lines={info.wordmark}
                  cell={7}
                  letterGap={1}
                  lineGap={2}
                  label={info.name}
                  className="w-full max-w-[340px] sm:max-w-[420px]"
                />
              </h1>
            </div>

            <p className="mt-6 max-w-xl font-mono text-base text-fg leading-relaxed sm:text-lg">
              {info.tagline}
            </p>

            {/* Tech Stack Chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {TECH_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="rounded-[3px] border border-border-muted bg-surface/60 px-2.5 py-0.5 font-mono text-[11px] text-fg-secondary transition-colors hover:border-fg/30 hover:text-fg"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="rounded-[4px] bg-fg px-4 py-2.5 font-mono text-xs font-medium tracking-wide text-bg transition-colors hover:bg-white"
              >
                view projects
              </a>
              <a
                href="#contact"
                className="rounded-[4px] border border-border px-4 py-2.5 font-mono text-xs font-medium tracking-wide text-fg-secondary transition-colors hover:border-fg hover:text-fg"
              >
                get in touch
              </a>
              {info.openToWork ? (
                <span className="inline-flex items-center gap-2 rounded-[4px] border border-border-muted bg-surface px-3 py-2 font-mono text-xs text-fg-secondary">
                  <span className="size-1.5 rounded-full bg-success animate-pulse" aria-hidden="true" />
                  open to work
                </span>
              ) : null}
            </div>

            <dl className="mt-12 grid gap-6 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.caption} className="border-t border-border-muted pt-4">
                  <dd className="font-mono text-2xl font-bold text-fg sm:text-3xl">{stat.value}</dd>
                  <Figure n={stat.figure} className="mt-2 text-fg-muted">
                    {stat.caption}
                  </Figure>
                </div>
              ))}
            </dl>
          </div>

          {/* Interactive OpenCode Terminal Window */}
          <div className="overflow-hidden rounded-[4px] border border-border-muted bg-surface shadow-2xl">
            {/* Terminal Header with Clickable Command Tabs */}
            <div className="flex items-center justify-between border-b border-border-muted bg-elevated/40 px-3 py-2">
              <div className="flex items-center gap-1 font-mono text-xs">
                {(["whoami", "stack", "contact"] as TerminalTab[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "rounded-[3px] px-2.5 py-1 text-[11px] font-mono transition-colors",
                      activeTab === tab
                        ? "bg-surface text-fg font-semibold border border-border-muted"
                        : "text-fg-muted hover:text-fg hover:bg-surface/50",
                    )}
                  >
                    ${tab}
                  </button>
                ))}
              </div>
              <span className="font-mono text-[10px] text-fg-disabled hidden sm:inline">bash · interactive</span>
            </div>

            <div className="terminal-scroll p-4 font-mono text-sm leading-relaxed sm:p-5">
              <p className="text-fg">
                <span className="text-fg-muted">$</span> {typedCommand}
                {done ? null : (
                  <span
                    className="ml-0.5 inline-block h-4 w-2 animate-blink bg-fg align-middle"
                    aria-hidden="true"
                  />
                )}
              </p>

              <div className="mt-3 space-y-1.5 min-h-[88px]">
                {TERMINAL_DATA[activeTab].output.map((line, index) => (
                  <p
                    key={line}
                    className={cn(
                      "text-fg-secondary transition-all duration-300",
                      done ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                    )}
                    style={{ transitionDelay: `${100 * (index + 1)}ms` }}
                  >
                    {line}
                  </p>
                ))}
              </div>

              <div className="mt-6 border-t border-border-muted pt-4 space-y-1.5">
                <p className="text-[11px] text-fg-disabled uppercase tracking-wider mb-2">Connected Profiles</p>
                {info.socials.map((social) => (
                  <a
                    key={social.url}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-4 py-1 text-xs text-fg-muted transition-colors hover:text-fg"
                  >
                    <span>
                      <span className="text-fg-disabled">[*]</span> {social.label}
                    </span>
                    <span className="truncate text-fg-disabled hover:text-fg-secondary">
                      {social.handle} ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}