import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { pageComponents, type LegacyPageId } from './pages/registry';
import './styles/global.css';

// Client entry for the legacy pages only (/prodotti/, /negozio/).
const root = document.getElementById('root')!;
const page = (root.dataset.page as LegacyPageId) || 'prodotti';
const Page = pageComponents[page] ?? pageComponents.prodotti;
const app = (
  <StrictMode>
    <Page />
  </StrictMode>
);

// Production HTML is prerendered (scripts/prerender.mjs): hydrate it.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
