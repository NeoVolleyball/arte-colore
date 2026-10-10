/**
 * Site-wide facts and copy. EVERY value in square brackets is a placeholder
 * that must be replaced before publishing (see PLACEHOLDERS.md).
 * Nothing here is a verified business fact yet.
 */

/** True while a value still contains a [PLACEHOLDER]. */
export const isPlaceholder = (value: string) => /\[[^\]]+\]/.test(value);

/** Production address of the site (used by SEO tags, sitemap and the footer QR code).
 *  Can also be set at build time with VITE_SITE_URL. */
const siteUrl = (
  (import.meta.env?.VITE_SITE_URL as string | undefined) || 'https://www.[DOMINIO-SITO].it'
).replace(/\/$/, '');

export const site = {
  brand: 'Arte Colore',
  url: siteUrl,
  tagline: 'Pavimenti, pareti e decorazioni',

  contact: {
    /** As shown on the page, e.g. "041 123 4567". */
    phoneDisplay: '[TELEFONO]',
    /** International format without spaces, e.g. "+390411234567". */
    phoneIntl: '[TELEFONO_INTERNAZIONALE]',
    /** WhatsApp number, digits only with country code, e.g. "393331234567". */
    whatsapp: '[WHATSAPP]',
    whatsappMessage: 'Buongiorno, vorrei un preventivo per',
    email: '[EMAIL]',
    address: {
      street: '[INDIRIZZO]',
      postalCode: '[CAP]',
      city: '[CITTÀ]',
      province: '[PROVINCIA]',
    },
    /** e.g. "Lun–Ven 8:00–18:00". Leave as is to keep it hidden. */
    hours: '[ORARI]',
  },

  links: {
    facebook: 'https://www.facebook.com/[PAGINA-FACEBOOK]',
    /** Map or San Marco page for the "Zone servite" button. */
    zoneMap: 'https://[LINK-MAPPA-O-PAGINA-SAN-MARCO]',
  },

  seo: {
    title: 'Arte Colore | Pavimenti SPC, pitture e carta da parati',
    description:
      'Rinnoviamo pavimenti e pareti: pavimenti in laminato SPC posati senza demolizioni, carta da parati e decorazioni. Richiedi un preventivo.',
    ogImage: '/og-image.png',
    themeColor: '#a3432a',
  },

  hero: {
    titleStart: 'Dai nuova vita ai tuoi',
    rotatingWords: ['pavimenti', 'pareti', 'spazi'],
    subline:
      'Rinnovo di interni con pavimenti in laminato SPC, carta da parati e decorazioni: dalla scelta dei materiali al lavoro finito.',
  },

  spc: {
    badge: 'Novità · Pavimenti in laminato SPC',
    /*
     * Headline options: swap the active one if you prefer.
     *  - "Il pavimento nuovo, sopra quello vecchio"
     *  - "Un pavimento nuovo, senza cantiere"
     */
    title: 'Cambia pavimento senza cambiare nulla',
    intro:
      'Il laminato SPC si posa sopra il pavimento esistente: la casa si rinnova e la vita di tutti i giorni continua.',
    benefits: [
      {
        title: 'Posa rapida e senza demolizioni',
        text: 'Niente da rompere né da portare via: il nuovo pavimento si posa sopra quello che hai già.',
      },
      {
        title: 'Resistente all’acqua',
        text: 'Adatto anche a cucine, bagni e ingressi, dove schizzi e umidità sono di casa.',
      },
      {
        title: 'Effetto legno o pietra realistico',
        text: 'Venature e texture curate nei dettagli, in tante tonalità da scegliere insieme.',
      },
    ],
  },

  zones: {
    title: 'Zone servite',
    intro: 'Operiamo nelle zone di San Marco e Belle Arti e nei dintorni. Non trovi la tua zona? Chiedici pure.',
    areas: ['San Marco', 'Belle Arti'],
    cta: 'Vedi sulla mappa',
  },
} as const;

/** Ready-made links built from the contact placeholders. */
export const contactLinks = {
  tel: `tel:${site.contact.phoneIntl}`,
  whatsapp: `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(site.contact.whatsappMessage)}`,
  mailto: `mailto:${site.contact.email}`,
};

export const navLinks = [
  { id: 'spc', label: 'Pavimenti SPC' },
  { id: 'lavori', label: 'Lavori fatti' },
  { id: 'decorativi', label: 'Decorativi' },
  { id: 'sconti', label: 'Sconti' },
  { id: 'zone', label: 'Zone servite' },
  { id: 'contatti', label: 'Contatti' },
] as const;

/** schema.org LocalBusiness (HomeAndConstructionBusiness subtype).
 *  Placeholders are included as-is and must be replaced before publishing. */
export function localBusinessJsonLd() {
  const c = site.contact;
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: site.brand,
    description: site.seo.description,
    url: `${site.url}/`,
    image: `${site.url}${site.seo.ogImage}`,
    logo: `${site.url}/logo.svg`,
    telephone: c.phoneIntl,
    email: c.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: c.address.street,
      postalCode: c.address.postalCode,
      addressLocality: c.address.city,
      addressRegion: c.address.province,
      addressCountry: 'IT',
    },
    areaServed: site.zones.areas,
    sameAs: [site.links.facebook],
  };
}
