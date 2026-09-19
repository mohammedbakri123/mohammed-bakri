import { info } from "@/data/info";
import { FIG } from "@/lib/figures";
import { Figure } from "./ui/Figure";
import { PixelText } from "./ui/PixelText";
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
        <div>
          <PixelText
            text="SAY HELLO"
            cell={6}
            className="w-full max-w-[280px]"
            label="Say Hello"
          />

          <p className="mt-6 max-w-md font-mono text-sm leading-relaxed text-fg-secondary">
            Building something in backend engineering, healthcare software or AI-powered
            tooling — or just want to talk shop about .NET, React or Flutter? My inbox is
            open.
          </p>

          {email ? (
            <a
              href={`mailto:${email}`}
              className="mt-8 inline-flex rounded-[4px] bg-fg px-4 py-2.5 font-mono text-xs font-medium tracking-wide text-bg transition-colors hover:bg-white"
            >
              {email} ↗
            </a>
          ) : (
            <p className="mt-8 inline-flex rounded-[4px] border border-border-muted px-4 py-2.5 font-mono text-xs text-fg-disabled">
              set "email" in src/data/info.json to show a mailto link
            </p>
          )}
        </div>

        <ul className="flex flex-col gap-3">
          {info.socials.map((social) => (
            <li key={social.url}>
              <a
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-4 rounded-[4px] border border-border-muted bg-surface px-4 py-3.5 transition-colors hover:border-border"
              >
                <span className="font-mono text-sm text-fg">
                  <span className="text-fg-disabled">[*]</span> {social.label}
                </span>
                <span className="truncate font-mono text-xs text-fg-secondary">
                  {social.handle} ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <Figure n={FIG.contact} className="mt-10 text-fg-muted">
        Fastest reply on GitHub or X
      </Figure>
    </Section>
  );
}