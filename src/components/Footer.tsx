import { info } from "@/data/info";
import { PixelText } from "./ui/PixelText";

/** Footer — mirrors the way opencode close their page: links, then legalese. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-muted">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <PixelText
            text={info.wordmark.join(" ")}
            label={info.name}
            className="w-[104px] text-fg-disabled"
          />

          <ul className="flex flex-wrap items-center gap-5">
            {info.socials.map((social) => (
              <li key={social.url}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs text-fg-muted transition-colors hover:text-accent"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border-muted pt-6 font-mono text-[11px] text-fg-disabled">
          <p>
            © {year} {info.name}
          </p>
          <p className="max-w-md">{info.footer.text}</p>
          <a href="#top" className="transition-colors hover:text-accent">
            back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}