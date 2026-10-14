import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import type { Offer } from '@/data/offersService';
import { SiteApp } from './SiteApp';
import './styles.css';

function readInitialData(): { offers: Offer[] } | null {
  const el = document.getElementById('app-data');
  if (!el?.textContent) return null;
  try {
    return JSON.parse(el.textContent) as { offers: Offer[] };
  } catch {
    return null;
  }
}

const root = document.getElementById('root')!;
const data = readInitialData();
const app = (
  <StrictMode>
    <SiteApp initialOffers={data?.offers ?? []} />
  </StrictMode>
);

// Production HTML is prerendered (scripts/prerender.mjs): hydrate it.
if (root.firstElementChild && data) hydrateRoot(root, app);
else createRoot(root).render(app);
