import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { info } from "@/data/info";
import { cn } from "@/lib/cn";
import { PixelText } from "./ui/PixelText";

/** GitHub mark — lucide no longer ships brand icons. */
function GithubMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

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
 * Header: pixel wordmark, section nav with an active marker, and a theme
 * switcher. Mobile keeps only the essentials in the top bar.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const progressRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
      if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
    }
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
    root.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "light" ? "#fdfcfc" : "#131010");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);

      // Progress hairline — written straight to the DOM so scrolling
      // never triggers a re-render.
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Section observer for the active nav marker
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
      { rootMargin: "-30% 0px -50% 0px" },
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-[64px] sm:h-[72px] md:h-[80px] border-b transition-colors duration-200",
        scrolled
          ? "border-border-muted bg-bg/95 backdrop-blur-md"
          : "border-border-muted/60 bg-bg",
      )}
    >
      <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <PixelText
            text="MOHAMMED BAKRI"
            label={info.name}
            className="h-[20px] sm:h-[24px] md:h-[26px] w-auto"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Sections">
          <ul className="flex items-center gap-6 lg:gap-8 font-mono text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.id} className="relative">
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={cn(
                    "transition-colors hover:text-fg",
                    activeSection === item.id
                      ? "text-fg font-medium"
                      : "text-fg-secondary",
                  )}
                >
                  {item.label}
                </a>
                <span
                  aria-hidden="true"
                  className={cn(
                    "-bottom-1.5 absolute left-0 h-px bg-fg transition-all duration-300",
                    activeSection === item.id ? "w-full" : "w-0",
                  )}
                />
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="flex items-center gap-1.5 border border-border-muted bg-surface px-2.5 py-1.5 font-mono text-xs text-fg-secondary transition-colors hover:border-border hover:text-fg"
            >
              {theme === "dark" ? (
                <Sun className="size-3.5 text-fg-secondary" />
              ) : (
                <Moon className="size-3.5 text-fg-secondary" />
              )}
              <span className="text-[11px]">{theme === "dark" ? "light" : "dark"}</span>
            </button>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-fg px-3.5 py-1.5 font-mono text-xs font-medium text-bg transition-colors hover:bg-accent-hover"
            >
              <span>GitHub</span>
              <span>↗</span>
            </a>
          </div>
        </nav>

        {/* Mobile controls: theme + GitHub */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            className="flex items-center justify-center size-8 border border-border-muted bg-surface text-fg-secondary transition-colors hover:border-border hover:text-fg"
          >
            <GithubMark className="size-4" />
          </a>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="flex items-center justify-center size-8 border border-border-muted bg-surface text-fg-secondary transition-colors hover:border-border hover:text-fg"
          >
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* Scroll progress hairline — hugs the header's bottom edge */}
      <div
        ref={progressRef}
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-fg"
        style={{ transform: "scaleX(0)", willChange: "transform" }}
      />
    </header>
  );
}
