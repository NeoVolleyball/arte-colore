/**
 * "Lavori fatti" (portfolio). To add a job, add ONE object to `projects`
 * and put its photos in public/images/portfolio/ (a 640px and a 1200px wide
 * WebP, 4:3, e.g. "cucina-rossi-640.webp" and "cucina-rossi-1200.webp").
 *
 * All entries below are EXAMPLES with illustrative images: replace them with
 * the client's real jobs and set `example: false` (or delete the field).
 */

export interface Project {
  id: string;
  /** Short title, e.g. "Soggiorno con pavimento SPC rovere". Replace the example titles. */
  title: string;
  /** Town or area, e.g. "San Marco". */
  location: string;
  category: 'Pavimenti' | 'Pareti' | 'Carta da parati' | 'Decorazioni';
  /** Base path without size and extension: "/images/portfolio/lavoro-1". */
  image: string;
  /** Italian description of the photo for screen readers. */
  alt: string;
  /** Shows a "Foto di esempio" label while the photo is a placeholder. */
  example?: boolean;
  /** Bento layout hint: "wide" spans two of the three desktop columns.
   *  Tip: with 6 projects, 3 wide ones fill the grid exactly; gaps are filled automatically. */
  size?: 'wide' | 'normal';
}

export const projects: Project[] = [
  {
    id: 'lavoro-1',
    title: 'Pavimento effetto rovere',
    location: '[LOCALITÀ]',
    category: 'Pavimenti',
    image: '/images/portfolio/lavoro-1',
    alt: 'Immagine di esempio: pavimento a doghe effetto rovere chiaro',
    example: true,
    size: 'wide',
  },
  {
    id: 'lavoro-2',
    title: 'Parete color terracotta',
    location: '[LOCALITÀ]',
    category: 'Pareti',
    image: '/images/portfolio/lavoro-2',
    alt: 'Immagine di esempio: parete dipinta color terracotta sopra un pavimento in legno',
    example: true,
  },
  {
    id: 'lavoro-3',
    title: 'Pavimento effetto pietra',
    location: '[LOCALITÀ]',
    category: 'Pavimenti',
    image: '/images/portfolio/lavoro-3',
    alt: 'Immagine di esempio: pavimento a lastre effetto pietra grigia',
    example: true,
  },
  {
    id: 'lavoro-4',
    title: 'Posa a spina di pesce',
    location: '[LOCALITÀ]',
    category: 'Pavimenti',
    image: '/images/portfolio/lavoro-4',
    alt: 'Immagine di esempio: pavimento in legno posato a spina di pesce',
    example: true,
    size: 'wide',
  },
  {
    id: 'lavoro-5',
    title: 'Parete verde salvia',
    location: '[LOCALITÀ]',
    category: 'Pareti',
    image: '/images/portfolio/lavoro-5',
    alt: 'Immagine di esempio: parete verde salvia con un quadro e una pianta',
    example: true,
    size: 'wide',
  },
  {
    id: 'lavoro-6',
    title: 'Pavimento effetto noce',
    location: '[LOCALITÀ]',
    category: 'Pavimenti',
    image: '/images/portfolio/lavoro-6',
    alt: 'Immagine di esempio: pavimento a doghe effetto noce scuro',
    example: true,
  },
];
