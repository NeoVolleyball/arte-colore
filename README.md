# Arte Colore: sito web

Presentation website for **Arte Colore**, a paint and decorating supplies shop
at Via Roma 175, Spinea (VE). Single page in Italian, built with React,
TypeScript, Vite and Three.js. All 3D models and images are generated
procedurally with Blender.

## Setup

```bash
npm install
npm run dev          # http://localhost:5173
```

Node 20+ is required.

## Build and checks

```bash
npm run build        # typecheck → client build → SSR prerender into dist/index.html
npm run preview      # serve dist/ on http://localhost:4173
npm run lint
npm test             # Vitest unit tests (explorer, menu, business data)
npm run check:browser   # Playwright checks against the running preview
                        # (CHROMIUM=/path/to/chrome to use a local browser)
```

The build prerenders the whole page, so content, phone links and structured
data are in the HTML before any JavaScript runs. React then hydrates it.

### Production domain / SEO

The canonical URL, `og:url`, absolute `og:image`, `robots.txt` and
`sitemap.xml` are only generated once the real domain is known:

```bash
VITE_SITE_URL=https://www.example.it npm run build
```

Deploy the contents of `dist/` to any static host.

## Editing content

| What | Where |
| --- | --- |
| Name, address, phone, P. IVA, San Marco link, SEO title/description, structured data | `src/content/business.ts` |
| Opening hours (currently `null`, so hidden) | `business.openingHours` in `src/content/business.ts`, then render them in `src/components/Location.tsx` |
| Explorer colours (names, HEX, families, notes, initial colour) | `src/data/palette.json` |
| Section copy | the matching component in `src/components/` |
| Design tokens (colours, type scale, spacing, motion) | `src/styles/global.css` |

Before publishing anything new, check `CONTENT-CHECKLIST.md`. It lists what
still needs confirmation (hours, logo, extra categories, services, legal
pages) and what must never be added without evidence.

Palette colours are illustrative examples. They are not official
manufacturer codes or confirmed stock.

## How it works

- **Hero:** `HeroVisual` always shows the Cycles still (`public/images/hero-still-*`). On desktop (≥960px, WebGL available, no Save-Data) it lazy-loads `src/three/heroScene.ts` during idle time and cross-fades to the live scene. The scene:
  - uses the camera exported from Blender;
  - renders at no more than 1.75× device pixel ratio;
  - pauses when offscreen or when the tab is hidden;
  - keeps the still image if WebGL fails or the context is lost.
  
  Under `prefers-reduced-motion` the scene is static and renders only on demand. Picking a colour in the explorer also tints the paint in the 3D tin.
- **Colour explorer:** the room was rendered with a neutral back wall. The chosen colour is multiplied over it through a wall-only alpha mask (CSS `mask-image` + `mix-blend-mode: multiply`). This keeps the rendered light and shadow without needing WebGL. Swatches are an ARIA radio group with a roving tab stop: arrow keys, Home and End all work.
- **Motion:** reveals use native scroll-driven CSS animations as progressive enhancement. They are entry-only, so content is never hidden in browsers without support. Everything is disabled under reduced motion.
- **Map:** the Google Maps iframe is created only after the visitor clicks "Mostra la mappa". There are no analytics, cookies or tracking.

## 3D and image assets

See `ASSETS.md` for the source of every asset and how to regenerate it
(`npm run assets:blender`).

## Project layout

```
blender/             procedural Blender scenes + post-processing (asset sources)
public/models/       hero.glb
public/images/       rendered WebP images, OG image
scripts/             prerender + browser checks
src/content/         verified business data, SEO
src/data/            illustrative palette
src/components/      page sections
src/three/           Three.js hero scene (lazy chunk)
src/styles/          global tokens and base styles
```
