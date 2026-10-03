import { structuredData } from './content/business';
import { ColourExplorer } from './components/ColourExplorer';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Inspirations } from './components/Inspirations';
import { Location } from './components/Location';
import { MobileContactBar } from './components/MobileContactBar';
import { Products } from './components/Products';
import { SanMarco } from './components/SanMarco';
import { Shop } from './components/Shop';

export function App() {
  return (
    <>
      <a className="skip-link" href="#contenuto">
        Vai al contenuto
      </a>
      <Header />
      <main id="contenuto" tabIndex={-1}>
        <Hero />
        <Shop />
        <Products />
        <ColourExplorer />
        <Inspirations />
        <SanMarco />
        <Location />
      </main>
      <Footer />
      <MobileContactBar />
      <script
        type="application/ld+json"
        // structured data is generated from verified facts only
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />
    </>
  );
}
