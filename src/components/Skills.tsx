import { info } from "@/data/info";
import { FIG } from "@/lib/figures";
import { Figure } from "./ui/Figure";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";

/** Skills — one bordered card per group, styled like opencode's feature list. */
export function Skills() {
  return (
    <Section
      id="skills"
      label="skills"
      title="Tools I reach for"
      description="Day-to-day stack. The projects below are where it actually gets used."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {info.skills.map((group, index) => (
          <Reveal key={group.group} delay={index * 60}>
            <div className="h-full rounded-[4px] border border-border-muted bg-surface p-5 transition-colors hover:border-border">
              <p className="font-mono text-[11px] tracking-[0.16em] text-fg-muted uppercase">
                [*] {group.group}
              </p>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="font-mono text-sm text-fg-secondary">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Figure n={FIG.skills} className="mt-8">
        {info.skills.reduce((total, group) => total + group.items.length, 0)} tools across{" "}
        {info.skills.length} areas
      </Figure>
    </Section>
  );
}