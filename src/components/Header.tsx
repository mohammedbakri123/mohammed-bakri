import { useEffect, useRef, useState } from "react";
import { info } from "@/data/info";
import { cn } from "@/lib/cn";
import { PixelText } from "./ui/PixelText";

const NAV_ITEMS = [
  { id: "about", label: "about", short: "abt" },
  { id: "skills", label: "skills", short: "skl" },
  { id: "projects", label: "projects", short: "work" },
  { id: "experience", label: "exp", short: "exp" },
  { id: "contact", label: "contact", short: "msg" },
];

const GITHUB_URL =
  info.socials.find((social) => social.label.toLowerCase() === "github")?.url ??
  `https://github.com/${info.handle}`;

/**
 * Header with authentic OpenCode pixel wordmark logo, theme switcher (dark & light),
 * and an ultra-responsive Floating Island Command Dock on mobile.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [dockVisible, setDockVisible] = useState(true);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [copied, setCopied] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

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
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Scrolled past top threshold
      setScrolled(currentScrollY > 8);

      // Scroll direction detection with small delta threshold to avoid micro-jitter
      const delta = currentScrollY - lastScrollY.current;
      if (Math.abs(delta) > 10) {
        if (delta > 0 && currentScrollY > 60) {
          // Scrolling DOWN -> Hide dock
          setDockVisible(false);
          setActionsOpen(false);
        } else {
          // Scrolling UP -> Show dock
          setDockVisible(true);
        }
        lastScrollY.current = currentScrollY;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close actions popover on click outside
  useEffect(() => {
    if (!actionsOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target as Node)) {
        setActionsOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [actionsOpen]);

  // Section observer for active pill indicator
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

  const copyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(info.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Top Header Bar */}
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
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={cn(
                      "transition-colors hover:text-fg hover:underline underline-offset-4 decoration-border",
                      activeSection === item.id
                        ? "text-fg font-medium"
                        : "text-fg-secondary",
                    )}
                  >
                    {item.id === "experience" ? "experience" : item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => toggleTheme()}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                className="flex items-center gap-1.5 rounded-[4px] border border-border-muted bg-surface px-2.5 py-1.5 font-mono text-xs text-fg-secondary transition-colors hover:border-border hover:text-fg"
              >
                <span>{theme === "dark" ? "☀" : "☾"}</span>
                <span className="text-[11px]">{theme === "dark" ? "light" : "dark"}</span>
              </button>

              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-[4px] bg-fg px-3.5 py-1.5 font-mono text-xs font-medium text-bg transition-colors hover:bg-white"
              >
                <span>GitHub</span>
                <span>↗</span>
              </a>
            </div>
          </nav>

          {/* Mobile Top Controls: Theme Toggle & Status Pill */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => toggleTheme()}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="flex items-center justify-center size-8 rounded-[4px] border border-border-muted bg-surface text-xs text-fg-secondary"
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-border-muted bg-surface/80 px-2.5 py-1 font-mono text-[10px] text-fg-secondary">
              <span className="size-1.5 rounded-full bg-success animate-pulse" />
              <span>Sana'a</span>
            </span>
          </div>
        </div>
      </header>

      {/* Mobile Floating Island Command Dock (Responsive across all screens & hides on scroll down) */}
      <nav
        ref={actionsRef}
        aria-label="Mobile Dock Navigation"
        className={cn(
          "fixed bottom-4 inset-x-2.5 z-50 w-[calc(100%-1.25rem)] max-w-[370px] mx-auto md:hidden touch-manipulation transition-all duration-300 ease-out",
          dockVisible
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-16 opacity-0 pointer-events-none",
        )}
      >
        <div className="relative flex items-center justify-between gap-1 rounded-full border border-border bg-[#161313]/96 p-1 sm:p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          {/* Quick-Jump Section Pills - Flexibly fills available width */}
          <div className="flex flex-1 items-center justify-between gap-0.5 min-w-0">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={cn(
                  "flex-1 text-center py-1.5 px-1 font-mono text-[11px] sm:text-xs rounded-full transition-all duration-150 truncate touch-manipulation",
                  activeSection === item.id
                    ? "bg-fg text-bg font-semibold shadow-sm"
                    : "text-fg-secondary hover:text-fg hover:bg-surface/60",
                )}
              >
                <span className="hidden min-[360px]:inline">{item.label}</span>
                <span className="inline min-[360px]:hidden">{item.short}</span>
              </a>
            ))}
          </div>

          <span className="h-4 w-px bg-border-muted mx-0.5 shrink-0" aria-hidden="true" />

          {/* Quick Action Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActionsOpen((open) => !open);
            }}
            aria-expanded={actionsOpen}
            aria-label="Quick Actions"
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs transition-all duration-200 touch-manipulation",
              actionsOpen
                ? "bg-fg text-bg font-bold rotate-45"
                : "border border-border bg-surface text-fg-secondary hover:border-fg/40 hover:text-fg",
            )}
          >
            +
          </button>
        </div>

        {/* Floating Quick Actions Popover Card */}
        {actionsOpen ? (
          <div className="absolute bottom-full mb-2.5 inset-x-0 rounded-xl border border-border bg-[#161313]/98 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border-muted text-[11px] text-fg-muted">
                <span>QUICK ACTIONS</span>
                <span className="text-success inline-flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-success animate-pulse" />
                  open to work
                </span>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center justify-between py-2 px-3 rounded-[4px] bg-surface hover:bg-elevated text-fg transition-colors border border-border-muted text-left"
              >
                <span className="flex items-center gap-2">
                  <span>{theme === "dark" ? "☀" : "☾"}</span>
                  <span>Theme</span>
                </span>
                <span className="text-fg-muted text-[10px] uppercase">
                  {theme === "dark" ? "Switch to light" : "Switch to dark"}
                </span>
              </button>

              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => setActionsOpen(false)}
                className="flex items-center justify-between py-2 px-3 rounded-[4px] bg-surface hover:bg-elevated text-fg transition-colors border border-border-muted"
              >
                <span>GitHub @{info.handle}</span>
                <span>↗</span>
              </a>

              <button
                type="button"
                onClick={copyEmail}
                className="w-full flex items-center justify-between py-2 px-3 rounded-[4px] bg-surface hover:bg-elevated text-fg transition-colors border border-border-muted text-left"
              >
                <span className="truncate">{info.email}</span>
                <span className="text-fg-muted text-[10px] shrink-0 ml-2">
                  {copied ? "Copied!" : "Copy"}
                </span>
              </button>

              <div className="flex items-center justify-between pt-1.5 text-[11px] text-fg-muted">
                <a
                  href="#contact"
                  onClick={(e) => {
                    handleNavClick(e, "contact");
                    setActionsOpen(false);
                  }}
                  className="hover:text-fg transition-colors"
                >
                  → Send message
                </a>
                <a
                  href="#top"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setActionsOpen(false);
                  }}
                  className="hover:text-fg transition-colors"
                >
                  ↑ Back to top
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </nav>
    </>
  );
}