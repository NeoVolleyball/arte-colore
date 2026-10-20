import { isActive, offerEnd, publishedOffers, type Offer } from '../content/offerte';

const offer = (ends: string, demo = false): Offer => ({ id: ends, name: 'x', oldPrice: 10, newPrice: 8, ends, demo });

describe('offers', () => {
  it('ends at 23:59:59 Italian time, in summer and winter', () => {
    expect(new Date(offerEnd('2026-07-15')).toISOString()).toBe('2026-07-15T21:59:59.000Z');
    expect(new Date(offerEnd('2026-12-15')).toISOString()).toBe('2026-12-15T22:59:59.000Z');
  });

  it('hides expired offers', () => {
    const o = offer('2026-12-15');
    expect(isActive(o, Date.parse('2026-12-15T22:00:00Z'))).toBe(true);
    expect(isActive(o, Date.parse('2026-12-15T23:00:00Z'))).toBe(false);
  });

  it('never publishes demo offers outside development', () => {
    const list = [offer('2026-12-01', true), offer('2026-12-02')];
    expect(publishedOffers(list, false).map((o) => o.ends)).toEqual(['2026-12-02']);
    expect(publishedOffers(list, true)).toHaveLength(2);
  });
});
