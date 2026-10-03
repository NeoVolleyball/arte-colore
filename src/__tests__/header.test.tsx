import { fireEvent, render, screen } from '@testing-library/react';
import { Header } from '../components/Header';

describe('Header mobile menu', () => {
  it('toggles aria-expanded, moves focus in, closes on Escape and restores focus', () => {
    render(<Header />);
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

  it('exposes a real phone link', () => {
    render(<Header />);
    const call = screen.getAllByRole('link', { name: /Chiama/ })[0];
    expect(call.getAttribute('href')).toBe('tel:+39041990950');
  });
});
