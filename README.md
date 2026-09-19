# Mohammed Bakri — portfolio

Personal portfolio for **Mohammed Bakri**, software developer in Sana'a, Yemen
and founder of [Tabib](https://tabib.bond), a clinic management system.

Built with Vite, React 19, TypeScript and Tailwind CSS 4, in the visual
language of [opencode](https://opencode.ai) — IBM Plex typography, `[*]` markers,
`Fig N.` captions and a hand-built pixel wordmark.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production bundle into dist/
npm run preview   # serve the production build
npm run lint
```

## Editing your content

Everything personal lives in **`src/data/info.json`** — name, bio, socials,
skills, experience, featured projects and the GitHub configuration. Components
read from it and never hard-code copy.

Projects are pulled **live from the GitHub API** and ranked by
`github.preferredOrder`, then stars, then recency. A curated snapshot in
`src/data/fallback-repos.ts` is shown first and kept if the API is rate limited.

Your photo goes in `public/avatar.jpg`, referenced by `info.avatar`.

## Design notes

- Colours, radii and fonts are tokens in `src/index.css` (`@theme`), mirroring
  the custom properties opencode publish.
- The pixel wordmark is **not a font** — opencode's logo is hand-drawn SVG, so
  `src/components/ui/PixelText.tsx` renders block glyphs as inline SVG. Its
  `O P E N C D` were transcribed from opencode's own wordmark; the remaining
  letters were drawn to match.

See **[PLAN.md](./PLAN.md)** for the full background, decisions and open tasks.