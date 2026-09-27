import { info } from "@/data/info";
import { PixelText } from "./ui/PixelText";
import { Terminal } from "./Terminal";

/**
 * Hero — name, one line about what I build, and the terminal that answers
 * the rest. No stats, no chrome: word, words, shell.
 */
export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div
        className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-20 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <div
              className="animate-rise font-mono text-xs tracking-[0.18em] text-fg-muted uppercase"
              style={{ animationDelay: "0ms" }}
            >
              <span className="text-fg-muted">[*]</span>{" "}
              <span>{info.intro} · {info.location}</span>
            </div>

            <h1 className="animate-rise mt-6" style={{ animationDelay: "80ms" }}>
              <PixelText
                lines={info.wordmark}
                cell={8}
                letterGap={1}
                lineGap={2}
                label={info.name}
                build
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
                className="bg-fg px-5 py-2.5 font-mono text-xs font-medium tracking-wide text-bg transition-colors hover:bg-accent-hover"
              >
                view projects
              </a>
              <a
                href="#contact"
                className="border border-border px-5 py-2.5 font-mono text-xs font-medium tracking-wide text-fg-secondary transition-colors hover:border-fg hover:text-fg"
              >
                get in touch
              </a>
              {info.openToWork ? (
                <span className="inline-flex items-center gap-2 border border-border-muted bg-surface px-3 py-2.5 font-mono text-xs text-fg-secondary">
                  <span className="size-1.5 rounded-full bg-success animate-pulse" aria-hidden="true" />
                  open to work
                </span>
              ) : null}
            </div>
          </div>

          <div className="animate-rise" style={{ animationDelay: "320ms" }}>
            <Terminal />
          </div>
        </div>
      </div>
    </section>
  );
}
