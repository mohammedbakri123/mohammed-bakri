import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FigureProps {
  /** Figure number, rendered as `Fig 1.` like opencode's stat captions. */
  n: number;
  children: ReactNode;
  className?: string;
}

/** Small mono caption used under stats, terminal panes and the projects grid. */
export function Figure({ n, children, className }: FigureProps) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] tracking-[0.16em] text-fg-disabled uppercase",
        className,
      )}
    >
      Fig {n}. {children}
    </p>
  );
}