import { business } from '../content/business';
import { Icon } from './Icon';
import styles from './SanMarco.module.css';

/** Text-only reference: no official San Marco logo asset is available. */
export function SanMarco() {
  return (
    <section className={styles.section} aria-labelledby="sanmarco-title">
      <div className={`container ${styles.inner} reveal`}>
        <h2 id="sanmarco-title" className="visually-hidden">
          Rivenditore San Marco
        </h2>
        <p className={styles.label}>Rete rivenditori</p>
        <p className={styles.statement}>{business.sanMarco.statement}</p>
        <a
          className="text-link"
          href={business.sanMarco.directoryUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Consulta il localizzatore rivenditori San Marco
          <Icon name="external" />
          <span className="visually-hidden">(si apre in una nuova scheda)</span>
        </a>
      </div>
    </section>
  );
}
