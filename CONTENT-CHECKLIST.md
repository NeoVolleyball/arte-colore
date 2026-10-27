# Arte Colore: content confirmation checklist

Developer-facing only. Nothing below is shown on the public site until the
business confirms it. Once an item is confirmed, add it to
`src/content/business.ts` (or the relevant component) and tick it here.

## Verified and published

| Detail | Value | Where |
| --- | --- | --- |
| Brand | Arte Colore | `business.brand` |
| Company | Arte Colore S.r.l. | footer, structured data |
| Address | Via Roma 175, 30038 Spinea (VE), Italia | Dove siamo, footer, structured data |
| Telephone | +39 041 990950 (`tel:+39041990950`) | header, visit card, /prodotti/, /negozio/ Dove siamo, footer, mobile bar |
| Partita IVA | 04463040271 | footer only (not in structured data) |
| San Marco | Listed in San Marco's retailer directory | San Marco section, text reference + link |

Reference sources: san-marco.com/store-locator ·
aziende.virgilio.it/vernici/spinea-ve/artecolore-spinea ·
ecoattivi.eu/doc/Spinea_Elenco_Negozi.pdf

## Added at the owner's request (October 2026): fill in before launch

- [x] **Facebook URL**: `business.social.facebook` updated with the shop's Facebook link (`https://www.facebook.com/groups/877516193200198/posts/1842790300006111/`).
- [ ] **San Marco "Belle Arti" link**: no Belle Arti page was found on san-marco.com; `business.sanMarco.belleArtiUrl` points to the home page for now.
- [ ] **San Marco logo**: set `business.sanMarco.logo` only with an official retailer asset / permission (a typographic badge is shown until then).
- [ ] **Photos** for I nostri lavori, Carta da parati and Pavimenti SPC: `src/content/gallery.ts` (placeholders say "Foto in arrivo"; replace "Località" too).
- [ ] **Offerte**: only `demo` examples exist, so the live site shows "nessuna offerta attiva". Real prices go in `src/content/offerte.ts`.
- [x] Labour for painting and wallpaper hanging: confirmed by the owner, shown as a badge.
- [ ] **Cornici su misura**: 3 photos (`framePhotos` in `src/content/gallery.ts`, files in `public/images/cornici/`) and the details that replace `[DETTAGLI CORNICI]` in `src/content/catalogue.ts` (materials, sizes, times: only what the owner confirms).
- [x] Wallpaper (carta da parati) and SPC laminate floors: confirmed by the owner.

## Needs confirmation before publishing

### Opening hours
- [ ] Weekday hours. Directories list 08:00–12:30 and 15:00–18:55, but the shop has not confirmed this directly.
- [ ] Saturday hours. Sources disagree.
- [ ] Closing days, holidays and summer closures.
- When confirmed: set `business.openingHours` and add an hours block to `Location.tsx` and `openingHoursSpecification` to `structuredData()`.
- Until then the site says "Per informazioni su orari e disponibilità, chiamaci."

### Identity, logo and imagery
- [ ] **Logo.** No genuine logo was in the project. The site uses a new typographic wordmark ("Arte Colore" in Instrument Serif with a tiny fan of three colour chips) created for the redesign. It is not an existing official logo. Replace `src/components/Wordmark.tsx` if a real logo exists.
- [ ] **Palette.** Ivory, charcoal, sage, terracotta and ochre are a proposed website palette, not verified brand colours.
- [ ] **Business-approved photos** of the shop front, interior and staff, if the owner wants them. All current images are original digital illustrations (see `ASSETS.md`).
- [ ] **San Marco logo.** Only use it with written permission or an official retailer asset kit. The current text-only reference is deliberate.
- [ ] The hero 3D tin has an invented "Arte Colore" label. Confirm the owner is happy with this illustrative use; it must not suggest a house-brand product.

### Product categories
- [x] Pitture (published)
- [x] Smalti (published)
- [x] Prodotti per la decorazione / painting supplies (published)
- [ ] Fine-art materials (belle arti). Mentioned in older public descriptions; current availability unconfirmed.
- [ ] Frames / cornici. Same as above.
- [ ] Wallpaper / carta da parati. Same as above.
- [ ] Specific brands stocked, other than the San Marco directory listing.

### Services (none are published)
- [ ] Custom colour mixing / tintometro
- [ ] Delivery
- [ ] Installation or on-site painting
- [ ] Colour or design consultation appointments
- Note: the broad registered business purpose does not prove that any of these is currently offered.

### Contact channels (none are published)
- [ ] Business email
- [ ] WhatsApp number
- [ ] Official social media accounts (would go in structured data `sameAs`)
- [ ] Google Business Profile URL. If one exists, the directions link could point to it. The current link is a generic Google Maps directions search for the address, with no invented place ID.

### Legal and company details
- [ ] Production domain. Then build with `VITE_SITE_URL=https://…` to emit the canonical URL, `og:url`, absolute `og:image`, `robots.txt` and `sitemap.xml`.
- [ ] Privacy policy / cookie policy. None exists, so none is linked. The site sets no cookies and has no analytics; the Google Maps embed loads only after the visitor clicks "Mostra la mappa". Have a legal review decide whether a privacy notice is still required.
- [ ] Company register details the owner wants in the footer (REA, share capital, PEC).
- [ ] Founding date, history, owner or staff names. Not used anywhere.

### Conflicting listings (not used)
- Some directories show "Arte Colore S.a.s. di Lazzaro Francesco & C." at Via Gioberti 6/A. These details are not used. Confirm they are outdated and ask the owner to update or close those listings so customers aren't sent to the wrong address.

### Never add without evidence
Prices, promotions, testimonials, review counts or ratings, awards, certifications (including San Marco's own), staff biographies, completed projects, years of experience, or claims such as "leader" or "specialisti".
