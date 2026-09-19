import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useReveal } from "@/lib/useReveal";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger, in milliseconds, applied to the entrance animation. */
  delay?: number;
}

/** Fades an element up the first time it enters the viewport. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(visible ? "animate-rise" : "opacity-0", className)}
      style={delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}