import { useEffect, useState } from "react";
import { info } from "@/data/info";
import { cn } from "@/lib/cn";
import { useReveal } from "@/lib/useReveal";
import { useTypewriter } from "@/lib/useTypewriter";

interface Command {
  /** Short label shown in the history chips. */
  chip: string;
  command: string;
  output: string[];
}

const COMMANDS: Command[] = [
  {
    chip: "whoami",
    command: info.terminal.command,
    output: info.terminal.output,
  },
  {
    chip: "stack",
    command: "cat stack.json",
    output: [
      "backend: ASP.NET Core, C#, Entity Framework Core, SQL Server",
      "frontend: React 19, TypeScript, Tailwind CSS 4",
      "mobile: Flutter, Dart, Android SDK",
      "ai & ml: Python, NumPy, Scikit-learn, Computer Vision",
    ],
  },
  {
    chip: "contact",
    command: "curl -s api/contact",
    output: [
      `whatsapp: +967 774 446 941 (https://wa.me/967774446941)`,
      `email: ${info.email}`,
      `location: ${info.location} (UTC+3)`,
      `github: https://github.com/${info.handle}`,
      `tabib: https://tabib.bond (clinic management)`,
    ],
  },
];

/** How long an answer stays on screen before the session moves on. */
const HOLD_MS = 4200;

/**
 * The hero's shell — a session, not a window. No title bar, no tab strip,
 * no shadow: a hairline hangs the column off a live prompt that types its
 * own commands, holds the answer, and moves on. The chips at the bottom
 * read like shell history — click one to jump the session there.
 */
export function Shell() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.35);
  const [active, setActive] = useState(0);
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const current = COMMANDS[active];
  const { text: typedCommand, done } = useTypewriter(
    visible ? current.command : "",
  );

  // The session runs itself: once the answer lands, hold, then move on.
  // Reduced-motion users keep a still frame and drive it with the chips.
  useEffect(() => {
    if (!visible || !done || reduced) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActive((index) => (index + 1) % COMMANDS.length);
    }, HOLD_MS);

    return () => window.clearTimeout(timer);
  }, [visible, done, reduced, active]);

  return (
    <div ref={ref} className="border-l border-border-muted pl-5 sm:pl-6">
      <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.16em] text-fg-muted uppercase">
        <span className="flex items-center gap-2">
          <span className="size-1.5 bg-accent animate-pulse" aria-hidden="true" />
          live session · bash
        </span>
        <span aria-hidden="true">31×12</span>
      </div>

      <div className="relative mt-4 min-h-[10rem] overflow-hidden">
        <div className="relative">
          <p className="font-mono text-sm text-fg">
            <span className="text-fg-muted">$</span> {typedCommand}
            <span
              className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-fg animate-blink"
              aria-hidden="true"
            />
          </p>

          <div className="mt-3 space-y-1.5">
            {current.output.map((line, index) => (
              <p
                key={line}
                className={cn(
                  "font-mono text-sm leading-relaxed text-fg-secondary transition-all duration-300",
                  done ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                )}
                style={{ transitionDelay: `${100 * (index + 1)}ms` }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* CRT scanlines drifting over the "screen" */}
        <div
          className="scanlines pointer-events-none absolute inset-0"
          aria-hidden="true"
        />
      </div>

      {/* History chips — the session's past commands, not window tabs */}
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px]">
        {COMMANDS.map((cmd, index) => (
          <button
            key={cmd.chip}
            type="button"
            onClick={() => setActive(index)}
            className={cn(
              "transition-colors",
              index === active
                ? "text-fg underline decoration-accent decoration-2 underline-offset-4"
                : "text-fg-muted hover:text-fg",
            )}
          >
            <span className="text-fg-muted">$</span> {cmd.chip}
          </button>
        ))}
      </div>
    </div>
  );
}
