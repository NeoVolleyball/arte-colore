import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { departments, spcPhoto, wallpapers } from '../content/gallery';

const pub = (p: string) => resolve(__dirname, '../../public', p.replace(/^\//, ''));

describe('shop photos', () => {
  it('every department photo exists in both sizes and has alt text', () => {
    for (const d of departments) {
      expect(d.photos.length).toBeGreaterThan(0);
      for (const p of d.photos) {
        expect(p.alt.length).toBeGreaterThan(10);
        for (const w of [640, 1280]) expect(existsSync(pub(`/images/negozio/${p.file}-${w}.webp`))).toBe(true);
      }
    }
  });

  it('SPC and wallpaper photos point to real files', () => {
    for (const p of [spcPhoto, ...wallpapers]) {
      expect(p.image && existsSync(pub(p.image))).toBe(true);
      expect(p.alt).not.toBe('');
    }
  });
});
