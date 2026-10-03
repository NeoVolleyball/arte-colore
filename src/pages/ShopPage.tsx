import { useState } from 'react';
import { Icon } from '../components/Icon';
import { Layout } from '../components/Layout';
import { PageIntro } from '../components/PageIntro';
import { business, maps } from '../content/business';
import { colourById } from '../data/palette';
import styles from './ShopPage.module.css';

const steps = [
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
    colour: 'terracotta',
  },
];

export function ShopPage() {
  const [showMap, setShowMap] = useState(false);
  const { address, phone } = business;

  return (
    <Layout page="negozio">
      <PageIntro
        tone="ochre"
        kicker="Il negozio"
        title={
          <>
            Dal primo campione <em>all’ultima pennellata.</em>
          </>
        }
        label={{ name: 'Ocra veneziana', meta: `${address.street} · ${address.city}`, code: '#C7A35D' }}
        aside={
          <img
            className={styles.introImg}
            src="/images/hero-still-720.webp"
            srcSet="/images/hero-still-720.webp 720w, /images/hero-still-1200.webp 1200w"
            sizes="(min-width: 960px) 38vw, 86vw"
            width={1200}
            height={1500}
            alt="Composizione illustrativa: barattolo di pittura aperto, coperchio, pennello e ventaglio di cartelle colore davanti a un arco in intonaco verde salvia."
            decoding="async"
          />
        }
      >
        <p>
          {business.brand} è un negozio di pitture, smalti e prodotti per la decorazione in{' '}
          {address.street}, a {address.city}.
        </p>
        <p>
          Che tu stia rinfrescando una stanza, rinnovando un infisso o cercando la tinta giusta per
          una parete, qui trovi materiali e strumenti per dare forma al tuo progetto, dalla
          preparazione alla finitura.
        </p>
      </PageIntro>

      <section className={styles.steps} aria-labelledby="visita-title">
        <div className="wrap">
          <h2 id="visita-title" className={`${styles.stepsTitle} reveal`}>
            Prima di venire <em>a trovarci</em>
          </h2>
          <ol role="list" className={styles.stepList}>
            {steps.map((s, i) => (
              <li
                key={s.title}
                className={`${styles.step} reveal`}
                style={{ '--c': colourById(s.colour)?.hex, '--i': i } as React.CSSProperties}
              >
                <span className={styles.stepNum} aria-hidden="true">
                  0{i + 1}
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`card tone-paper card-rise ${styles.sanmarco}`} aria-labelledby="sm-title">
        <div className={styles.smInner}>
          <p className="kicker">Rete rivenditori</p>
          <h2 id="sm-title" className={styles.smTitle}>
            {business.sanMarco.statement}
          </h2>
          <a className="text-link" href={business.sanMarco.directoryUrl} target="_blank" rel="noopener noreferrer">
            Consulta il localizzatore rivenditori San Marco
            <Icon name="external" />
            <span className="visually-hidden">(si apre in una nuova scheda)</span>
          </a>
        </div>
      </section>

      <section id="dove-siamo" className={`card tone-terra card-rise ${styles.where}`} aria-labelledby="dove-title">
        <div className={styles.whereGrid}>
          <div className={styles.whereInfo}>
            <p className="kicker">Dove siamo</p>
            <h2 id="dove-title" className={styles.whereTitle}>
              {address.street}, <em>{address.city}.</em>
            </h2>
            <address className={styles.address}>
              <strong>{business.brand}</strong>
              <span>{address.street}</span>
              <span>
                {address.postalCode} {address.city} ({address.province})
              </span>
              <a href={phone.href}>{phone.display}</a>
            </address>
            <div className={styles.actions}>
              <a className="btn btn--ivory" href={phone.href}>
                <Icon name="phone" /> Chiama il negozio
              </a>
              <a className="btn btn--outline" href={maps.directionsUrl} target="_blank" rel="noopener noreferrer">
                <Icon name="route" /> Ottieni indicazioni
                <span className="visually-hidden">(Google Maps, si apre in una nuova scheda)</span>
              </a>
            </div>
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
            <a className="text-link" href={maps.searchUrl} target="_blank" rel="noopener noreferrer">
              Apri in Google Maps <Icon name="external" />
              <span className="visually-hidden">(si apre in una nuova scheda)</span>
            </a>
          </div>
        </div>
        <div className="chip-label">
          <span className="chip-label__name">Terracotta</span>
          <span className="chip-label__meta">
            {address.street} · {address.postalCode} {address.city} ({address.province})
          </span>
          <span className="chip-label__code">#8E4A31</span>
        </div>
      </section>
    </Layout>
  );
}
