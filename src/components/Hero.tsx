import { info } from "@/data/info";
import { cn } from "@/lib/cn";
import { useReveal } from "@/lib/useReveal";
import { useTypewriter } from "@/lib/useTypewriter";
import { PixelText } from "./ui/PixelText";

/**
 * Hero — full-width typographic composition. The pixel wordmark is the star,
 * and the terminal idea survives only as one unboxed prompt line: no window,
 * no tabs, no chrome. The answer prints the way shell output does — below the
 * command, revealed line by line.
 */
export function Hero() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.4);
  const { text: typedCommand, done } = useTypewriter(
    visible ? info.terminal.command : "",
  );

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div
        className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-20 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div
          className="animate-rise font-mono text-xs tracking-[0.18em] text-fg-muted uppercase"
          style={{ animationDelay: "0ms" }}
        >
          <span className="text-fg-muted">[*]</span>{" "}
          <span>
            {info.intro} · {info.location}
          </span>
        </div>

        <h1 className="animate-rise mt-6" style={{ animationDelay: "80ms" }}>
          <PixelText
            lines={info.wordmark}
            cell={8}
            letterGap={1}
            lineGap={2}
            label={info.name}
            className="w-full max-w-[46rem]"
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
              <span
                className="size-1.5 rounded-full bg-success animate-pulse"
                aria-hidden="true"
              />
              open to work
            </span>
          ) : null}
        </div>

        {/* The prompt: terminal as typography, not as furniture. */}
        <div
          ref={ref}
          className="animate-rise mt-10 border-t border-border-muted pt-6 font-mono text-sm"
          style={{ animationDelay: "320ms" }}
        >
          <p className="text-fg">
            <span className="text-fg-muted">$</span> {typedCommand}
            <span
              className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-fg animate-blink"
              aria-hidden="true"
            />
          </p>

          <div className="mt-2 space-y-1">
            {info.terminal.output.map((line, index) => (
              <p
                key={line}
                className={cn(
                  "max-w-2xl text-fg-secondary transition-all duration-300",
                  done ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                )}
                style={{ transitionDelay: `${100 * (index + 1)}ms` }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
