import { useState } from "react";
import { info } from "@/data/info";
import { FIG } from "@/lib/figures";
import { Figure } from "./ui/Figure";
import { PixelLens } from "./ui/PixelLens";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";

/** First letters of the name, used when no avatar image is present yet. */
function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();
}

/**
 * About — avatar (falls back to a clean monogram when `public/avatar.jpg` is
 * missing), the bio, and a few quick facts.
 */
export function About() {
  const [avatarMissing, setAvatarMissing] = useState(false);

  return (
    <Section
      id="about"
      label="about"
      title="About me"
      description="The short version — what I build, and with what."
    >
      <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-14">
        <Reveal>
          <div>
            {avatarMissing ? (
              <div className="flex aspect-square w-full items-center justify-center border border-border bg-surface">
                <span className="font-mono text-4xl font-bold tracking-tight text-fg-muted">
                  {initialsOf(info.name)}
                </span>
              </div>
            ) : (
              <PixelLens
                src={info.avatar}
                alt={info.name}
                onError={() => setAvatarMissing(true)}
              />
            )}

            <Figure n={FIG.avatar} className="mt-3">
              {avatarMissing
                ? `Add your photo as public${info.avatar}`
                : `${info.name} · ${info.location}`}
            </Figure>
          </div>
        </Reveal>

        <div>
          <Reveal delay={70}>
            <div className="prose max-w-2xl space-y-4 text-fg-secondary">
              {info.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={140}>
            <dl className="mt-10 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {info.facts.map((fact) => (
                <div key={fact.label} className="border-t border-border-muted pt-3">
                  <dt className="font-mono text-[11px] tracking-[0.16em] text-fg-muted uppercase">
                    [*] {fact.label}
                  </dt>
                  <dd className="mt-1.5 font-mono text-sm text-fg">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
