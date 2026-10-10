import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import type { PageId } from './content/business';
import { pageComponents } from './pages/registry';
import { SiteApp } from './site/SiteApp';
import { getActiveOffers } from './data/offersService';

export interface Rendered {
  html: string;
  /** JSON handed to the client so hydration starts from the same data. */
  data?: string;
}

export async function render(page: PageId): Promise<Rendered> {
  if (page === 'home') {
    const offers = await getActiveOffers();
    const html = renderToString(
      <StrictMode>
        <SiteApp initialOffers={offers} />
      </StrictMode>,
    );
    return { html, data: JSON.stringify({ offers }).replace(/</g, '\\u003c') };
  }
  const Page = pageComponents[page];
  return {
    html: renderToString(
      <StrictMode>
        <Page />
      </StrictMode>,
    ),
  };
}
