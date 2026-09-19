import { useEffect, useState } from "react";

interface TypewriterOptions {
  /** Milliseconds between characters. */
  speed?: number;
  /** Milliseconds to wait before typing starts. */
  startDelay?: number;
}

interface TypewriterResult {
  /** The portion of `text` that should currently be rendered. */
  text: string;
  /** Whether the full string has been typed out. */
  done: boolean;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Types `text` out one character at a time, like a terminal echoing input.
 *
 * Users who prefer reduced motion get the finished string immediately, and
 * swapping `text` for a different string restarts the animation.
 */
export function useTypewriter(
  text: string,
  { speed = 55, startDelay = 350 }: TypewriterOptions = {},
): TypewriterResult {
  const [visibleChars, setVisibleChars] = useState(() =>
    prefersReducedMotion() ? text.length : 0,
  );
  const [activeText, setActiveText] = useState(text);

  // Adjust state during render when the target string changes, rather than in
  // an effect — the pattern React recommends over effect-driven resets.
  if (activeText !== text) {
    setActiveText(text);
    setVisibleChars(prefersReducedMotion() ? text.length : 0);
  }

  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }

    let typed = 0;
    let interval: number | undefined;

    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        typed += 1;
        setVisibleChars(typed);

        if (typed >= text.length && interval !== undefined) {
          window.clearInterval(interval);
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(timeout);

      if (interval !== undefined) {
        window.clearInterval(interval);
      }
    };
  }, [text, speed, startDelay]);

  return { text: text.slice(0, visibleChars), done: visibleChars >= text.length };
}