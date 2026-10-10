# Placeholders to replace before going live

Everything in `[SQUARE BRACKETS]` on the site is a placeholder. Most values
live in **one file: `src/data/site.ts`**. Tick each item when done.

Tip: `grep -rn "\[" src/data` lists every remaining placeholder.

## Contact details (`src/data/site.ts` → `contact`)
- [ ] `phoneDisplay`: phone as shown on the page (e.g. `041 123 4567`)
- [ ] `phoneIntl`: same number for links, international format, no spaces (e.g. `+390411234567`)
- [ ] `whatsapp`: WhatsApp number, digits only with country code (e.g. `393331234567`)
- [ ] `whatsappMessage`: pre-filled WhatsApp text (optional, already set)
- [ ] `email`
- [ ] `address`: street, postal code (CAP), city, province
- [ ] `hours`: opening hours (e.g. `Lun–Ven 8:00–18:00`)

> The previous version of the site (`src/content/business.ts`) contains
> details for a paint shop "Arte Colore S.r.l.": Via Roma 175, 30038 Spinea
> (VE), tel. 041 990950. They were **not** copied, because the new brief
> describes a renovation business. Confirm with the client whether they apply.

## Links (`src/data/site.ts` → `links`)
- [ ] `facebook`: Facebook page URL (footer badge + JSON-LD `sameAs`)
- [ ] `zoneMap`: map or San Marco page for the "Vedi sulla mappa" button
- [ ] Confirm what "San Marco" and "Belle Arti" mean for "Zone servite" (areas served? The old site used San Marco as a paint brand and "belle arti" as a product category.)

## Site address
- [ ] `url` in `src/data/site.ts`, **or** build with `VITE_SITE_URL=https://www.your-domain.it npm run build`.
  Used by the footer QR code, canonical/Open Graph tags, JSON-LD, `robots.txt` and `sitemap.xml`.
  (Lighthouse SEO reports invalid canonical/robots until this is a real URL.)

## Photos
- [ ] Portfolio ("Lavori fatti"): `public/images/portfolio/` + `src/data/projects.ts`
  (titles, `[LOCALITÀ]`, alt texts; set `example: false` or remove it)
- [ ] Wallpapers ("Decorativi"): `public/images/wallpapers/` + `src/data/wallpapers.ts`
- [ ] Offer photos: `public/images/offers/` + `src/data/offers.ts`
- [ ] SPC section photo (`src/components/site/SpcHighlight.tsx`, currently `lavoro-1`)
- [ ] Hero tiles on phones (`src/components/site/Hero.tsx`, `swatches`)
- [ ] Share image `public/og-image.jpg` (1200×630) if a real photo is preferred

All current images are generated illustrations (`scripts/make-placeholders.py`)
and are labelled "Foto di esempio" on the site.

## Offers (`src/data/offers.ts`)
- [ ] Replace the three `[ESEMPIO]` offers: titles, colours, prices, units, photos
- [ ] Real end dates (`endsAt`, format `AAAA-MM-GG`)

## Logo
- [ ] Approve the new logo (`src/assets/logo.svg`, `src/assets/logo-mono.svg`) or supply the official one.
  Also regenerate `public/favicon.svg`, `public/apple-touch-icon.png`, `public/og-image.jpg` and `public/logo.svg` if it changes.

## Copy to confirm
- [ ] SPC headline (two alternatives are in a comment in `src/data/site.ts`)
- [ ] Services actually offered (labour, painting, wallpaper installation): see the README TODO
- [ ] Legal footer details (company name, P. IVA) if required
