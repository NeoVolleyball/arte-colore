import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import type { PageId } from './content/business';
import { pageComponents } from './pages/registry';

export function render(page: PageId): string {
  const Page = pageComponents[page];
  return renderToString(
    <StrictMode>
      <Page />
    </StrictMode>,
  );
}
