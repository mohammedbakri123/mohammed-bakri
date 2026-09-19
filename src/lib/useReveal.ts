import { useEffect, useRef, useState } from "react";

/**
 * Reveals an element the first time it scrolls into view.
 *
 * Returns a ref to attach to the element plus a `visible` flag; consumers
 * typically combine the flag with the `animate-rise` utility.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  // Without IntersectionObserver there is nothing to wait for, so start visible.
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const node = ref.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}