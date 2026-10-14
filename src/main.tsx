import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import type { PageId } from './content/business';
import { pageComponents } from './pages/registry';
import './styles/global.css';

const root = document.getElementById('root')!;
const page = (root.dataset.page as PageId) || 'home';
const Page = pageComponents[page] ?? pageComponents.home;
const app = (
  <StrictMode>
    <Page />
  </StrictMode>
);

// Production HTML is prerendered (scripts/prerender.mjs): hydrate it.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
