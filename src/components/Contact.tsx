import { info } from "@/data/info";
import { FIG } from "@/lib/figures";
import { Figure } from "./ui/Figure";
import { PixelText } from "./ui/PixelText";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";

/** Contact — OpenCode pixel sign-off plus every way to reach me. */
export function Contact() {
  const email = info.email.trim();

  return (
    <Section
      id="contact"
      label="contact"
      title="Get in touch"
      description="Open to product work, collaborations and interesting problems."
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal>
          <div>
            <PixelText
              text="SAY HELLO"
              cell={6}
              className="w-full max-w-[280px]"
              label="Say Hello"
            />

            <p className="prose mt-6 max-w-md text-sm text-fg-secondary">
              Building something in backend engineering, healthcare software or AI-powered
              tooling — or just want to talk shop about .NET, React or Flutter? My inbox is
              open.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="group inline-flex items-center gap-2 bg-fg px-4 py-2.5 font-mono text-xs font-medium tracking-wide text-bg transition-colors hover:bg-accent-hover"
                >
                  <span>{email}</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                    ↗
                  </span>
                </a>
              ) : (
                <p className="inline-flex border border-border-muted px-4 py-2.5 font-mono text-xs text-fg-disabled">
                  set "email" in src/data/info.json to show a mailto link
                </p>
              )}

              <a
                href="https://wa.me/967774446941"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-border-muted bg-surface px-4 py-2.5 font-mono text-xs font-medium tracking-wide text-fg transition-colors hover:border-fg"
              >
                <span className="size-1.5 rounded-full bg-success" />
                <span>WhatsApp: +967 774 446 941 ↗</span>
              </a>
            </div>
          </div>
        </Reveal>

        <ul className="flex flex-col gap-3">
          {info.socials.map((social, index) => (
            <li key={social.url}>
              <Reveal delay={index * 50}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-4 border border-border-muted bg-surface px-4 py-3.5 transition-colors hover:border-border hover:bg-elevated/50"
                >
                  <span className="font-mono text-sm text-fg">
                    <span className="text-fg-disabled">[*]</span> {social.label}
                  </span>
                  <span className="truncate font-mono text-xs text-fg-secondary">
                    {social.handle} ↗
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <Figure n={FIG.contact} className="mt-10 text-fg-muted">
        Fastest reply on WhatsApp or GitHub
      </Figure>
    </Section>
  );
}