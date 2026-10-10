# Decisions log (Phase 1 redesign, branch `magic-ui-phase1`)

## Plan (written before coding)

1. Keep Vite + React 18 + TypeScript and the prerender (SSR) build; add Tailwind v4 via `@tailwindcss/vite`.
2. The new single-page site replaces the home page (`index.html`) with its own entry (`src/site/main.tsx`) and its own CSS, so Tailwind's reset never touches the legacy `/prodotti/` and `/negozio/` pages.
3. Add the `@/` alias, `motion`, `cn()` (clsx + tailwind-merge) and a hand-written `components.json` with the `@magicui` registry.
4. Design tokens live in one file, `src/site/styles.css` (CSS variables + Tailwind `@theme`): stone/off-white base, terracotta accent, dark band variant, Fraunces + DM Sans self-hosted.
5. Primitives (`Section`, `Container`, `Heading`, `Button`) in `src/components/site/primitives.tsx`; every section uses them.
6. Business facts are placeholders in `src/data/site.ts`; content arrays in `src/data/projects.ts`, `wallpapers.ts`, `offers.ts` (offers only read through `offersService.ts`).
7. Sections in order: Header, Hero, SPC, Lavori fatti, Decorativi, Sconti, Zone servite, Contatti, Footer; below-the-fold sections are code-split with `React.lazy` in the client while the prerender still renders all content.
8. The existing Three.js hero (`HeroVisual` + `src/three/heroScene.ts`) is reused unchanged as the hero visual on desktop only (it already lazy-loads, skips mobile/Save-Data/no-WebGL and goes static under reduced motion).
9. New SVG logo (mark + wordmark, colour + mono), favicon, apple-touch-icon and a 1200×630 share image rendered from SVG with Playwright.
10. Verify with lint, tests, build and Playwright screenshots at 360/768/1280 px; finish with README, PLACEHOLDERS.md and this log.

## Decisions

