import { info } from "@/data/info";
import { useGitHubRepos } from "@/data/github";
import { FIG } from "@/lib/figures";
import { Figure } from "./ui/Figure";
import { PixelText } from "./ui/PixelText";

/**
 * Hero — name, one line about what I build, and the two doors in.
 * Everything else (terminal, stack, activity) lives further down the page.
 */
export function Hero() {
  const { repos } = useGitHubRepos(info.github);

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
    <section id="top" className="relative isolate overflow-hidden">
      <div
        className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-20 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
        <div
          className="animate-rise font-mono text-xs tracking-[0.18em] text-fg-muted uppercase"
          style={{ animationDelay: "0ms" }}
        >
          <span className="text-fg-disabled">[*]</span>{" "}
          <span>{info.intro} · {info.location}</span>
        </div>

        <h1 className="animate-rise mt-6" style={{ animationDelay: "80ms" }}>
          <PixelText
            lines={info.wordmark}
            cell={8}
            letterGap={1}
            lineGap={2}
            label={info.name}
            className="w-full max-w-[400px] sm:max-w-[520px]"
          />
        </h1>

        <p
          className="prose animate-rise mt-8 max-w-2xl text-lg text-fg-secondary sm:text-xl"
          style={{ animationDelay: "160ms" }}
        >
          {info.tagline}
        </p>

        <div
          className="animate-rise mt-9 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <a
            href="#projects"
            className="rounded-[4px] bg-fg px-5 py-2.5 font-mono text-xs font-medium tracking-wide text-bg transition-colors hover:bg-accent-hover"
          >
            view projects
          </a>
          <a
            href="#contact"
            className="rounded-[4px] border border-border px-5 py-2.5 font-mono text-xs font-medium tracking-wide text-fg-secondary transition-colors hover:border-fg hover:text-fg"
          >
            get in touch
          </a>
          {info.openToWork ? (
            <span className="inline-flex items-center gap-2 rounded-[4px] border border-border-muted bg-surface px-3 py-2.5 font-mono text-xs text-fg-secondary">
              <span className="size-1.5 rounded-full bg-success animate-pulse" aria-hidden="true" />
              open to work
            </span>
          ) : null}
        </div>

        <dl
          className="animate-rise mt-16 grid max-w-2xl gap-6 sm:grid-cols-3"
          style={{ animationDelay: "320ms" }}
        >
          {stats.map((stat) => (
            <div key={stat.caption} className="border-t border-border-muted pt-4">
              <dd className="font-mono text-2xl font-semibold text-fg sm:text-3xl">
                {stat.value}
              </dd>
              <Figure n={stat.figure} className="mt-2 text-fg-muted">
                {stat.caption}
              </Figure>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
