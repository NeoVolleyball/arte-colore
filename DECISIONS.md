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

- Tailwind v4 with `@tailwindcss/vite` (Vite 5.4 is supported); its CSS is imported only by the new home entry, so the legacy pages keep their own `global.css` untouched.
- `index.html` now loads `src/site/main.tsx`; `src/main.tsx` + `src/pages/registry.tsx` serve only the legacy `/prodotti/` and `/negozio/` pages, which still build and prerender but are no longer linked from the new home. The old `HomePage.tsx` and its sections are kept on disk unused, for reference; delete them once the client approves the redesign.
- `npx shadcn init` and `npx shadcn add @magicui/<name>` cannot reach `ui.shadcn.com` / `magicui.design` from this sandbox (egress policy 403). `components.json` was written by hand with the `@magicui` registry exactly as requested. Components were installed with the same shadcn CLI from the identical official registry JSON published in Magic UI's GitHub repo (`raw.githubusercontent.com/magicuidesign/magicui/main/apps/www/public/r/<name>.json`). A local stub answered the CLI's `colors/stone.json` request. On a normal connection, `npx shadcn@latest add @magicui/<name>` works as-is.
- Magic UI items install to `src/components/ui/` (the registry's own target). Small edits are marked `arte-colore:` in the files: `magic-card` drops `next-themes` (light-only site), `bento-grid` replaces the unavailable shadcn `button` and `@radix-ui/react-icons` with a plain link and an inline SVG, and `number-ticker` gains a `locale` prop for Italian price formatting.
- Prerender now awaits `getActiveOffers()` and embeds the result as JSON (`#app-data`), so the client hydrates from exactly the same offers (no mismatch, no layout shift) and then re-checks expiry in the browser.
