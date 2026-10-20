import { useState } from 'react';
import { business, maps } from '../content/business';
import { colourById } from '../data/palette';
import { Icon } from './Icon';
import { LabourBadge } from './LabourBadge';
import styles from './ContactSection.module.css';

const tips = [
  {
    title: 'Osserva la luce',
    text: 'Una parete esposta a nord e una a sud cambiano lo stesso colore nel corso della giornata.',
    colour: 'ocra-veneziana',
  },
  {
    title: 'Porta un riferimento',
    text: 'Una foto della stanza, un tessuto o un oggetto aiutano a orientarsi tra le tonalità.',
    colour: 'salvia',
  },
  {
    title: 'Verifica dal vero',
    text: 'Guarda il colore in negozio, con calma, lontano dallo schermo del telefono.',
    colour: 'rosa-intonaco',
  },
];

/** The one place for address, phone, directions, map and visit tips. */
export function ContactSection() {
  const [showMap, setShowMap] = useState(false);
  const { address, phone } = business;

  return (
    <section id="contatti" className={`card tone-terra card-rise ${styles.section}`} aria-labelledby="contatti-title">
      <div className={styles.grid}>
        <div className={styles.info}>
          <p className="kicker">Contatti</p>
          <h2 id="contatti-title" className={styles.title}>
            Ti aspettiamo <em>a {address.city}.</em>
          </h2>
          <address className={styles.address}>
            <strong>{business.brand}</strong>
            <span>{address.street}</span>
            <span>
              {address.postalCode} {address.city} ({address.province})
            </span>
            <a href={phone.href}>Tel. {phone.display}</a>
          </address>
          <div className={styles.actions}>
            <a className="btn btn--ivory" href={phone.href}>
              <Icon name="phone" /> Chiamaci
            </a>
            <a className="btn btn--outline" href={maps.directionsUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="route" /> Come arrivare
              <span className="visually-hidden">(Google Maps, si apre in una nuova scheda)</span>
            </a>
          </div>
          <LabourBadge light />
          <p className={styles.hint}>Per informazioni su orari e disponibilità, chiamaci.</p>
        </div>

        <div className={styles.mapWrap}>
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
              <svg className={styles.mapArt} viewBox="0 0 400 300" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
                <path d="M-20 210 C 90 190, 160 120, 420 90" />
                <path d="M60 -10 C 90 90, 120 200, 110 320" />
                <path d="M-20 60 C 120 70, 260 40, 420 30" />
                <path d="M250 -10 C 240 110, 290 210, 300 320" />
              </svg>
              <span className={styles.pin} aria-hidden="true" />
              <div className={styles.mapCta}>
                <button type="button" className="btn btn--ivory" onClick={() => setShowMap(true)}>
                  <Icon name="map" /> Mostra la mappa
                </button>
                <p>La mappa viene caricata da Google Maps solo se la richiedi.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.tipsWrap}>
        <h3 className={styles.tipsTitle}>Prima di venire a trovarci</h3>
        <ol role="list" className={styles.tips}>
          {tips.map((t) => (
            <li key={t.title} style={{ '--c': colourById(t.colour)?.hex } as React.CSSProperties}>
              <strong>{t.title}</strong>
              <span>{t.text}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="chip-label">
        <span className="chip-label__name">Terracotta</span>
        <span className="chip-label__meta">
          {address.street} · {address.postalCode} {address.city} ({address.province})
        </span>
        <span className="chip-label__code">#8E4A31</span>
      </div>
    </section>
  );
}
