import raw from './palette.json';

export type FamilyId = 'neutri' | 'caldi' | 'freddi' | 'accenti';

export interface Colour {
  id: string;
  name: string;
  hex: string;
  family: FamilyId;
  note: string;
}

export interface Family {
  id: FamilyId;
  label: string;
}

export const families = raw.families as Family[];
export const colours = raw.colours as Colour[];

export const initialColour: Colour =
  colours.find((c) => c.id === raw.initial) ?? colours[0];

export function colourById(id: string): Colour | undefined {
  return colours.find((c) => c.id === id);
}

/** Relative luminance (WCAG) for picking readable text on a swatch. */
export function luminance(hex: string): number {
  const v = hex.replace('#', '');
  const ch = [0, 2, 4].map((i) => {
    const c = parseInt(v.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

export function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

/** Text ink for a colour background: whichever of near-black / ivory gives
 *  the higher contrast (every palette colour reaches AA, see tests). */
export const INK_DARK = '#161714';
export const INK_LIGHT = '#F7F3EB';

export function inkFor(hex: string) {
  const dark = contrast(hex, INK_LIGHT) > contrast(hex, INK_DARK);
  return dark
    ? { dark, ink: INK_LIGHT, soft: INK_LIGHT }
    : { dark, ink: INK_DARK, soft: INK_DARK };
}

export const COLOUR_EVENT = 'artecolore:colour';
