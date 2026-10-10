# Arte Colore: website

Single-page website for **Arte Colore**, a renovation business in Italy
(flooring, painting, wallpaper). Italian content; React 18 + TypeScript +
Vite, Tailwind CSS v4, `motion`, Magic UI components and an optional
Three.js hero scene. No backend, database or external accounts are needed.

> **TODO (ask the client):** do they provide **labour (manodopera)**,
> **painting (pittura)** and **wallpaper installation (carta da parati)**?
> The answer decides the copy and whether to add the "Servizi" section
> (a commented placeholder is in `src/site/SiteApp.tsx`).

Before publishing, go through **`PLACEHOLDERS.md`**. Design and technical
choices are logged in **`DECISIONS.md`**.

## Run it

Requires Node 20+.

```bash
npm install
npm run dev          # http://localhost:5173 (development, hot reload)
```

## Build and check

```bash
npm run build        # typecheck → client build → SSR build → prerender HTML into dist/
npm run preview      # serve dist/ on http://localhost:4173
npm run lint
npm test             # Vitest unit tests (offers service, legacy components)
```

Set the real domain at build time so canonical URLs, Open Graph tags,
`sitemap.xml`, `robots.txt` and the footer QR code point to it:

```bash
VITE_SITE_URL=https://www.your-domain.it npm run build
```

(or write it once in `url` in `src/data/site.ts`).

## Deploy (any static host)

`npm run build` produces a fully static `dist/` folder: every page is
prerendered HTML, so content is visible before JavaScript runs.
Upload the **contents of `dist/`** to any static host:

- **Netlify / Cloudflare Pages / Vercel:** build command `npm run build`, output directory `dist`, environment variable `VITE_SITE_URL`.
- **Traditional hosting (FTP/cPanel):** run the build locally and upload `dist/` to the web root.

No server-side code, cookies or analytics.

## Where to edit things

| What | Where |
| --- | --- |
| Phone, WhatsApp, email, address, hours, Facebook, map link, site URL, SEO title/description, hero and SPC copy, zones | `src/data/site.ts` |
| Portfolio ("Lavori fatti"): add one object per job | `src/data/projects.ts` + photos in `public/images/portfolio/` |
| Wallpapers ("Decorativi") | `src/data/wallpapers.ts` + photos in `public/images/wallpapers/` |
| Offers ("Sconti"): instructions in Italian at the top of the file | `src/data/offers.ts` + photos in `public/images/offers/` |
| Colours, fonts, type scale, shadows, motion | `src/site/styles.css` (design tokens) |
| Section layout and remaining copy | `src/components/site/*.tsx` |
| Logo | `src/assets/logo.svg`, `src/assets/logo-mono.svg` (favicon/OG files in `public/`) |

Photos: WebP, two widths per image (see the comment at the top of each data
file). Expired or inactive offers hide themselves. When no offer is active,
the whole "Sconti" section and its menu link disappear.

## Page structure

`src/site/SiteApp.tsx` composes the page in this order:

Header (sticky, mobile menu) → Hero → SPC flooring → Lavori fatti →
Decorativi → Sconti → Zone servite → Contatti → Footer (Facebook badge, QR
code), plus a fixed call/WhatsApp bar on phones.

Building blocks:

- `src/components/site/primitives.tsx`: `Section`, `Container`, `Heading`, `Button`.
- `src/components/ui/`: Magic UI components (copied source, edits marked `arte-colore:`).
- `src/data/offersService.ts`: the **only** way components read offers (`getActiveOffers()`).
- `scripts/prerender.mjs`: renders the HTML at build time and embeds the active offers.

### Magic UI

Magic UI is not an npm package. Components are copied into the project with
the shadcn CLI. `components.json` already defines the registry:

```bash
npx shadcn@latest add @magicui/<component-name>
```

Used: `word-rotate` (hero), `particles` (hero background, desktop only),
`border-beam` + `animated-shiny-text` (SPC), `bento-grid` + `glare-hover` +
`marquee` (portfolio), `magic-card` (wallpapers), `number-ticker` +
`shine-border` (offers).

### Performance and accessibility notes

- Particles and the Three.js scene are separate chunks. They load only on desktop, without Save-Data, and the particles also need motion to be allowed. Phones never download three.js.
- Fonts (Fraunces, DM Sans) are self-hosted and preloaded.
- Images use `loading="lazy"` with explicit width and height.
- `prefers-reduced-motion` stops CSS animations, `motion` animations, the rotating headline, the price ticker and the particles.
- Keyboard: skip link, visible focus, mobile menu (Esc closes it and returns focus), lightbox (native `<dialog>`: Esc, arrow keys, focus trap).

### Legacy pages

`/prodotti/` and `/negozio/` are the previous "Cartella colori" design, kept
unchanged (`src/main.tsx`, `src/pages/`, `src/styles/global.css`). They
still build but are no longer linked or listed in the sitemap. Delete them
(and their entries in `vite.config.ts` and `scripts/prerender.mjs`) once the
client approves the redesign. `ASSETS.md` and `CONTENT-CHECKLIST.md` refer to
that old site.

## PHASE 2 (plan only, not built)

Goal: the owner manages offers without touching code.

1. **Supabase project** (Postgres + Auth + Storage), free tier.
2. **Table `offers`:** `id uuid pk`, `title text`, `image_path text`, `color text`, `old_price numeric`, `new_price numeric`, `unit text`, `ends_at timestamptz`, `active boolean`, `created_at`, `updated_at`.
3. **Row Level Security:**
   - Public (`anon`) may `select` only rows where `active` is true and `ends_at > now()`.
   - Only the single owner account may `insert`, `update` and `delete`, checked against the owner's `auth.uid()`, or an `is_owner` claim stored in a one-row `admins` table.
4. **Storage bucket `offers`:** public read; writes restricted to the owner by a storage policy. Images are resized client-side before upload.
5. **`/admin` page** (a separate lazy-loaded route, `noindex`):
   - login with email + password, or a magic link for the single owner;
   - list of offers with add, edit and delete;
   - form fields: photo upload, title, colour, prices, unit, end date (date picker, Europe/Rome), active toggle.
6. **Only `src/data/offersService.ts` changes** on the public site. `fetchAllOffers()` becomes a Supabase query, and `getActiveOffers()` keeps its signature. Prerender still embeds offers at build time and the browser re-fetches fresh ones.
   - Optional: a Supabase webhook triggers a host rebuild when offers change.
7. **Env vars:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. The anon key is safe in the browser thanks to RLS. The service-role key is never shipped.
