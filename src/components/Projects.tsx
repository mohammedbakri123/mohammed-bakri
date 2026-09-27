import { formatUpdated, languageColor, useGitHubRepos } from "@/data/github";
import { info } from "@/data/info";
import { cn } from "@/lib/cn";
import { FIG } from "@/lib/figures";
import { Figure } from "./ui/Figure";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";

/**
 * Projects — hand-picked flagship work, followed by a grid of repositories
 * pulled live from the GitHub API (with a curated snapshot as fallback).
 */
export function Projects() {
  const { repos, source } = useGitHubRepos(info.github);
  const githubUrl = `https://github.com/${info.github.username}`;

  return (
    <Section
      id="projects"
      label="projects"
      title="Things I've built"
      description="Products I own end-to-end, plus the repositories they grew out of."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {info.featured.map((project, index) => (
          <Reveal key={project.name} delay={index * 70}>
            <article
              className={cn(
                "group flex h-full flex-col border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5",
                project.highlight
                  ? "border-fg/30 hover:border-fg"
                  : "border-border-muted hover:border-border",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-mono text-lg font-semibold text-fg">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-sm text-fg-muted">{project.tagline}</p>
                </div>
                <span className="shrink-0 border border-border-muted px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] text-fg-muted uppercase">
                  {project.status}
                </span>
              </div>

              <p className="prose mt-4 text-fg-secondary">{project.description}</p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="border border-border-muted bg-elevated px-2 py-0.5 font-mono text-[11px] text-fg-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="mt-auto inline-flex pt-6 font-mono text-xs font-medium text-fg underline underline-offset-4 decoration-border-muted transition-colors hover:decoration-fg"
              >
                <span>visit {project.name.toLowerCase()}</span>
                <span className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                  ↗
                </span>
              </a>
            </article>
          </Reveal>
        ))}
      </div>

      <Figure n={FIG.featured} className="mt-6 text-fg-muted">
        Flagship work
      </Figure>

      <div className="mt-14 flex flex-wrap items-end justify-between gap-4 border-t border-border-muted pt-8">
        <div>
          <h3 className="font-mono text-lg font-semibold text-fg">From GitHub</h3>
          <p className="mt-1 max-w-xl text-sm text-fg-muted">
            {source === "live"
              ? "Fetched live from the GitHub API."
              : "Curated snapshot shown — live data loads when the API is reachable."}
          </p>
        </div>
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          className="border border-border-muted px-3 py-1.5 font-mono text-xs text-fg-secondary transition-colors hover:border-fg hover:text-fg"
        >
          all repositories ↗
        </a>
      </div>

      <div className="mt-6 border-t border-border-muted/60">
        {repos.map((repo, index) => (
          <Reveal key={repo.name} delay={Math.min(index, 5) * 45}>
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 border-b border-border-muted/60 px-2 py-3.5 transition-colors hover:bg-surface sm:gap-4 sm:px-3"
            >
              <span className="w-9 shrink-0 text-right font-mono text-[11px] text-fg-disabled transition-colors group-hover:text-warning">
                {repo.stars > 0 ? `★${repo.stars}` : "—"}
              </span>

              <span className="min-w-0 flex-1 truncate font-mono text-sm text-fg transition-colors group-hover:text-accent">
                {repo.name}
              </span>

              <span className="hidden w-28 shrink-0 items-center gap-1.5 font-mono text-[11px] text-fg-muted sm:flex">
                {repo.language ? (
                  <>
                    <span
                      className="size-2 shrink-0"
                      style={{ backgroundColor: languageColor(repo.language) }}
                      aria-hidden="true"
                    />
                    {repo.language}
                  </>
                ) : (
                  "—"
                )}
              </span>

              <span className="w-24 shrink-0 text-right font-mono text-[11px] text-fg-disabled">
                {formatUpdated(repo.updatedAt)}
              </span>

              <span
                aria-hidden="true"
                className="shrink-0 font-mono text-xs text-fg-muted opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
              >
                ↗
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      <Figure n={FIG.projects} className="mt-8">
        Top {repos.length} repositories, most relevant first
      </Figure>
    </Section>
  );
}