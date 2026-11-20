/**
 * Single source of truth for verified business facts and page copy.
 *
 * Only VERIFIED details belong here. Anything unconfirmed (social accounts,
 * extra categories, services) is tracked in
 * CONTENT-CHECKLIST.md and must not be added until the business approves it.
 */

import { publishedOffers } from './offerte';
import { works } from './gallery';

/** Sections without real content stay hidden (menu, page and hero button). */
export const hasOffers = publishedOffers().length > 0;
export const hasWorks = works.some((w) => w.image);

export const business = {
  brand: 'Arte Colore',
  legalName: 'Arte Colore S.r.l.',
  vatNumber: '04463040271',
  description: 'Negozio di pitture, smalti e prodotti per la decorazione a Spinea.',
  address: {
    street: 'Via Roma 175',
    postalCode: '30038',
    city: 'Spinea',
    province: 'VE',
    region: 'Veneto',
    country: 'IT',
    countryName: 'Italia',
  },
  phone: {
    display: '+39 041 990950',
    local: '041 990950',
    href: 'tel:+39041990950',
    e164: '+39041990950',
  },
  /** Public e-mail, confirmed by the owner (Nov 2026). */
  email: 'info@artecolorearl.it',
  /** Opening hours, confirmed by the owner (Nov 2026). `days` uses schema.org day names. */
  openingHours: [
    { label: 'Lunedì – Venerdì', hours: '8.00–12.30 · 15.00–19.00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], slots: [['08:00', '12:30'], ['15:00', '19:00']] },
    { label: 'Sabato', hours: '8.00–12.00', days: ['Saturday'], slots: [['08:00', '12:00']] },
  ] as const,
  /** Other brands sold in the shop, besides San Marco (confirmed by the owner). */
  otherBrands: ['Colorificio San Marinese', 'Impa'] as const,
  sanMarco: {
    statement: 'Arte Colore è presente nella rete di rivenditori San Marco.',
    directoryUrl: 'https://san-marco.com/store-locator',
    siteUrl: 'https://www.san-marco.com',
    /** TODO: link to the "Belle Arti" line page once confirmed (no such page found on san-marco.com). */
    belleArtiUrl: 'https://www.san-marco.com',
    /** Official logo file (e.g. '/images/san-marco/logo.svg' in public/), only with San Marco's permission.
     *  While `null` a typographic badge is shown instead. */
    logo: null as null | string,
  },
  /** Service confirmed by the shop owner. */
  labour: 'Forniamo anche manodopera per pittura e posa carta da parati',
  social: {
    facebook: 'https://www.facebook.com/groups/877516193200198/posts/1842790300006111/',
  },
} as const;

const mapsQuery = `${business.brand}, ${business.address.street}, ${business.address.postalCode} ${business.address.city} ${business.address.province}, ${business.address.countryName}`;

export const maps = {
  /** Google Maps directions to the shop address (no invented place ID). */
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery)}`,
  /** Search URL, opened in a new tab as an alternative. */
  searchUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`,
  /** Embed loaded only after the visitor asks for it. */
  embedUrl: `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`,
};

/** The site is a single page; /prodotti/ and /negozio/ are static redirects in public/. */
export type PageId = 'home';

export const pages: Record<PageId, { path: string; title: string; description: string }> = {
  home: {
    path: '/',
    title: 'Arte Colore Spinea | Pitture, Smalti, Pavimenti SPC e Carta da parati',
    description:
      'Arte Colore a Spinea: offerte, pitture, smalti, pavimenti in laminato SPC e carta da parati, con posa. Via Roma 175. Chiamaci al 041 990950.',
  },
};

export const seo = {
  lang: 'it',
  locale: 'it_IT',
  title: pages.home.title,
  description: pages.home.description,
  /** Production origin, e.g. "https://www.example.it". Set VITE_SITE_URL at build time. */
  siteUrl: (import.meta.env?.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || '',
  ogImage: '/images/og-arte-colore.jpg',
};

/** Main menu (header, mobile menu, footer). Every item scrolls to the section
 *  with the same name on the single page, in page order. */
export const nav = [
  ...(hasOffers ? [{ label: 'Offerte', href: '#offerte', highlight: true }] : []),
  { label: 'Prodotti', href: '#prodotti', highlight: false },
  { label: 'Reparti', href: '#reparti', highlight: false },
  { label: 'Pavimenti SPC', href: '#pavimenti', highlight: false },
  { label: 'Carta da parati', href: '#carta-da-parati', highlight: false },
  { label: 'Cornici', href: '#cornici', highlight: false },
  ...(hasWorks ? [{ label: 'Lavori', href: '#lavori', highlight: false }] : []),
  { label: 'Contatti', href: '#contatti', highlight: false },
];

/** schema.org structured data — verified facts only (no geo, ratings). */
export function structuredData(siteUrl = seo.siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: business.brand,
    legalName: business.legalName,
    description: business.description,
    telephone: business.phone.e164,
    email: business.email,
    openingHoursSpecification: business.openingHours.flatMap((o) =>
      o.slots.map(([opens, closes]) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [...o.days],
        opens,
        closes,
      })),
    ),
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      postalCode: business.address.postalCode,
      addressLocality: business.address.city,
      addressRegion: business.address.province,
      addressCountry: business.address.country,
    },
    ...(siteUrl ? { url: `${siteUrl}/`, image: `${siteUrl}${seo.ogImage}` } : {}),
  };
}
