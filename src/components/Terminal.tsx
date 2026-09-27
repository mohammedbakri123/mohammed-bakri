import { useState } from "react";
import { info } from "@/data/info";
import { cn } from "@/lib/cn";
import { useReveal } from "@/lib/useReveal";
import { useTypewriter } from "@/lib/useTypewriter";

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
      `whatsapp: +967 774 446 941 (https://wa.me/967774446941)`,
      `email: ${info.email}`,
      `location: ${info.location} (UTC+3)`,
      `github: https://github.com/${info.handle}`,
      `tabib: https://tabib.bond (clinic management)`,
    ],
  },
};

/**
 * Interactive terminal with real command tabs. Starts typing the moment it
 * scrolls into view, so the echo lands while you're looking at it.
 */
export function Terminal() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.35);
  const [activeTab, setActiveTab] = useState<TerminalTab>("whoami");
  const { text: typedCommand, done } = useTypewriter(
    visible ? TERMINAL_DATA[activeTab].command : "",
  );

  return (
    <div
      ref={ref}
      className="overflow-hidden border border-border-muted bg-surface shadow-2xl"
    >
      {/* Tab bar with clickable command tabs */}
      <div className="flex items-center justify-between border-b border-border-muted bg-elevated/40 px-3 py-2">
        <div className="flex items-center gap-1 font-mono text-xs">
          {(["whoami", "stack", "contact"] as TerminalTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-2.5 py-1 text-[11px] font-mono transition-colors",
                activeTab === tab
                  ? "bg-surface text-fg font-semibold border border-border-muted"
                  : "text-fg-muted hover:text-fg hover:bg-surface/50",
              )}
            >
              ${tab}
            </button>
          ))}
        </div>
        <span className="font-mono text-[10px] text-fg-disabled hidden sm:inline">
          bash · interactive
        </span>
      </div>

      <div className="terminal-scroll p-4 font-mono text-sm leading-relaxed sm:p-5">
        <p className="text-fg">
          <span className="text-fg-muted">$</span> {typedCommand}
          {visible && !done ? (
            <span
              className="ml-0.5 inline-block h-4 w-2 animate-blink bg-fg align-middle"
              aria-hidden="true"
            />
          ) : null}
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
      </div>
    </div>
  );
}
