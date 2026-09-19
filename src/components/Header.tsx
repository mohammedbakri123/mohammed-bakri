import { useEffect, useState } from "react";
import { info } from "@/data/info";
import { cn } from "@/lib/cn";
import { PixelText } from "./ui/PixelText";

const NAV_ITEMS = [
  { id: "about", label: "about" },
  { id: "skills", label: "skills" },
  { id: "projects", label: "projects" },
  { id: "experience", label: "experience" },
  { id: "contact", label: "contact" },
];

const GITHUB_URL =
  info.socials.find((social) => social.label.toLowerCase() === "github")?.url ??
  `https://github.com/${info.handle}`;

/**
 * Sticky header: pixel wordmark on the left, section links in mono on the
 * right, with the current section highlighted as you scroll.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (element): element is HTMLElement => element !== null,
    );

    if (sections.length === 0 || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-200",
        scrolled
          ? "border-border-muted bg-bg/85 backdrop-blur-md"
          : "border-transparent bg-bg",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <a
          href="#top"
          className="group flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <PixelText
            text={info.wordmark.join(" ")}
            label={info.name}
            className="w-[124px] text-fg transition-colors group-hover:text-accent"
          />
          <span className="hidden font-mono text-[11px] tracking-[0.16em] text-fg-disabled sm:inline">
            /{info.handle}
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Sections">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "rounded-md px-3 py-2 font-mono text-xs tracking-wide transition-colors",
                activeSection === item.id
                  ? "text-accent"
                  : "text-fg-muted hover:text-fg",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-md border border-border px-3 py-1.5 font-mono text-xs text-fg-secondary transition-colors hover:border-accent hover:text-fg sm:inline-flex"
          >
            GitHub ↗
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            className="rounded-md border border-border px-3 py-1.5 font-mono text-xs text-fg-secondary transition-colors hover:border-accent hover:text-fg md:hidden"
          >
            {menuOpen ? "close" : "menu"}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          className="border-t border-border-muted bg-bg px-5 pb-6 sm:px-8 md:hidden"
          aria-label="Sections"
        >
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-border-muted py-3 font-mono text-sm text-fg-secondary transition-colors hover:text-accent"
                >
                  [*] {item.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-md border border-border px-3 py-2 font-mono text-xs text-fg-secondary transition-colors hover:border-accent hover:text-fg"
          >
            GitHub ↗
          </a>
        </nav>
      ) : null}
    </header>
  );
}