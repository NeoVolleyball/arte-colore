import { fireEvent, render, screen } from '@testing-library/react';
import { SiteHeader } from '../components/SiteHeader';

describe('SiteHeader', () => {
  it('toggles the mobile menu, moves focus in, closes on Escape and restores focus', () => {
    render(<SiteHeader page="home" />);
    const toggle = screen.getByRole('button', { name: 'Apri il menu' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    const panel = document.getElementById('menu-mobile')!;
    expect(panel.hidden).toBe(false);
    expect(panel.contains(document.activeElement)).toBe(true);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(panel.hidden).toBe(true);
    expect(document.activeElement).toBe(toggle);
  });

  it('marks the current page and links the phone', () => {
    render(<SiteHeader page="prodotti" />);
    const current = screen.getAllByRole('link', { name: 'Prodotti' }).filter((a) => a.getAttribute('aria-current') === 'page');
    expect(current.length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /Chiamaci/ }).getAttribute('href')).toBe('tel:+39041990950');
  });
});
