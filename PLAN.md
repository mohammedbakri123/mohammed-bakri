# PLAN.md — portfolio build hand-off

> **Read this first.** It records what exists, what was decided and what is left
> to do, so a fresh session can continue without repeating the research.

## 1. What this repository is

A personal portfolio for **Mohammed Bakri** — software developer in Sana'a, Yemen
and founder of [Tabib](https://tabib.bond), a clinic management system.

- Repository: `https://github.com/mohammedbakri123/mohammed-bakri`
  (renamed from `wisal_ui_preview`; the git remote was updated in place)
- Stack: **Vite 8 · React 19 · TypeScript 6 · Tailwind CSS 4**
- The previous chat-app ("Wisal") code and its Figma-rendering experiment were
  deleted. Only the tooling was kept — no other framework was introduced.

## 2. Current status

Everything below compiles, lints and builds cleanly:

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint     # eslint, 0 problems
npm run build    # tsc -b && vite build
npm run preview
```

| Area | Status |
| --- | --- |
| Clean slate (old app, docs, scripts, mock worker) | done |
| Design tokens mirroring opencode.ai | done |
| OpenCode pixel wordmark renderer | done |
| Content data layer (`info.json`) | done, seeded from `master_cv.json` |
| Live GitHub repository integration + fallback | done |
| Sections: hero, about, skills, projects, experience, contact, footer | done |
| Responsive layout, reduced-motion support, SEO meta | done |
| Avatar wired to `public/avatar.jpg` | done |
| `master_cv.json` | **untracked on purpose** — see §7 |
| Deployment to Vercel/Netlify | **not started** |

## 3. Design language (researched, do not re-derive)

Extracted from opencode.ai's production CSS and logo assets.

### Typography

| Use | Font | Why |
| --- | --- | --- |
| Body | **IBM Plex Sans** (`@fontsource`, self-hosted) | what opencode.ai ships |
| Mono / terminal / labels | **IBM Plex Mono** (self-hosted) | same |
| Wordmark | **`PixelText` component** (inline SVG) | see below |

**Important — the wordmark is not a font.** opencode's logo is hand-drawn SVG
paths, not a typeface, and no official font exists. A community npm package
(`@pantheon-ai/opencode-font`) was evaluated and **rejected**: it is unpublished
on npm (404) and its letterforms are a generic pixel font, not opencode's.
It was vendored, visually compared, and removed.

Instead `src/components/ui/PixelText.tsx` renders text as SVG blocks:

- The glyphs `O P E N C D` were transcribed **cell-for-cell** from the wordmark
  served at `opencode.ai` (samples rendered with `rsvg-convert` and read back
  pixel-by-pixel).
- The remaining 20 letters were drawn in the same block language, since
  opencode's logo only contains the letters of "OPENCODE". The full A–Z set is
  present; digits and punctuation fall back to a space.
- `M` and `W` are one column wider than the other glyphs, so `layout()` measures
  each glyph rather than trusting its first row.
- The stroke colour sweeps translucent → solid left-to-right, matching the
  gradient in their logo. It is built from `currentColor`, so the wordmark
  follows the inherited text colour.
- To add glyphs, extend the `GLYPHS` map: `#` = stroke, `o` = light inner fill,
  `.` = empty. Rows are 7 tall (0 = ascender, 1–5 = cap body, 6 = descender) and
  every row of a glyph must be the same width.

### Colour tokens (`src/index.css`, `@theme`)

Background `#0c0c0e` · surface `#161618` · elevated `#1c1c1f` · border `#38383a`
· border-muted `#2c2c2e` · text `#ffffff` · secondary `#c7c7cc` · muted `#a1a1a6`
· disabled `#86868b` · accent `#007aff` · success `#30d158` · warning `#ff9f0a`
· danger `#ff453a` · radii `3px / 5px / 8px`.

### opencode motifs reused

`[*]` list markers · `Fig N.` figure captions · terminal window with traffic
lights · faint blueprint grid behind the hero · hairline section rules ·
`$ whoami` typing effect.

## 4. File map

```
index.html                     SEO meta, title, favicon
src/
  main.tsx                     entry; imports IBM Plex weights + index.css
  App.tsx                      section order
  index.css                    design tokens, base layer, utilities
  data/
    info.json                  ← all personal content lives here
    types.ts                   shapes for info.json + GitHubRepo
    info.ts                    typed accessor for info.json
    github.ts                  GitHub API fetch, cache, ranking, hooks
    fallback-repos.ts          curated repo snapshot (API rate-limit safety)
  lib/
    cn.ts                      clsx + tailwind-merge
    figures.ts                 shared `Fig N.` numbering
    useReveal.ts               IntersectionObserver scroll reveal
    useTypewriter.ts           terminal typing effect
  components/
    Header.tsx Hero.tsx About.tsx Skills.tsx Projects.tsx
    Experience.tsx Contact.tsx Footer.tsx
    ui/  Section.tsx  Figure.tsx  Reveal.tsx  PixelText.tsx
public/
  avatar.jpg                   profile photo
  favicon.svg                  pixel "MB" mark
```

## 5. How content works

All personal content is in **`src/data/info.json`** — edit that file, not the
components. It currently reflects `master_cv.json` plus live GitHub data.

| Field | Meaning |
| --- | --- |
| `wordmark` | words rendered by `PixelText` (letters only — no digits) |
| `role`, `intro`, `tagline`, `location`, `email` | hero and contact copy |
| `bio`, `facts` | about section paragraphs and quick facts |
| `terminal` | the `$ whoami` command and its output lines |
| `socials` | GitHub, LinkedIn, X, Tabib — used in hero, contact, footer |
| `skills` | grouped lists, rendered as cards |
| `experience` | timeline entries (`role`, `company`, `url`, `period`, `summary`, `highlights`) |
| `featured` | hand-written flagship cards (Tabib, MPx-player) |
| `github` | username, `maxProjects`, `includeForks`, `exclude`, `preferredOrder` |
| `footer.text` | credit line |

### Live GitHub data

`src/data/github.ts` requests
`https://api.github.com/users/mohammedbakri123/repos?per_page=100&sort=pushed`,
then filters (no forks, no archived, minus `exclude`), ranks by
`preferredOrder` → stars → most recently pushed, and slices to `maxProjects`.
It is used by the hero (repo/star counts) and the projects grid.

- Results are cached in `sessionStorage` for 30 minutes.
- Parallel callers share one in-flight request.
- The hero renders immediately from the curated snapshot in
  `fallback-repos.ts`, then upgrades to live data. If the API is rate limited
  (60 requests/hour per IP for unauthenticated calls) the snapshot stays.
- Detect which is showing via the caption under "From GitHub".

**Refresh `fallback-repos.ts`** when you want the static snapshot to be more
current — it was taken from the GitHub API on 2026-09-19.

## 6. Known gaps in the copy

These were left deliberately rather than invented:

1. **Tabib founding date** — `experience[0].period` is `"Present"`; set the year
   you started, e.g. `"2024 — Present"`.
2. **Tabib stack** — the featured card tags say `.NET · React · PostgreSQL`;
   correct them if the real stack differs.
3. **Work experience** — there is no employment history section because none is
   documented in `master_cv.json`. Add entries to `experience` when there are.
4. **Phone number** — deliberately excluded from the site. `info.json` has
   `email` only.
5. **`say hello` copy** in `Contact.tsx` mentions backend/healthcare/AI; adjust
   if the pitch changes.

## 7. `master_cv.json`

Kept **untracked** on purpose — it contains a phone number and was the source
for the copy above. Either delete it, add it to `.gitignore`, or sanitise it
before committing, so it is not published on GitHub.

## 8. Next steps

- [ ] Fill the gaps in §6.
- [ ] Decide `master_cv.json`'s fate (§7).
- [ ] Re-check the site on a real phone (hero grid stacks below `lg`).
- [ ] Deploy: Vercel or Netlify both work with zero config (`npm run build`,
      output `dist`). Set `index.html`'s `canonical` URL to the real domain.
- [ ] Consider an OG image (`og:image`) once a domain exists.
- [ ] Optional: GitHub token/endpoint if the API rate limit becomes a nuisance.

## 9. Conventions

- Components are small, typed and one-per-file; no `any`.
- All copy flows through `info.json`; components stay content-free.
- Tailwind utilities reference tokens (`bg-surface`, `text-fg-muted`), never raw
  hex values.
- `@/` is the alias for `src/`.
- Effects that must not run on the server (or with reduced motion) guard on
  `typeof window`.
- Run `npm run lint` and `npm run build` before committing.