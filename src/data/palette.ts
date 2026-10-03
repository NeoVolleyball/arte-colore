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

export function isDark(hex: string): boolean {
  return luminance(hex) < 0.2;
}

export const COLOUR_EVENT = 'artecolore:colour';
