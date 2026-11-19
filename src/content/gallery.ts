/**
 * PHOTOS: one place for the "I nostri lavori" and "Carta da parati" images.
 *
 * To add a photo: put the file in public/images/lavori/ (or public/images/carta-da-parati/),
 * ideally WebP, about 1200 px wide, then set `image` on an entry below and write a
 * short Italian `alt` describing the photo. Entries without `image` show a
 * clearly marked "Foto in arrivo" placeholder. Add or remove entries freely.
 */
export type Photo = {
  id: string;
  /** e.g. '/images/lavori/soggiorno-mirano.webp' */
  image?: string;
  /** what the photo shows (for screen readers and Google) */
  alt: string;
  title: string;
  /** town or neighbourhood, e.g. 'Mirano' */
  place?: string;
};

export const works: Photo[] = [
  { id: 'lavoro-1', title: 'Pittura soggiorno', place: 'Località', alt: '' },
  { id: 'lavoro-2', title: 'Posa carta da parati', place: 'Località', alt: '' },
  { id: 'lavoro-3', title: 'Pavimento SPC', place: 'Località', alt: '' },
  { id: 'lavoro-4', title: 'Parete decorativa', place: 'Località', alt: '' },
  { id: 'lavoro-5', title: 'Camera da letto', place: 'Località', alt: '' },
  { id: 'lavoro-6', title: 'Smalto porte e infissi', place: 'Località', alt: '' },
];

/** Photo next to the "Pavimenti in laminato SPC" highlight on the homepage. */
export const spcPhoto: Photo = {
  id: 'spc',
  title: 'Pavimenti in laminato e SPC',
  image: '/images/negozio/pavimenti-skema-2-1280.webp',
  alt: 'Espositori Skema in negozio con doghe di pavimento laminato e SPC in diverse essenze di legno e un campione a spina di pesce.',
};

/** "Cornici su misura": PLACEHOLDERS — put photos in public/images/cornici/ and set `image` + `alt`. */
export const framePhotos: Photo[] = [
  { id: 'cornice-1', title: 'Cornice su misura', alt: '' },
  { id: 'cornice-2', title: 'Cornice su misura', alt: '' },
  { id: 'cornice-3', title: 'Cornice su misura', alt: '' },
];

/** Carta da parati: 3 room photos sent by the owner (Nov 2026), cropped to 3:4.
 *  Files: public/images/carta-da-parati/. */
export const wallpapers: Photo[] = [
  {
    id: 'carta-1',
    title: 'Camera in toni caldi',
    image: '/images/carta-da-parati/carta-camera-beige.webp',
    alt: 'Camera da letto con parete dietro il letto in carta da parati beige a grandi petali, letto in legno con cuscini grigi, comodino e lampada a sfera.',
  },
  {
    id: 'carta-2',
    title: 'Zig zag azzurro',
    image: '/images/carta-da-parati/carta-zigzag-azzurro.webp',
    alt: 'Parete in carta da parati azzurra con motivo a zig zag, davanti a una panca bianca morbida e a un tavolino in rattan.',
  },
  {
    id: 'carta-3',
    title: 'Rami fioriti su verde salvia',
    image: '/images/carta-da-parati/carta-rami-fioriti.webp',
    alt: 'Carta da parati verde salvia con rami fioriti, accanto a una scala in legno, una panca e un vaso con fiori arancioni.',
  },
];

/**
 * "Reparti": real photos of the shop sent by the owner (WhatsApp, Nov 2026),
 * grouped by the departments he named. Files: public/images/negozio/<file>-{640,1280}.webp.
 */
export type Department = {
  id: string;
  name: string;
  text: string;
  photos: { file: string; alt: string; w: number; h: number }[];
};

const L = { w: 1280, h: 960 };
const P = { w: 960, h: 1280 };

