import { info } from "@/data/info";
import { FIG } from "@/lib/figures";
import { Figure } from "./ui/Figure";
import { PixelText } from "./ui/PixelText";
import { Section } from "./ui/Section";

/** Contact — pixel sign-off plus every way to reach me. */
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
          <PixelText text="SAY HELLO" className="w-full max-w-[430px] text-fg" />

          <p className="mt-6 max-w-md text-fg-secondary">
            Building something in backend engineering, healthcare software or AI-powered
            tooling — or just want to talk shop about .NET, React or Flutter? My inbox is
            open.
          </p>

          {email ? (
            <a
              href={`mailto:${email}`}
              className="mt-8 inline-flex rounded-md bg-accent px-4 py-2.5 font-mono text-xs tracking-wide text-white transition-colors hover:bg-accent-hover"
            >
              {email}
            </a>
          ) : (
            <p className="mt-8 inline-flex rounded-md border border-border px-4 py-2.5 font-mono text-xs text-fg-disabled">
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
                className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3.5 transition-colors hover:border-accent"
              >
                <span className="font-mono text-sm text-fg">
                  <span className="text-accent">[*]</span> {social.label}
                </span>
                <span className="truncate font-mono text-xs text-fg-disabled">
                  {social.handle} ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <Figure n={FIG.contact} className="mt-10">
        Fastest reply on GitHub or X
      </Figure>
    </Section>
  );
}