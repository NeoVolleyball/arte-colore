/*
 * OFFERTE (SCONTI): COME MODIFICARLE
 * ----------------------------------
 * Ogni offerta è un oggetto nell'elenco `offers` qui sotto. Per modificarne una
 * cambia il testo tra virgolette o i numeri, salva e ripubblica il sito.
 *
 *   id        nome breve univoco, senza spazi (es. "spc-rovere-2026")
 *   title     titolo mostrato sulla scheda
 *   image     foto in public/images/offers/ (es. "/images/offers/mia-foto.webp")
 *   imageAlt  descrizione della foto per chi non vede (in italiano)
 *   color     colore o variante (es. "Rovere naturale")
 *   oldPrice  prezzo pieno in euro, solo numero (es. 39.9)
 *   newPrice  prezzo scontato in euro, solo numero (es. 29.9)
 *   unit      unità del prezzo (es. "al m²"), oppure "" se non serve
 *   endsAt    ultimo giorno dell'offerta, formato "AAAA-MM-GG" (es. "2026-12-31").
 *             L'offerta resta visibile fino alle 23:59 di quel giorno, ora italiana.
 *   active    true = visibile, false = nascosta
 *
 * Il prezzo scontato (newPrice) deve essere più basso di quello pieno (oldPrice),
 * altrimenti l'offerta non viene mostrata.
 *
 * Le offerte scadute o con active: false spariscono da sole. Se non resta
 * nessuna offerta attiva, la sezione "Sconti" e la sua voce di menu si nascondono.
 *
 * ATTENZIONE: le tre offerte qui sotto sono SOLO ESEMPI (prezzi e date inventati
 * per mostrare il funzionamento). Sostituiscile con offerte vere prima di pubblicare.
 */

export interface Offer {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  color: string;
  oldPrice: number;
  newPrice: number;
  unit: string;
  /** "YYYY-MM-DD" (end of that day, Europe/Rome) or a full ISO date-time with offset. */
  endsAt: string;
  active: boolean;
}

export const offers: Offer[] = [
  {
    id: 'esempio-spc-rovere',
    title: '[ESEMPIO] Pavimento SPC effetto legno',
    image: '/images/offers/offerta-1.webp',
    imageAlt: 'Immagine segnaposto: doghe di pavimento effetto legno chiaro',
    color: 'Rovere naturale',
    oldPrice: 39.9,
    newPrice: 29.9,
    unit: 'al m²',
    endsAt: '2026-12-31',
    active: true,
  },
  {
    id: 'esempio-spc-pietra',
    title: '[ESEMPIO] Pavimento SPC effetto pietra',
    image: '/images/offers/offerta-2.webp',
    imageAlt: 'Immagine segnaposto: piastrelle effetto pietra grigio caldo',
    color: 'Pietra grigia',
    oldPrice: 44.9,
    newPrice: 34.9,
    unit: 'al m²',
    endsAt: '2026-11-30',
    active: true,
  },
  {
    id: 'esempio-carta-parati',
    title: '[ESEMPIO] Carta da parati decorativa',
    image: '/images/offers/offerta-3.webp',
    imageAlt: 'Immagine segnaposto: carta da parati con motivo botanico verde salvia',
    color: 'Verde salvia',
    oldPrice: 59,
    newPrice: 45,
    unit: 'al rotolo',
    endsAt: '2027-01-31',
    active: true,
  },
];
