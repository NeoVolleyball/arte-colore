/**
 * Single source of truth for verified business facts and page copy.
 *
 * Only VERIFIED details belong here. Anything unconfirmed (hours, email,
 * social accounts, extra categories, services) is tracked in
 * CONTENT-CHECKLIST.md and must not be added until the business approves it.
 */

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
  /** Opening hours are NOT verified yet. Keep `null` until confirmed. */
  openingHours: null as null | ReadonlyArray<{ days: string; hours: string }>,
  sanMarco: {
    statement: 'Arte Colore è presente nella rete di rivenditori San Marco.',
    directoryUrl: 'https://san-marco.com/store-locator',
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

export const seo = {
  lang: 'it',
  locale: 'it_IT',
  title: 'Arte Colore Spinea | Pitture, Smalti e Decorazione',
  description:
    'Scopri Arte Colore a Spinea: pitture, smalti e prodotti per la decorazione. Ci trovi in Via Roma 175. Chiama il negozio al 041 990950.',
  /** Production origin, e.g. "https://www.example.it". Set VITE_SITE_URL at build time. */
  siteUrl: (import.meta.env?.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || '',
  ogImage: '/images/og-arte-colore.jpg',
};

export const nav = [
  { id: 'negozio', label: 'Il negozio' },
  { id: 'prodotti', label: 'Prodotti' },
  { id: 'colori', label: 'Esplora i colori' },
  { id: 'dove-siamo', label: 'Dove siamo' },
] as const;

/** schema.org structured data — verified facts only (no hours, geo, ratings). */
export function structuredData(siteUrl = seo.siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: business.brand,
    legalName: business.legalName,
    description: business.description,
    telephone: business.phone.e164,
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
