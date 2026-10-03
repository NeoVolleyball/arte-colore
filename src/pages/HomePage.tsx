import { ColourExplorer } from '../components/ColourExplorer';
import { HeroCard } from '../components/HeroCard';
import { InspirationGallery } from '../components/InspirationGallery';
import { Layout } from '../components/Layout';
import { ProductDeck } from '../components/ProductDeck';
import { VisitCard } from '../components/VisitCard';

export function HomePage() {
  return (
    <Layout page="home">
      <HeroCard />
      <ColourExplorer />
      <ProductDeck />
      <InspirationGallery />
      <VisitCard />
    </Layout>
  );
}
