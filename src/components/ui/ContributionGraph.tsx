import { useMemo, useState } from "react";
import type { ContributionDay } from "@/data/contributions";
import { cn } from "@/lib/cn";
import { useReveal } from "@/lib/useReveal";

const LEVEL_CLASS = ["bg-cal-0", "bg-cal-1", "bg-cal-2", "bg-cal-3", "bg-cal-4"];
const WEEKDAY_LABELS: Record<number, string> = { 1: "Mon", 3: "Wed", 5: "Fri" };
const MONTH_FORMAT = new Intl.DateTimeFormat("en-US", { month: "short" });
const DAY_FORMAT = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

/** Parses "YYYY-MM-DD" as a local date — avoids UTC off-by-one shifts. */
function parseDay(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

/**
 * Splits the timeline into Sunday-first weeks, padding the front so the most
 * recent day lands on its own weekday row — the alignment GitHub uses.
 */
function buildWeeks(days: ContributionDay[]): (ContributionDay | null)[][] {
  if (days.length === 0) {
    return [];
  }

  const lastWeekday = parseDay(days[days.length - 1].date).getDay();
  const pad = (lastWeekday + 1 - (days.length % 7) + 7) % 7;
  const cells: (ContributionDay | null)[] = [
    ...Array.from<null>({ length: pad }).fill(null),
    ...days,
  ];

  const weeks: (ContributionDay | null)[][] = [];

  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }

  return weeks;
}

interface ContributionGraphProps {
  days: ContributionDay[];
  className?: string;
}

/**
 * Year-long contribution heatmap: one column per week, intensity per day.
 * Columns fade in from left to right the first time the graph is seen.
 */
export function ContributionGraph({ days, className }: ContributionGraphProps) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.1);
  const [hover, setHover] = useState<{ day: ContributionDay; x: number; y: number } | null>(
    null,
  );

  const weeks = useMemo(() => buildWeeks(days), [days]);

  const monthLabels = useMemo(() => {
    const firstDays = weeks.map((week) => week.find((day) => day !== null) ?? null);

    return firstDays.map((day, index) => {
      if (!day) {
        return null;
      }

      const previous = firstDays[index - 1];
      const month = parseDay(day.date).getMonth();

      if (previous && parseDay(previous.date).getMonth() === month) {
        return null;
      }

      return MONTH_FORMAT.format(parseDay(day.date));
    });
  }, [weeks]);

  const activeDays = days.filter((day) => day.count > 0).length;

  return (
    <div ref={ref} className={cn("terminal-scroll pb-1", className)}>
      <div
        className="min-w-max"
        role="img"
        aria-label={`Heatmap of ${days.length} days: ${activeDays} active days, most recent ${days[days.length - 1]?.date ?? ""}`}
      >
        {/* Month ruler */}
        <div className="flex pl-10">
          {monthLabels.map((label, index) => (
            <div key={`${label}-${index}`} className="relative h-[14px] w-[11px]">
              {label ? (
                <span className="absolute top-0 left-0 font-mono text-[10px] whitespace-nowrap text-fg-muted">
                  {label}
                </span>
              ) : null}
            </div>
          ))}
          <div className="w-[3px]" aria-hidden="true" />
        </div>

        <div className="mt-1 flex">
          {/* Weekday rail */}
          <div className="flex w-10 shrink-0 flex-col gap-[3px] pr-1" aria-hidden="true">
            {Array.from({ length: 7 }, (_, row) => (
              <span
                key={row}
                className="h-[11px] font-mono text-[10px] leading-[11px] text-fg-muted"
              >
                {WEEKDAY_LABELS[row] ?? ""}
              </span>
            ))}
          </div>

          {/* Cells */}
          <div className="relative flex gap-[3px]">
            {weeks.map((week, column) => (
              <div key={column} className="flex flex-col gap-[3px]">
                {week.map((day, row) =>
                  day ? (
                    <span
                      key={day.date}
                      title={`${DAY_FORMAT.format(parseDay(day.date))} · ${day.count}`}
                      onMouseEnter={(event) => {
                        const cell = event.currentTarget;
                        setHover({
                          day,
                          x: cell.offsetLeft + cell.offsetWidth / 2,
                          y: cell.offsetTop,
                        });
                      }}
                      onMouseLeave={() => setHover(null)}
                      className={cn(
                        "size-[11px] cursor-pointer transition-transform duration-150 hover:scale-[1.35]",
                        LEVEL_CLASS[day.level] ?? LEVEL_CLASS[0],
                        visible ? "animate-cell" : "opacity-0",
                      )}
                      style={visible ? { animationDelay: `${Math.min(column * 7, 420)}ms` } : undefined}
                    />
                  ) : (
                    <span key={`pad-${row}`} className="size-[11px]" aria-hidden="true" />
                  ),
                )}
              </div>
            ))}

            {hover ? (
              <div
                className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full border border-border bg-elevated px-2 py-1 font-mono text-[10px] whitespace-nowrap text-fg shadow-lg"
                style={{ left: hover.x, top: hover.y - 6 }}
              >
                {DAY_FORMAT.format(parseDay(hover.day.date))}
                <span className="text-fg-muted"> · </span>
                {hover.day.count} contribution{hover.day.count === 1 ? "" : "s"}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
