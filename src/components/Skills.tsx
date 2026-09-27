import { info } from "@/data/info";
import { FIG } from "@/lib/figures";
import { Figure } from "./ui/Figure";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";

/**
 * Skills — the stack printed as command output: a `$ ls stack/` pane with one
 * hairline row per group. Row hover swaps the `[*]` marker for a prompt
 * arrow; each tool is a chip that inverts when touched.
 */
export function Skills() {
  const total = info.skills.reduce((count, group) => count + group.items.length, 0);

  return (
    <Section
      id="skills"
      label="skills"
      title="Tools I reach for"
      description="Day-to-day stack. The projects below are where it actually gets used."
    >
      <div className="border border-border-muted bg-surface">
        {/* Command bar */}
        <div className="flex items-center justify-between gap-4 border-b border-border-muted bg-elevated/40 px-4 py-2.5">
          <p className="truncate font-mono text-xs">
            <span className="text-fg-muted">$</span> ls stack/
          </p>
          <p className="shrink-0 font-mono text-[10px] tracking-[0.14em] text-fg-disabled uppercase">
            {info.skills.length} groups · {total} tools
          </p>
        </div>

        {/* Rows */}
        <div>
          {info.skills.map((group, index) => (
            <Reveal key={group.group} delay={index * 45}>
              <div
                className={
                  "group grid gap-2.5 px-4 py-3.5 transition-colors hover:bg-elevated/50 sm:grid-cols-[150px_1fr] sm:items-baseline sm:gap-6 " +
                  (index === info.skills.length - 1
                    ? ""
                    : "border-b border-border-muted/60")
                }
              >
                <p className="font-mono text-[11px] tracking-[0.16em] text-fg-muted uppercase transition-colors group-hover:text-fg">
                  <span className="group-hover:hidden">[*]</span>
                  <span className="hidden text-accent group-hover:inline">&gt;</span>{" "}
                  {group.group}
                </p>

                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="cursor-default border border-border-muted px-2.5 py-1 font-mono text-xs text-fg-secondary transition-colors hover:border-fg hover:bg-fg hover:text-bg"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Idle prompt */}
        <div className="flex items-center gap-2 border-t border-border-muted px-4 py-3 font-mono text-xs">
          <span className="text-fg-muted">$</span>
          <span
            className="inline-block h-3.5 w-2 animate-blink bg-fg"
            aria-hidden="true"
          />
        </div>
      </div>

      <Figure n={FIG.skills} className="mt-8">
        {total} tools across {info.skills.length} areas
      </Figure>
    </Section>
  );
}
