import { useState } from 'react';
import { business, maps } from '../content/business';
import { Icon } from './Icon';
import styles from './Location.module.css';

export function Location() {
  const [showMap, setShowMap] = useState(false);
  const { address, phone } = business;

  return (
    <section id="dove-siamo" className={styles.section} aria-labelledby="dove-title">
      <div className={`container ${styles.grid}`}>
        <div className={`${styles.panel} reveal`}>
          <p className="eyebrow">Dove siamo</p>
          <h2 id="dove-title" className={styles.title}>
            Vieni a trovarci <em>a Spinea.</em>
          </h2>

          <address className={styles.address}>
            <strong className={styles.name}>{business.brand}</strong>
            <span>{address.street}</span>
            <span>
              {address.postalCode} {address.city} ({address.province})
            </span>
            <a className={styles.phone} href={phone.href}>
              {phone.display}
            </a>
          </address>

          <div className={styles.actions}>
            <a className="btn" href={phone.href}>
              <Icon name="phone" />
              Chiama il negozio
            </a>
            <a className="btn btn--ghost" href={maps.directionsUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="route" />
              Ottieni indicazioni
              <span className="visually-hidden">(Google Maps, si apre in una nuova scheda)</span>
            </a>
          </div>
          <p className={styles.hint}>Per informazioni su orari e disponibilità, chiamaci.</p>
        </div>

        <div className={`${styles.mapWrap} reveal`}>
          {showMap ? (
            <iframe
              className={styles.map}
              title={`Mappa: ${business.brand}, ${address.street}, ${address.city}`}
              src={maps.embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className={styles.mapPlaceholder}>
              <div className={styles.street} aria-hidden="true">
                <span>Via Roma</span>
                <b>175</b>
              </div>
              <div className={styles.mapCta}>
                <button type="button" className="btn btn--light" onClick={() => setShowMap(true)}>
                  <Icon name="map" />
                  Mostra la mappa
                </button>
                <p>La mappa viene caricata da Google Maps solo se la richiedi.</p>
              </div>
            </div>
          )}
          <a className={`text-link ${styles.openMaps}`} href={maps.searchUrl} target="_blank" rel="noopener noreferrer">
            Apri in Google Maps
            <Icon name="external" />
            <span className="visually-hidden">(si apre in una nuova scheda)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
