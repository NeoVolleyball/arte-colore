import { structuredData } from '../content/business';
import { MobileContactBar } from './MobileContactBar';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#contenuto">
        Vai al contenuto
      </a>
      <SiteHeader />
      <main id="contenuto" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
      <MobileContactBar />
      <script
        type="application/ld+json"
        // generated from verified facts only (src/content/business.ts)
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />
    </>
  );
}
