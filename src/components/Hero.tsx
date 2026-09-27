import { info } from "@/data/info";
import { cn } from "@/lib/cn";
import { useReveal } from "@/lib/useReveal";
import { useTypewriter } from "@/lib/useTypewriter";
import { PixelText } from "./ui/PixelText";

const [LINE_ONE, LINE_TWO] = info.wordmark;

/**
 * Hero — a stair-step poster. MOHAMMED runs the full measure, BAKRI indents
 * flush right beneath it, and the notch the indent opens up is where the
 * tagline and calls-to-action tuck in — text nested inside the wordmark's
 * own silhouette. A vertical spine label rides the left edge, and the
 * terminal survives as one unboxed prompt line.
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

      {/* Spine label — reads bottom-up along the left edge */}
      <div
        className="pointer-events-none absolute inset-y-0 left-4 hidden items-center lg:flex"
        aria-hidden="true"
      >
        <span className="rotate-180 font-mono text-[10px] tracking-[0.3em] text-fg-muted uppercase [writing-mode:vertical-rl]">
          portfolio — 2026
        </span>
      </div>

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

        <h1 className="sr-only">{info.name}</h1>

        {/* Line one — the full measure */}
        <div
          className="animate-rise mt-6 w-full"
          style={{ animationDelay: "80ms" }}
          aria-hidden="true"
        >
          <PixelText lines={[LINE_ONE]} cell={8} letterGap={1} className="w-full" />
        </div>

        {/* The stair: notch content on the left, indented line two on the
            right. BAKRI is 24 of the 42 columns line one occupies, so its
            width (57.14%) keeps both rows on the exact same cell scale. */}
        <div
          className="animate-rise mt-[4.76%] flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-8"
          style={{ animationDelay: "160ms" }}
        >
          <div className="order-2 min-w-0 lg:order-none lg:flex-1">
            <p className="prose max-w-2xl text-lg text-fg-secondary sm:text-xl">
              {info.tagline}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
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
          </div>

          <div className="order-1 ml-auto w-[57.142857%] lg:order-none" aria-hidden="true">
            <PixelText lines={[LINE_TWO]} cell={8} letterGap={1} className="w-full" />
          </div>
        </div>

        {/* The prompt: terminal as typography, not as furniture. */}
        <div
          ref={ref}
          className="animate-rise mt-10 border-t border-border-muted pt-6 font-mono text-sm"
          style={{ animationDelay: "240ms" }}
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
