import { info } from "@/data/info";
import { PixelText } from "./ui/PixelText";

/** Footer — the page signs off with an oversized pixel wordmark, then the fine print. */
export function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border-muted bg-bg">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        {/* Oversized sign-off: the wordmark at full column width */}
        <a
          href="#top"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="group block w-full"
        >
          <PixelText
            text="MOHAMMED BAKRI"
            label={info.name}
            className="w-full transition-opacity group-hover:opacity-75"
          />
        </a>

        <div className="mt-10 border-t border-border-muted pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <ul className="flex flex-wrap items-center gap-5 font-mono text-xs">
              {info.socials.map((social) => (
                <li key={social.url}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-fg-muted transition-colors hover:text-fg"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="#top"
              onClick={scrollToTop}
              className="font-mono text-[11px] text-fg-muted transition-colors hover:text-fg"
            >
              back to top ↑
            </a>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-fg-muted">
            <p>
              © {year} {info.name}
            </p>
            <p className="max-w-md">{info.footer.text}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
