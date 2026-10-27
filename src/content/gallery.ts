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
export const spcPhoto: Photo = { id: 'spc', title: 'Pavimento in laminato SPC', alt: '' };

/** "Cornici su misura": PLACEHOLDERS — put photos in public/images/cornici/ and set `image` + `alt`. */
export const framePhotos: Photo[] = [
  { id: 'cornice-1', title: 'Cornice su misura', alt: '' },
  { id: 'cornice-2', title: 'Cornice su misura', alt: '' },
  { id: 'cornice-3', title: 'Cornice su misura', alt: '' },
];

export const wallpapers: Photo[] = [
  { id: 'carta-1', title: 'Parete d’accento', alt: '' },
  { id: 'carta-2', title: 'Motivo floreale', alt: '' },
  { id: 'carta-3', title: 'Effetto materico', alt: '' },
];
