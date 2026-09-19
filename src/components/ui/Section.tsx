import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionProps {
  id: string;
  label: string;
  title: string;
  /** Sits under the heading, like opencode's one-line section notes. */
  description?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Section shell: hairline top rule, a `[*]` mono label, then the heading —
 * the layout rhythm opencode use down their landing page.
 */
export function Section({ id, label, title, description, children, className }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 border-t border-border-muted py-16 sm:py-24", className)}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <header className="mb-10 sm:mb-14">
          <p className="font-mono text-xs tracking-[0.18em] text-fg-muted uppercase">
            [*] {label}
          </p>
          <h2 className="mt-3 font-mono text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 max-w-2xl font-mono text-sm text-fg-muted">{description}</p>
          ) : null}
        </header>

        {children}
      </div>
    </section>
  );
}