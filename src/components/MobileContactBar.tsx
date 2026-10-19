import { business, maps } from '../content/business';
import { Icon } from './Icon';
import styles from './MobileContactBar.module.css';

/** Sticky "Chiamaci" / "Come arrivare" bar on phones, always visible. */
export function MobileContactBar() {
  return (
    <div className={styles.bar} role="region" aria-label="Contatti rapidi">
      <a className="btn btn--ivory" href={business.phone.href}>
        <Icon name="phone" />
        Chiamaci
      </a>
      <a
        className="btn btn--outline"
        style={{ '--ink': 'var(--ivory)', '--card-bg': 'var(--charcoal)' } as React.CSSProperties}
        href={maps.directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="route" />
        Come arrivare
        <span className="visually-hidden">(Google Maps, si apre in una nuova scheda)</span>
      </a>
    </div>
  );
}
