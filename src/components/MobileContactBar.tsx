import { useEffect, useState } from 'react';
import { business, maps } from '../content/business';
import { Icon } from './Icon';
import styles from './MobileContactBar.module.css';

/** Compact phone/directions bar for small screens, shown once the hero has
 *  scrolled away and hidden while the full "Dove siamo" panel is in view. */
export function MobileContactBar() {
  const [pastHero, setPastHero] = useState(false);
  const [atLocation, setAtLocation] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const target = document.getElementById('visita') ?? document.getElementById('dove-siamo');
    const io = new IntersectionObserver(([e]) => setAtLocation(e.isIntersecting), {
      threshold: 0.15,
    });
    if (target) io.observe(target);
    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  const shown = pastHero && !atLocation;

  return (
    <div
      className={`${styles.bar} ${shown ? styles.shown : ''}`}
      role="region"
      aria-label="Contatti rapidi"
      aria-hidden={!shown}
      {...({ inert: shown ? undefined : '' } as Record<string, string | undefined>)}
    >
      <a className="btn btn--ivory" href={business.phone.href}>
        <Icon name="phone" />
        Chiama
      </a>
      <a className="btn btn--outline" style={{ '--ink': 'var(--ivory)', '--card-bg': 'var(--charcoal)' } as React.CSSProperties} href={maps.directionsUrl} target="_blank" rel="noopener noreferrer">
        <Icon name="route" />
        Indicazioni
        <span className="visually-hidden">(si apre in una nuova scheda)</span>
      </a>
    </div>
  );
}
