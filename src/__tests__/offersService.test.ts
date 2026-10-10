import { getActiveOffers, isOfferLive, offerEndTime } from '../data/offersService';
import type { Offer } from '../data/offers';

const base: Offer = {
  id: 't',
  title: 'Test',
  image: '/x.webp',
  imageAlt: '',
  color: 'Rovere',
  oldPrice: 40,
  newPrice: 30,
  unit: 'al m²',
  endsAt: '2026-12-31',
  active: true,
};

describe('offersService', () => {
  it('ends a date-only offer at 23:59:59 Rome time (winter, UTC+1)', () => {
    expect(new Date(offerEndTime('2026-12-31')).toISOString()).toBe('2026-12-31T22:59:59.000Z');
  });

  it('ends a date-only offer at 23:59:59 Rome time (summer, UTC+2)', () => {
    expect(new Date(offerEndTime('2026-07-15')).toISOString()).toBe('2026-07-15T21:59:59.000Z');
  });

  it('accepts a full ISO date-time with offset', () => {
    expect(offerEndTime('2026-11-01T12:00:00+01:00')).toBe(Date.UTC(2026, 10, 1, 11));
  });

  it('hides expired, inactive and invalid offers', () => {
    const now = Date.UTC(2026, 11, 31, 23, 30); // 00:30 on 1 Jan in Rome
    expect(isOfferLive(base, now)).toBe(false);
    expect(isOfferLive({ ...base, endsAt: '2027-01-01' }, now)).toBe(true);
    expect(isOfferLive({ ...base, endsAt: '2027-01-01', active: false }, now)).toBe(false);
    expect(isOfferLive({ ...base, endsAt: '2027-01-01', newPrice: 45 }, now)).toBe(false);
  });

  it('returns active offers soonest-ending first, and none when all expired', async () => {
    const active = await getActiveOffers(Date.UTC(2026, 9, 10));
    const ends = active.map((o) => offerEndTime(o.endsAt));
    expect(ends).toEqual([...ends].sort((a, b) => a - b));
    expect(await getActiveOffers(Date.UTC(2100, 0, 1))).toEqual([]);
  });
});
