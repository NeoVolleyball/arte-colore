import { business, maps, structuredData } from '../content/business';

describe('business data', () => {
  it('uses the verified contact details', () => {
    expect(business.legalName).toBe('Arte Colore S.r.l.');
    expect(business.address.street).toBe('Via Roma 175');
    expect(business.address.postalCode).toBe('30038');
    expect(business.phone.href).toBe('tel:+39041990950');
    expect(business.vatNumber).toBe('04463040271');
    expect(business.openingHours).toBeNull();
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
    for (const k of ['openingHours', 'openingHoursSpecification', 'geo', 'aggregateRating', 'review', 'sameAs', 'email', 'url']) {
      expect(sd).not.toHaveProperty(k);
    }
    expect(structuredData('https://example.it')).toHaveProperty('url', 'https://example.it/');
  });
});