export const departments: Department[] = [
  {
    id: 'pitture',
    name: 'Idropitture, smalti e impregnanti',
    text: 'Pitture per interni ed esterni, smalti, impregnanti e trattamenti antimuffa.',
    photos: [
      { file: 'idropitture-san-marco', ...P, alt: 'Pile di secchi di idropittura San Marco Professional e Acrilyt in negozio.' },
      { file: 'pitture-scaffale', ...L, alt: 'Scaffali con barattoli di pitture, smalti e prodotti per la decorazione.' },
      { file: 'smalti-scaffale', ...L, alt: 'Corsia con scaffali pieni di barattoli di smalti e vernici.' },
      { file: 'impregnanti-antimuffa', ...L, alt: 'Scaffale con trattamenti antimuffa e risananti.' },
      { file: 'idropitture-secchi', ...L, alt: 'Secchi di idropittura per interni ed esterni impilati sul pavimento del negozio.' },
      { file: 'smalti-spray', ...P, alt: 'Espositore di bombolette di vernice spray in molti colori.' },
    ],
  },
  {
    id: 'pavimenti',
    name: 'Pavimenti laminati e SPC',
    text: 'Doghe e campioni da vedere e toccare in negozio.',
    photos: [
      { file: 'pavimenti-skema-1', ...P, alt: 'Espositore Skema con doghe di pavimento in laminato e SPC in varie essenze.' },
      { file: 'pavimenti-skema-2', ...P, alt: 'Espositori Skema con campioni di pavimento e un esempio di posa a spina di pesce.' },
      { file: 'pavimenti-maccani', ...P, alt: 'Espositore Maccani Pavimenti con campioni di pavimento in laminato.' },
    ],
  },
  {
    id: 'carta',
    name: 'Carte da parati',
    text: 'Campionari da sfogliare con calma, anche autoadesive.',
    photos: [
      { file: 'carta-da-parati-campionari', ...L, alt: 'Campionari di carta da parati aperti sul bancone: motivi floreali, effetto lino e foglie.' },
      { file: 'carta-da-parati-catalogo', ...L, alt: 'Catalogo di carta da parati aperto su un motivo floreale rosa ambientato in una stanza.' },
    ],
  },
  {
    id: 'belle-arti',
    name: 'Belle arti',
    text: 'Colori a olio e acrilici, pennelli e tele per dipingere.',
    photos: [
      { file: 'belle-arti-pennelli-colori', ...P, alt: 'Espositore di pennelli da belle arti accanto a uno scaffale di tubetti di colore Maimeri.' },
      { file: 'belle-arti-tele', ...P, alt: 'Tele bianche per dipingere impilate sopra uno scaffale di barattoli di pittura.' },
    ],
  },
  {
    id: 'accessori',
    name: 'Accessori',
    text: 'Pennelli, rulli, nastri, spatole, guanti e tutto per lavorare bene.',
    photos: [
      { file: 'accessori-pennelli-rulli', ...L, alt: 'Parete attrezzata con pennelli, plafoncini e rulli per pittura.' },
      { file: 'accessori-nastri-spatole', ...L, alt: 'Nastri adesivi di carta, spatole, raschietti e rulli esposti su pannelli forati.' },
      { file: 'accessori-guanti', ...P, alt: 'Espositore di guanti da lavoro di diverse taglie.' },
      { file: 'accessori-attrezzi', ...P, alt: 'Guanti, fruste miscelatrici, nastri e accessori per la pittura esposti in negozio.' },
    ],
  },
  {
    id: 'abrasivi',
    name: 'Abrasivi',
    text: 'Dischi, carte abrasive e spugne per preparare le superfici.',
    photos: [{ file: 'abrasivi', ...P, alt: 'Espositore SAIT con dischi da taglio, dischi abrasivi e rotoli di carta vetrata.' }],
  },
  {
    id: 'chiavi',
    name: 'Duplicazione chiavi',
    text: 'Duplichiamo le chiavi in negozio.',
    photos: [{ file: 'duplicazione-chiavi', ...L, alt: 'Banco per la duplicazione chiavi con due macchine duplicatrici e una parete di chiavi grezze.' }],
  },
];
