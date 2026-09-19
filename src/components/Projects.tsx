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
                "flex h-full flex-col rounded-lg border bg-surface p-6",
                project.highlight ? "border-accent/60" : "border-border",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-mono text-lg font-semibold text-fg">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-sm text-fg-muted">{project.tagline}</p>
                </div>
                <span className="shrink-0 rounded-sm border border-border px-2 py-1 font-mono text-[10px] tracking-[0.14em] text-fg-disabled uppercase">
                  {project.status}
                </span>
              </div>

              <p className="mt-4 text-fg-secondary">{project.description}</p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-sm bg-elevated px-2 py-1 font-mono text-[11px] text-fg-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="mt-auto inline-flex pt-6 font-mono text-xs text-accent transition-colors hover:text-fg"
              >
                visit {project.name.toLowerCase()} ↗
              </a>
            </article>
          </Reveal>
        ))}
      </div>

      <Figure n={FIG.featured} className="mt-6">
        Flagship work
      </Figure>

      <div className="mt-14 flex flex-wrap items-end justify-between gap-4 border-t border-border-muted pt-8">
        <div>
          <h3 className="text-xl font-semibold text-fg">From GitHub</h3>
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
          className="rounded-md border border-border px-3 py-2 font-mono text-xs text-fg-secondary transition-colors hover:border-accent hover:text-fg"
        >
          all repositories ↗
        </a>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo, index) => (
          <Reveal key={repo.name} delay={Math.min(index, 5) * 50}>
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-accent"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="truncate font-mono text-sm font-medium text-fg">
                  {repo.name}
                </span>
                {repo.stars > 0 ? (
                  <span className="shrink-0 font-mono text-xs text-warning">
                    ★ {repo.stars}
                  </span>
                ) : null}
              </div>

              <p className="mt-3 line-clamp-3 flex-1 text-sm text-fg-muted">
                {repo.description ?? "No description provided."}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] text-fg-disabled">
                {repo.language ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: languageColor(repo.language) }}
                      aria-hidden="true"
                    />
                    {repo.language}
                  </span>
                ) : null}
                <span>updated {formatUpdated(repo.updatedAt)}</span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <Figure n={FIG.projects} className="mt-8">
        {repos.length} repositories, most relevant first
      </Figure>
    </Section>
  );
}