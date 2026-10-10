import type { Offer } from '@/data/offersService';

export interface SiteAppProps {
  initialOffers: Offer[];
}

export function SiteApp({ initialOffers }: SiteAppProps) {
  return (
    <main className="p-8">
      <h1 className="text-3xl">Arte Colore</h1>
      <p>{initialOffers.length} offerte</p>
    </main>
  );
}
