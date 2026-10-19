import { ColourExplorer } from '../components/ColourExplorer';
import { ContactSection } from '../components/ContactSection';
import { HeroCard } from '../components/HeroCard';
import { InspirationGallery } from '../components/InspirationGallery';
import { Layout } from '../components/Layout';
import { OffersSection } from '../components/OffersSection';
import { ProductDeck } from '../components/ProductDeck';
import { SanMarcoSection } from '../components/SanMarcoSection';
import { SpcFloorCard } from '../components/SpcFloorCard';
import { WallpaperSection } from '../components/WallpaperSection';
import { WorksGallery } from '../components/WorksGallery';

/** The whole site: one page, sections in menu order (see `nav` in business.ts). */
export function HomePage() {
  return (
    <Layout>
      <HeroCard />
      <OffersSection />
      <ProductDeck />
      <SpcFloorCard />
      <WallpaperSection />
      <WorksGallery />
      <ColourExplorer />
      <InspirationGallery />
      <SanMarcoSection />
      <ContactSection />
    </Layout>
  );
}
