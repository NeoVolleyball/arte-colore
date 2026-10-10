/**
 * The only module allowed to read offer data. Components call
 * `getActiveOffers()` and never import `offers.ts` directly.
 *
 * PHASE 2: replace the body of `fetchAllOffers()` with a Supabase query
 * (table `offers`, public read via Row Level Security). Nothing else changes.
 */
import { offers, type Offer } from './offers';

export type { Offer };

export const OFFERS_TIME_ZONE = 'Europe/Rome';

async function fetchAllOffers(): Promise<Offer[]> {
  return offers;
}

/** Minutes east of UTC for `timeZone` at the given instant (e.g. +60 / +120 for Rome). */
function zoneOffsetMinutes(at: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(at);
  const n = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(n('year'), n('month') - 1, n('day'), n('hour'), n('minute'), n('second'));
  return Math.round((asUtc - Math.floor(at.getTime() / 1000) * 1000) / 60000);
}

/**
 * End of an offer as a UTC timestamp (ms). A plain "YYYY-MM-DD" means
 * 23:59:59 of that day in Italy, whatever the visitor's own time zone.
 */
export function offerEndTime(endsAt: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(endsAt.trim());
  if (!m) return new Date(endsAt).getTime();
  const wallClock = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 23, 59, 59);
  // Two passes settle the offset around DST changes.
  let utc = wallClock - zoneOffsetMinutes(new Date(wallClock), OFFERS_TIME_ZONE) * 60000;
  utc = wallClock - zoneOffsetMinutes(new Date(utc), OFFERS_TIME_ZONE) * 60000;
  return utc;
}

export function isOfferLive(offer: Offer, now = Date.now()): boolean {
  const end = offerEndTime(offer.endsAt);
  return offer.active && Number.isFinite(end) && end > now && offer.newPrice < offer.oldPrice;
}

/** Active, not yet expired offers, soonest-ending first. */
export async function getActiveOffers(now = Date.now()): Promise<Offer[]> {
  const all = await fetchAllOffers();
  return all
    .filter((o) => isOfferLive(o, now))
    .sort((a, b) => offerEndTime(a.endsAt) - offerEndTime(b.endsAt));
}
