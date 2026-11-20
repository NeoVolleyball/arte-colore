import { business } from '../content/business';
import { withBase } from '../content/paths';
import { Wordmark } from '../components/Wordmark';
import styles from './LegalPage.module.css';

/** Last edit of the legal texts (shown on both pages). */
export const LEGAL_UPDATED = '20 novembre 2026';

/** Shell shared by the Cookie and Privacy pages: small header, text column, footer links. */
export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <header className={styles.bar}>
        <a className={styles.brand} href={withBase('/')} aria-label="Arte Colore, torna alla home">
          <Wordmark />
        </a>
        <a className={styles.back} href={withBase('/')}>
          ← Torna al sito
        </a>
      </header>
      <main id="contenuto" tabIndex={-1}>
        <article className={styles.article}>
          <p className="kicker">Informazioni legali</p>
          <h1>{title}</h1>
          <p className={styles.updated}>Ultimo aggiornamento: {LEGAL_UPDATED}</p>
          {children}
        </article>
      </main>
      <footer className={styles.foot}>
        <span>
          © {business.legalName} · P. IVA {business.vatNumber}
        </span>
        <a href={withBase('/privacy/')}>Privacy</a>
        <a href={withBase('/cookie/')}>Cookie</a>
      </footer>
    </div>
  );
}

export { styles as legalStyles };
