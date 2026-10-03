import { business, maps } from '../content/business';
import { Drips } from './Drips';
import { Icon } from './Icon';
import styles from './VisitCard.module.css';

/** Homepage "come and visit" card: address, phone, directions, San Marco. */
export function VisitCard() {
  const { address, phone } = business;
  return (
    <section id="visita" className={`card tone-charcoal card-rise ${styles.section}`} aria-labelledby="visita-title">
      <div className={styles.grid}>
        <div className={styles.street} aria-hidden="true">
          <span>Via Roma</span>
          <b>175</b>
        </div>

        <div className={styles.info}>
          <p className="kicker">Vieni in negozio</p>
          <h2 id="visita-title" className={styles.title}>
            Ti aspettiamo <em>a Spinea.</em>
          </h2>
          <address className={styles.address}>
            <strong>{business.brand}</strong>
            <span>{address.street}</span>
            <span>
              {address.postalCode} {address.city} ({address.province})
            </span>
          </address>
          <a className={styles.phone} href={phone.href}>
            {phone.display}
          </a>
          <div className={styles.actions}>
            <a className="btn btn--ivory" href={phone.href}>
              <Icon name="phone" />
              Chiama il negozio
            </a>
            <a className="btn btn--outline" href={maps.directionsUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="route" />
              Ottieni indicazioni
              <span className="visually-hidden">(Google Maps, si apre in una nuova scheda)</span>
            </a>
          </div>
          <a className="text-link" href="/negozio/#dove-siamo">
            Mappa e consigli per la visita <Icon name="arrow" />
          </a>
        </div>
      </div>

      <div className={styles.sanmarco}>
        <p>{business.sanMarco.statement}</p>
        <a className="text-link" href={business.sanMarco.directoryUrl} target="_blank" rel="noopener noreferrer">
          Localizzatore rivenditori San Marco
          <Icon name="external" />
          <span className="visually-hidden">(si apre in una nuova scheda)</span>
        </a>
      </div>

      <div className="chip-label">
        <Drips seed={5} count={10} />
        <span className="chip-label__name">Antracite</span>
        <span className="chip-label__meta">Per informazioni su orari e disponibilità, chiamaci.</span>
        <span className="chip-label__code">#222420</span>
      </div>
    </section>
  );
}
