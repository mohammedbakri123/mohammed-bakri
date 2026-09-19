import { info } from "@/data/info";
import { FIG } from "@/lib/figures";
import { Figure } from "./ui/Figure";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";

/** Experience — a hairline timeline with a dot per entry. */
export function Experience() {
  return (
    <Section
      id="experience"
      label="experience"
      title="Where I've been"
      description="Founding, shipping, and the open-source work in between."
    >
      <ol className="space-y-10">
        {info.experience.map((entry, index) => (
          <Reveal key={`${entry.company}-${entry.role}`} delay={index * 70}>
            <li className="relative pl-6 sm:pl-8">
              <span
                className="absolute top-0 left-0 h-full w-px bg-border"
                aria-hidden="true"
              />
              <span
                className="absolute top-2 -left-[4.5px] size-2.5 rounded-full border-2 border-bg bg-accent"
                aria-hidden="true"
              />

              <p className="font-mono text-xs tracking-[0.16em] text-accent uppercase">
                {entry.period}
              </p>

              <h3 className="mt-2 text-lg font-semibold text-fg">
                {entry.role}
                <span className="text-fg-muted"> · </span>
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-fg-secondary underline decoration-border underline-offset-4 transition-colors hover:text-accent"
                >
                  {entry.company}
                </a>
              </h3>

              <p className="mt-1 font-mono text-[11px] text-fg-disabled">
                {entry.location}
              </p>

              <p className="mt-4 max-w-2xl text-fg-secondary">{entry.summary}</p>

              <ul className="mt-4 space-y-2">
                {entry.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 text-sm text-fg-muted">
                    <span className="font-mono text-accent" aria-hidden="true">
                      [*]
                    </span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </li>
          </Reveal>
        ))}
      </ol>

      <Figure n={FIG.experience} className="mt-10">
        {info.experience.length} entries — dates are editable in src/data/info.json
      </Figure>
    </Section>
  );
}