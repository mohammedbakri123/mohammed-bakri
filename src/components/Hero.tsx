import { info } from "@/data/info";
import { useGitHubRepos } from "@/data/github";
import { cn } from "@/lib/cn";
import { useTypewriter } from "@/lib/useTypewriter";
import { FIG } from "@/lib/figures";
import { Figure } from "./ui/Figure";
import { PixelText } from "./ui/PixelText";

/**
 * Hero: pixel wordmark, a terminal that types `whoami`, and three captioned
 * stats pulled from live GitHub data.
 */
export function Hero() {
  const { repos } = useGitHubRepos(info.github);
  const { text: typedCommand, done } = useTypewriter(info.terminal.command);

  const totalStars = repos.reduce((total, repo) => total + repo.stars, 0);

  const stats = [
    { value: String(repos.length), caption: "public repositories on GitHub", figure: FIG.repos },
    { value: String(totalStars), caption: "stars earned across projects", figure: FIG.stars },
    {
      value: String(info.featured.length),
      caption: "products shipped end-to-end",
      figure: FIG.products,
    },
  ];

  return (
    <section id="top" className="relative isolate overflow-hidden border-b border-border-muted">
      <div
        className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
              [*] {info.intro}
            </p>

            <h1 className="mt-6 text-fg">
              <PixelText
                text={info.wordmark.join(" ")}
                className="w-full max-w-[560px]"
                label={info.name}
              />
            </h1>

            <p className="mt-6 max-w-xl text-lg text-fg-secondary">{info.tagline}</p>

            <p className="mt-4 font-mono text-xs text-fg-disabled">
              {info.role} · {info.location}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="rounded-md bg-accent px-4 py-2.5 font-mono text-xs tracking-wide text-white transition-colors hover:bg-accent-hover"
              >
                view projects
              </a>
              <a
                href="#contact"
                className="rounded-md border border-border px-4 py-2.5 font-mono text-xs tracking-wide text-fg-secondary transition-colors hover:border-accent hover:text-fg"
              >
                get in touch
              </a>
              {info.openToWork ? (
                <span className="inline-flex items-center gap-2 font-mono text-xs text-fg-disabled">
                  <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
                  open to work
                </span>
              ) : null}
            </div>

            <dl className="mt-12 grid gap-8 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.caption} className="border-t border-border pt-4">
                  <dd className="font-mono text-2xl font-semibold text-fg">{stat.value}</dd>
                  <Figure n={stat.figure} className="mt-2">
                    {stat.caption}
                  </Figure>
                </div>
              ))}
            </dl>
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-danger" />
                <span className="size-2.5 rounded-full bg-warning" />
                <span className="size-2.5 rounded-full bg-success" />
              </span>
              <p className="font-mono text-[11px] text-fg-disabled">~/{info.handle}</p>
            </div>

            <div className="terminal-scroll p-4 font-mono text-sm leading-relaxed sm:p-5">
              <p className="text-fg-secondary">
                <span className="text-accent">$</span> {typedCommand}
                {done ? null : (
                  <span
                    className="ml-0.5 inline-block h-4 w-2 animate-blink bg-accent align-middle"
                    aria-hidden="true"
                  />
                )}
              </p>

              <div className="mt-2 space-y-1">
                {info.terminal.output.map((line, index) => (
                  <p
                    key={line}
                    className={cn(
                      "text-fg-muted transition-all duration-500",
                      done ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                    )}
                    style={{ transitionDelay: `${140 * (index + 1)}ms` }}
                  >
                    {line}
                  </p>
                ))}
              </div>

              <div className="mt-5 border-t border-border-muted pt-4">
                {info.socials.map((social) => (
                  <a
                    key={social.url}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "flex items-center justify-between gap-4 py-1.5 text-fg-disabled transition-all duration-500 hover:text-accent",
                      done ? "opacity-100" : "opacity-0",
                    )}
                    style={{ transitionDelay: "560ms" }}
                  >
                    <span>
                      <span className="text-accent">→</span> {social.label}
                    </span>
                    <span className="truncate">{social.handle}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}