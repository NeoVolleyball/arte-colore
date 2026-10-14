/**
 * "Decorativi" (carta da parati). Add ONE object per wallpaper and put its
 * photo in public/images/wallpapers/ (480px and 800px wide WebP, 4:5,
 * e.g. "foglie-480.webp" and "foglie-800.webp").
 *
 * The entries below are EXAMPLES with illustrative pattern images.
 */

export interface Wallpaper {
  id: string;
  title: string;
  description: string;
  /** Pattern or room type tag, e.g. "Botanico" or "Camera da letto". */
  tag: string;
  /** Base path without size and extension: "/images/wallpapers/carta-1". */
  image: string;
  alt: string;
  example?: boolean;
}

export const wallpapers: Wallpaper[] = [
  {
    id: 'carta-1',
    title: 'Botanico',
    description: 'Foglie morbide e toni naturali per portare calma in camera o in salotto.',
    tag: 'Camera da letto',
    image: '/images/wallpapers/carta-1',
    alt: 'Esempio di carta da parati con motivo di foglie verde salvia su fondo chiaro',
    example: true,
  },
  {
    id: 'carta-2',
    title: 'Geometrico',
    description: 'Archi e ventagli dal gusto rétro per dare carattere a una parete d’accento.',
    tag: 'Parete d’accento',
    image: '/images/wallpapers/carta-2',
    alt: 'Esempio di carta da parati con archi concentrici color ocra',
    example: true,
  },
  {
    id: 'carta-3',
    title: 'Righe',
    description: 'Righe sottili che slanciano la stanza e si abbinano a ogni stile.',
    tag: 'Ingresso',
    image: '/images/wallpapers/carta-3',
    alt: 'Esempio di carta da parati a righe verticali color terracotta',
    example: true,
  },
  {
    id: 'carta-4',
    title: 'Classico scuro',
    description: 'Fondo profondo e piccoli motivi dorati per un ambiente elegante.',
    tag: 'Sala da pranzo',
    image: '/images/wallpapers/carta-4',
    alt: 'Esempio di carta da parati blu notte con piccoli rombi dorati',
    example: true,
  },
];
