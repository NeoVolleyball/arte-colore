import { render, screen } from '@testing-library/react';
import { business, pages } from '../content/business';
import { pageComponents } from '../pages/registry';

describe('legal pages', () => {
  it('are registered with their own path and title', () => {
    expect(pages.cookie.path).toBe('/cookie/');
    expect(pages.privacy.path).toBe('/privacy/');
    expect(Object.keys(pageComponents).sort()).toEqual(['cookie', 'home', 'privacy']);
  });

  it('privacy page names the controller and the contact e-mail', () => {
    const Page = pageComponents.privacy;
    render(<Page />);
    expect(screen.getByRole('heading', { level: 1, name: 'Privacy' })).toBeTruthy();
    expect(screen.getAllByText(new RegExp(business.vatNumber)).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: business.email }).length).toBeGreaterThan(0);
  });

  it('cookie page lists what the site uses and the Google map notice', () => {
    const Page = pageComponents.cookie;
    render(<Page />);
    expect(screen.getByRole('heading', { level: 1, name: 'Cookie' })).toBeTruthy();
    expect(screen.getByText(/Mostra la mappa/)).toBeTruthy();
  });
});
