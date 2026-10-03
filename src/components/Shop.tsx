import { business } from '../content/business';
import { colourById } from '../data/palette';
import styles from './Shop.module.css';

const chipIds = ['calce-antica', 'ocra-veneziana', 'terracotta', 'salvia', 'blu-laguna'];

const steps = [
  {
    title: 'Osserva la luce',
    text: 'Una parete esposta a nord e una a sud cambiano lo stesso colore nel corso della giornata.',
  },
  {
    title: 'Porta un riferimento',
    text: 'Una foto della stanza, un tessuto o un oggetto aiutano a orientarsi tra le tonalità.',
  },
  {
    title: 'Verifica dal vero',
    text: 'Guarda il colore in negozio, con calma, lontano dallo schermo del telefono.',
  },
];

export function Shop() {
  const chips = chipIds.map((id) => colourById(id)).filter(Boolean);
  return (
    <section id="negozio" className={styles.section} aria-labelledby="negozio-title">
      <div className={`container ${styles.grid}`}>
        <div className={`${styles.intro} reveal`}>
          <p className="eyebrow">Il negozio</p>
          <h2 id="negozio-title" className={styles.title}>
            Dal primo campione <em>all’ultima pennellata.</em>
          </h2>
        </div>

        <div className={`${styles.body} reveal`}>
          <p className={styles.lead}>
            {business.brand} è un negozio di pitture, smalti e prodotti per la decorazione in{' '}
            {business.address.street}, a {business.address.city}.
          </p>
          <p>
            Che tu stia rinfrescando una stanza, rinnovando un infisso o cercando la tinta giusta per
            una parete, qui trovi materiali e strumenti per dare forma al tuo progetto, dalla
            preparazione alla finitura.
          </p>
        </div>

        <div className={styles.material} aria-hidden="true">
          <div className={styles.plaster}>
            <span>Intonaco</span>
          </div>
          <ul role="list" className={styles.chips}>
            {chips.map((c, i) => (
              <li
                key={c!.id}
                className={styles.chip}
                style={{ '--c': c!.hex, '--i': i } as React.CSSProperties}
              >
                <span className={styles.swatch} />
                <span className={styles.chipName}>{c!.name}</span>
                <span className={styles.chipHex}>{c!.hex}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className={`${styles.steps} reveal`} aria-labelledby="visita-title">
          <h3 id="visita-title" className={styles.stepsTitle}>
            Prima di venire a trovarci
          </h3>
          <ol role="list">
            {steps.map((s, i) => (
              <li key={s.title}>
                <span className={styles.num} aria-hidden="true">
                  0{i + 1}
                </span>
                <div>
                  <h4>{s.title}</h4>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  );
}
