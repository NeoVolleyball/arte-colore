import { fireEvent, render, screen, within } from '@testing-library/react';
import { ColourExplorer } from '../components/ColourExplorer';
import { COLOUR_EVENT, colours, contrast, families, initialColour, inkFor } from '../data/palette';

const group = () => screen.getByRole('radiogroup', { name: 'Colori di esempio' });
const radios = () => within(group()).getAllByRole('radio');

describe('palette data', () => {
  it('has 12–18 colours with unique ids, valid hex and known families', () => {
    expect(colours.length).toBeGreaterThanOrEqual(12);
    expect(colours.length).toBeLessThanOrEqual(18);
    expect(new Set(colours.map((c) => c.id)).size).toBe(colours.length);
    const fam = new Set(families.map((f) => f.id));
    for (const c of colours) {
      expect(c.hex).toMatch(/^#[0-9A-F]{6}$/);
      expect(fam.has(c.family)).toBe(true);
    }
  });

  it('every colour gets a text ink that meets WCAG AA (4.5:1)', () => {
    for (const c of colours) {
      expect(contrast(c.hex, inkFor(c.hex).ink)).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('ColourExplorer', () => {
  it('starts on the initial colour with the illustrative disclaimer', () => {
    render(<ColourExplorer />);
    const checked = radios().filter((r) => r.getAttribute('aria-checked') === 'true');
    expect(checked).toHaveLength(1);
    expect(checked[0].textContent).toContain(initialColour.name);
    expect(
      screen.getByText(
        'Colori illustrativi: la resa sullo schermo può differire dal colore reale. Verifica la tonalità in negozio.',
      ),
    ).toBeTruthy();
  });

  it('filters by family', () => {
    render(<ColourExplorer />);
    for (const f of families) {
      fireEvent.click(screen.getByRole('button', { name: f.label }));
      expect(screen.getByRole('button', { name: f.label }).getAttribute('aria-pressed')).toBe('true');
      expect(radios()).toHaveLength(colours.filter((c) => c.family === f.id).length);
    }
    fireEvent.click(screen.getByRole('button', { name: 'Tutti' }));
    expect(radios()).toHaveLength(colours.length);
  });

  it('selects with click and keyboard, updates preview label and broadcasts the colour', () => {
    const heard: string[] = [];
    const listener = (e: Event) => heard.push((e as CustomEvent<string>).detail);
    window.addEventListener(COLOUR_EVENT, listener);
    render(<ColourExplorer />);
    const target = colours.find((c) => c.id === 'salvia')!;
    fireEvent.click(within(group()).getByRole('radio', { name: new RegExp(target.name) }));
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain(target.hex);
    expect(heard.at(-1)).toBe(target.hex);

    const idx = colours.indexOf(target);
    fireEvent.keyDown(radios()[idx], { key: 'ArrowRight' });
    expect(radios()[idx + 1].getAttribute('aria-checked')).toBe('true');
    expect(document.activeElement).toBe(radios()[idx + 1]);
    expect(radios().filter((r) => r.tabIndex === 0)).toHaveLength(1);
    window.removeEventListener(COLOUR_EVENT, listener);
  });

  it('reset restores the initial colour and the full list', () => {
    render(<ColourExplorer />);
    fireEvent.click(screen.getByRole('button', { name: 'Accenti' }));
    fireEvent.click(radios()[0]);
    fireEvent.click(screen.getByRole('button', { name: /Ripristina il colore iniziale/ }));
    expect(radios()).toHaveLength(colours.length);
    const checked = radios().find((r) => r.getAttribute('aria-checked') === 'true');
    expect(checked?.textContent).toContain(initialColour.name);
  });
});
