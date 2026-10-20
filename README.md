# Arte Colore: sito web

Presentation website for **Arte Colore**, a paint and decorating supplies shop
at Via Roma 175, Spinea (VE). Italian, one page, built with React,
TypeScript, Vite and Three.js. All 3D models and images are generated
procedurally with Blender.

**Design concept: "Cartella colori".** The site behaves like a deck of
paper colour cards. Every section is a full-colour card finished with a paper
label strip carrying the colour's name and code. Type: Instrument Serif
(display) and Hanken Grotesk (text), both OFL and self-hosted.

| Page | File | Contents |
| --- | --- | --- |
| `/` | `src/pages/HomePage.tsx` | Hero, Offerte, product deck, Pavimenti SPC, Carta da parati, I nostri lavori, colour explorer, Ispirazioni, San Marco, Contatti (address, directions, map on request, visit tips) |
| `/prodotti/`, `/negozio/` | `public/prodotti/`, `public/negozio/` | Old pages, now `noindex` redirects to the matching home section so existing links keep working |

## Setup

```bash
npm install
npm run dev          # http://localhost:5173
```

Node 20+ is required.

## Build and checks

```bash
npm run build        # typecheck → client build → SSR prerender of all three pages
npm run preview      # serve dist/ on http://localhost:4173
npm run lint
npm test             # Vitest unit tests (explorer, menu, business data)
npm run check:browser   # Playwright checks against the running preview
                        # (CHROMIUM=/path/to/chrome to use a local browser)
```

The build prerenders every page (`scripts/prerender.mjs`), so content, phone
links and structured data are in the HTML before any JavaScript runs. React
then hydrates it. To add a page: create `<name>/index.html` (copy an existing
one, set `data-page`), add it to `pages` in `src/content/business.ts`, the
registry in `src/pages/registry.tsx`, `entries` in `vite.config.ts` and
`scripts/prerender.mjs`.

### Production domain / SEO

The canonical URL, `og:url`, absolute `og:image`, `robots.txt` and
`sitemap.xml` are only generated once the real domain is known:

```bash
VITE_SITE_URL=https://www.example.it npm run build
```

Deploy the contents of `dist/` to any static host. To serve from a
subfolder, set `VITE_BASE` (e.g. `VITE_BASE=/arte-colore/`); all asset and
page links go through `withBase()` in `src/content/paths.ts`.

### GitHub Pages

`.github/workflows/deploy-pages.yml` runs lint, unit tests and the build on
every push to `main`, then publishes `dist/` to GitHub Pages at
`https://<user>.github.io/arte-colore/`. The base path and canonical URL come
from the Pages configuration automatically. One-time setup: **Settings → Pages
→ Build and deployment → Source: GitHub Actions**. Pages on a *private*
repository needs a paid GitHub plan; otherwise make the repository public.

## Editing content

| What | Where |
| --- | --- |
| Name, address, phone, P. IVA, San Marco link, navigation, per-page SEO titles/descriptions, structured data | `src/content/business.ts` |
| Product categories, Ispirazioni, Pavimenti SPC and Carta da parati copy | `src/content/catalogue.ts` |
| **Offerte** (name, photo, old/new price, end date; expired ones hide, `demo` ones only show in `npm run dev`) | `src/content/offerte.ts` |
| **Photos**: I nostri lavori, Carta da parati, Pavimenti SPC (files in `public/images/...`) | `src/content/gallery.ts` |
| Quick-access chips under the header, Facebook URL, San Marco links/logo, labour line | `src/content/business.ts` |
| Opening hours (currently `null`, so hidden) | `business.openingHours` in `src/content/business.ts`, then render them in `src/components/ContactSection.tsx` and `src/components/VisitCard.tsx` |
| Explorer colours (names, HEX, families, notes, initial colour) | `src/data/palette.json` |
| Section copy | the matching component in `src/components/` |
| Design tokens (colours, card tones, type scale, spacing, motion) | `src/styles/global.css` |

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
- **Colour explorer:** the room was rendered with a neutral back wall. The chosen colour is multiplied over it through a wall-only alpha mask (CSS `mask-image` + `mix-blend-mode: multiply`). This keeps the rendered light and shadow without needing WebGL. Picking a sample also pours the colour over the whole card. `src/effects/liquidPour.ts` is a small WebGL2 shader with:
  - a noise-warped liquid edge;
  - drips hanging from the blob;
  - a glossy wet rim that dries to a flat colour, so the hand-off to the CSS background is seamless.
  
  It is created on the first pick and renders only while pouring. Without WebGL2 it falls back to a circular CSS clip-path pour. The text ink switches part-way through for contrast. A unit test guarantees every palette colour gets an AA-compliant ink. Swatches are an ARIA radio group with a roving tab stop: arrow keys, Home and End all work.
- **Page transitions:** cross-document View Transitions crossfade between pages where supported. Under reduced motion, or in other browsers, navigation is normal.
- **Motion (cinematic, never hijacks scrolling):**
  - As the hero scrolls away, the 3D camera orbits and dollies in on the tin, and the chip fan spreads wider (a registered `@property` on a scroll timeline).
  - The product deck "deals" itself from a stack into a fanned hand.
  - Paint drips grow from each card's colour over its paper label strip.
  - Large images drift in depth inside their frames.
  - Reveals are entry-only, so content is never hidden in browsers without scroll-driven animation support.
  
  Everything is disabled under `prefers-reduced-motion`.
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
src/data/            illustrative palette
src/content/         verified business data, SEO, catalogue copy
src/pages/           the three pages + registry
src/components/      cards, header/footer, explorer, hero
src/three/           Three.js hero scene (lazy chunk)
src/styles/          global tokens and base styles
```
