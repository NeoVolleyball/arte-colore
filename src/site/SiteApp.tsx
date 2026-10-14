import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Contact } from '@/components/site/Contact';
import { Decorativi } from '@/components/site/Decorativi';
import { Footer } from '@/components/site/Footer';
import { Hero } from '@/components/site/Hero';
import { MobileActionBar } from '@/components/site/MobileActionBar';
import { Offers } from '@/components/site/Offers';
import { Portfolio } from '@/components/site/Portfolio';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SpcHighlight } from '@/components/site/SpcHighlight';
import { Zones } from '@/components/site/Zones';
import { getActiveOffers, type Offer } from '@/data/offersService';

export interface SiteAppProps {
  /** Offers resolved at prerender time, so hydration matches the HTML. */
  initialOffers: Offer[];
}

export function SiteApp({ initialOffers }: SiteAppProps) {
  const [offers, setOffers] = useState(initialOffers);

  // Re-check in the browser: drops offers that expired after the build.
  const refreshOffers = useCallback(() => {
    getActiveOffers().then(setOffers, () => setOffers([]));
  }, []);
  useEffect(refreshOffers, [refreshOffers]);

  const showOffers = offers.length > 0;

  return (
    <MotionConfig reducedMotion="user">
      <SiteHeader showOffers={showOffers} />
      <main id="contenuto" tabIndex={-1} className="outline-none">
        <Hero />
        <SpcHighlight />
        {/*
          TODO "Servizi" section: add it once the client confirms which services
          they provide (manodopera, pittura, posa carta da parati). See README.
          <Servizi />
        */}
        <Portfolio />
        <Decorativi />
        <Offers offers={offers} onExpire={refreshOffers} />
        <Zones />
        <Contact />
      </main>
      <Footer showOffers={showOffers} />
      <MobileActionBar />
    </MotionConfig>
  );
}
