import { business, maps, structuredData } from '../content/business';

describe('business data', () => {
  it('uses the verified contact details', () => {
    expect(business.legalName).toBe('Arte Colore S.r.l.');
    expect(business.address.street).toBe('Via Roma 175');
    expect(business.address.postalCode).toBe('30038');
    expect(business.phone.href).toBe('tel:+39041990950');
    expect(business.vatNumber).toBe('04463040271');
    expect(business.email).toBe('info@artecolorearl.it');
    expect(business.openingHours.map((o) => o.hours)).toEqual(['8.00–12.30 · 15.00–19.00', '8.00–12.00']);
  });

  it('builds a directions URL for the shop address without a place id', () => {
    const url = new URL(maps.directionsUrl);
    expect(url.hostname).toBe('www.google.com');
    expect(url.searchParams.get('destination')).toBe('Arte Colore, Via Roma 175, 30038 Spinea VE, Italia');
    expect(url.search).not.toMatch(/place_id/);
  });

  it('structured data contains only verified facts', () => {
    const sd = structuredData('') as Record<string, unknown>;
    expect(sd.name).toBe('Arte Colore');
    expect(sd.telephone).toBe('+39041990950');
    expect(sd.email).toBe('info@artecolorearl.it');
    expect(sd.openingHoursSpecification).toHaveLength(3);
    for (const k of ['geo', 'aggregateRating', 'review', 'sameAs', 'url']) {
      expect(sd).not.toHaveProperty(k);
    }
    expect(structuredData('https://example.it')).toHaveProperty('url', 'https://example.it/');
  });
});

describe('navigation', () => {
  it('lists only sections with real content (no offers or job photos yet)', async () => {
    const { nav } = await import('../content/business');
    expect(nav.map((n) => n.label)).toEqual(['Prodotti', 'Reparti', 'Pavimenti SPC', 'Carta da parati', 'Cornici', 'Contatti']);
    expect(nav.map((n) => n.href)).toEqual(['#prodotti', '#reparti', '#pavimenti', '#carta-da-parati', '#cornici', '#contatti']);
  });
});
