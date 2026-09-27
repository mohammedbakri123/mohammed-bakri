import { computeStats, useContributions } from "@/data/contributions";
import { info } from "@/data/info";
import { FIG } from "@/lib/figures";
import { Figure } from "./ui/Figure";
import { ContributionGraph } from "./ui/ContributionGraph";
import { Section } from "./ui/Section";

const LEGEND_LEVELS = ["bg-cal-0", "bg-cal-1", "bg-cal-2", "bg-cal-3", "bg-cal-4"];

const BEST_DAY_FORMAT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

const GITHUB_URL = `https://github.com/${info.github.username}`;

function formatDay(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return BEST_DAY_FORMAT.format(new Date(year, (month ?? 1) - 1, day ?? 1));
}

/**
 * Activity — a year of GitHub contributions, the record behind everything in
 * the projects section below it.
 */
export function Activity() {
  const { year, source } = useContributions(info.github.username);
  const stats = computeStats(year.days);

  const items = [
    { value: stats.total.toLocaleString("en-US"), label: "contributions last year" },
    { value: `${stats.currentStreak}`, label: "day current streak" },
    { value: `${stats.longestStreak}`, label: "day longest streak" },
    {
      value: stats.bestDay ? formatDay(stats.bestDay.date) : "—",
      label: stats.bestDay ? `busiest day · ${stats.bestDay.count} commits` : "no activity yet",
    },
  ];

  return (
    <Section
      id="activity"
      label="activity"
      title="In the loop"
      description="A year of daily commits and reviews — the honest record behind the projects below."
    >
      <div className="rounded-[4px] border border-border-muted bg-bg p-4 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4 sm:gap-x-12">
            {items.map((item) => (
              <div key={item.label}>
                <dd className="font-mono text-xl font-semibold text-fg sm:text-2xl">
                  {item.value}
                </dd>
                <dt className="mt-1 font-mono text-[10px] tracking-[0.16em] text-fg-muted uppercase">
                  {item.label}
                </dt>
              </div>
            ))}
          </dl>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-[4px] border border-border-muted px-3 py-1.5 font-mono text-xs text-fg-secondary transition-colors hover:border-fg hover:text-fg"
          >
            view on GitHub ↗
          </a>
        </div>

        <ContributionGraph days={year.days} className="mt-7" />

        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-border-muted pt-4">
          <Figure n={FIG.activity} className="text-fg-muted">
            {source === "live"
              ? "Live data from the GitHub contribution calendar"
              : "Offline snapshot — live data loads when the API is reachable"}
          </Figure>

          <div className="flex items-center gap-1.5 font-mono text-[10px] text-fg-muted">
            <span className="mr-1">less</span>
            {LEGEND_LEVELS.map((level) => (
              <span key={level} className={`size-[9px] rounded-[2px] ${level}`} aria-hidden="true" />
            ))}
            <span className="ml-1">more</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
