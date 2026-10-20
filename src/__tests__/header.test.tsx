import { fireEvent, render, screen } from '@testing-library/react';
import { SiteHeader } from '../components/SiteHeader';

describe('SiteHeader', () => {
  it('toggles the mobile menu, moves focus in, closes on Escape and restores focus', () => {
    render(<SiteHeader />);
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

  it('menu items point to same-page sections and the phone is linked', () => {
    render(<SiteHeader />);
    const desktop = screen.getByRole('navigation', { name: 'Principale' });
    const hrefs = [...desktop.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['#offerte', '#prodotti', '#pavimenti', '#carta-da-parati', '#lavori', '#contatti']);
    expect(screen.getByRole('link', { name: /Chiamaci/ }).getAttribute('href')).toBe('tel:+39041990950');
  });
});
