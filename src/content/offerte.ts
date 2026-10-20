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
 * `demo: true` entries are layout examples, shown with a "Demo di esempio" badge.
 * They appear in the published site only while SHOW_DEMO_OFFERS is true.
 */

/** Set to false (or delete the demo entries) once the real offers are in. */
export const SHOW_DEMO_OFFERS = true;

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
  // DEMO – da sostituire con offerte reali (tutte le voci con demo: true)
  {
    id: 'demo-pittura',
    name: 'Pittura murale bianca lavabile',
    detail: 'Bianco opaco, alta copertura, 14 litri',
    image: '/images/offerte/offerta-pittura-bianca.webp',
    oldPrice: 89.9,
    newPrice: 64.9,
    ends: '2026-10-24',
    tone: 'sage',
    demo: true,
  },
  {
    id: 'demo-smalto',
    name: 'Smalto per legno e ferro',
    detail: 'All’acqua, colori a scelta, 0,75 litri',
    image: '/images/offerte/offerta-smalto.webp',
    oldPrice: 24.5,
    newPrice: 18.9,
    ends: '2026-10-28',
    tone: 'terra',
    demo: true,
  },
  {
    id: 'demo-carta',
    name: 'Carta da parati decorativa',
    detail: 'Motivo botanico, rotolo 0,53 × 10 m',
    image: '/images/offerte/offerta-carta-da-parati.webp',
    oldPrice: 39,
    newPrice: 29,
    ends: '2026-11-02',
    tone: 'ochre',
    demo: true,
  },
  {
    id: 'demo-pavimento',
    name: 'Pavimento laminato SPC',
    detail: 'Effetto rovere, impermeabile, prezzo al m²',
    image: '/images/offerte/offerta-pavimento-spc.webp',
    oldPrice: 32.9,
    newPrice: 24.9,
    ends: '2026-11-09',
    tone: 'green',
    demo: true,
  },
  {
    id: 'demo-kit',
    name: 'Kit pennelli e rulli',
    detail: 'Rullo, vaschetta e 2 pennelli',
    image: '/images/offerte/offerta-kit-pennelli.webp',
    oldPrice: 29.9,
    newPrice: 17.9,
    ends: '2026-11-16',
    tone: 'sage',
    demo: true,
  },
  {
    id: 'demo-stucco',
    name: 'Stucco in pasta per pareti',
    detail: 'Pronto all’uso, per crepe e fori, 1 kg',
    image: '/images/offerte/offerta-stucco.webp',
    oldPrice: 12.9,
    newPrice: 9.9,
    ends: '2026-11-23',
    tone: 'terra',
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

/** Offers that may be published (demo entries only in development or while SHOW_DEMO_OFFERS is on). */
export function publishedOffers(
  list: Offer[] = offers,
  showDemo = SHOW_DEMO_OFFERS || Boolean(import.meta.env?.DEV),
): Offer[] {
  return list.filter((o) => showDemo || !o.demo);
}

const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });
export const formatPrice = (n: number) => euro.format(n);

const dayFmt = new Intl.DateTimeFormat('it-IT', { timeZone: ROME, day: 'numeric', month: 'long' });
export const formatEndDay = (ymd: string) => dayFmt.format(offerEnd(ymd));
