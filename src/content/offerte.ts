/**
 * OFFERTE: edit this list to add, change or remove offers.
 *
 * - name:      product name shown on the card
 * - detail:    optional short line (size, finish, colour…)
 * - image:     optional photo in public/, e.g. '/images/offerte/smalto-bianco.webp'
 *              (square photos look best; without one a placeholder is shown)
 * - oldPrice / newPrice: euro amounts, e.g. 49.9
 * - ends:      last day of the offer, 'YYYY-MM-DD' (valid until 23:59, Italian time)
 *
 * Expired offers disappear by themselves. With no active offers the section
 * shows a short message instead.
 *
 * `demo: true` entries are layout examples: they only appear with `npm run dev`
 * and never in the published site.
 */
export type Offer = {
  id: string;
  name: string;
  detail?: string;
  image?: string;
  oldPrice: number;
  newPrice: number;
  ends: string;
  tone?: 'sage' | 'terra' | 'ochre' | 'green';
  demo?: boolean;
};

export const offers: Offer[] = [
  {
    id: 'demo-pittura',
    name: 'Pittura murale lavabile',
    detail: 'Bianco, 14 litri',
    image: '/images/product-pitture-540.webp',
    oldPrice: 89.9,
    newPrice: 69.9,
    ends: '2026-11-30',
    tone: 'sage',
    demo: true,
  },
  {
    id: 'demo-smalto',
    name: 'Smalto all’acqua',
    detail: 'Colori a scelta, 0,75 litri',
    image: '/images/product-smalti-540.webp',
    oldPrice: 24.5,
    newPrice: 18.9,
    ends: '2026-11-15',
    tone: 'terra',
    demo: true,
  },
  {
    id: 'demo-kit',
    name: 'Kit rullo e pennelli',
    detail: 'Per pareti e soffitti',
    oldPrice: 32,
    newPrice: 24,
    ends: '2026-12-20',
    tone: 'ochre',
    demo: true,
  },
];

const ROME = 'Europe/Rome';

/** End of the given day (23:59:59) in Italian time, as a timestamp. */
export function offerEnd(ymd: string): number {
  const [y, m, d] = ymd.split('-').map(Number);
  // Rome is UTC+1 or UTC+2: start from +1 and step back if the clock reads 00:59
  let t = Date.UTC(y, m - 1, d, 23, 59, 59) - 3600_000;
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', { timeZone: ROME, hour: '2-digit', hourCycle: 'h23' }).format(t),
  );
  if (hour !== 23) t -= 3600_000;
  return t;
}

export function isActive(offer: Offer, now: number): boolean {
  return offerEnd(offer.ends) > now;
}

/** Offers that may be published (demo entries only in development). */
export function publishedOffers(list: Offer[] = offers, dev = Boolean(import.meta.env?.DEV)): Offer[] {
  return list.filter((o) => dev || !o.demo);
}

const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });
export const formatPrice = (n: number) => euro.format(n);

const dayFmt = new Intl.DateTimeFormat('it-IT', { timeZone: ROME, day: 'numeric', month: 'long' });
export const formatEndDay = (ymd: string) => dayFmt.format(offerEnd(ymd));
