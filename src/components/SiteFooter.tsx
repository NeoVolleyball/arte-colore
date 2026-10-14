import { business, nav } from '../content/business';
import { Wordmark } from './Wordmark';
import styles from './SiteFooter.module.css';
import { withBase } from '../content/paths';

export function SiteFooter() {
  const { address, phone } = business;
  return (
    <footer className={styles.footer}>
      <div className={styles.cols}>
        <p className={styles.claim}>Pitture, smalti e prodotti per la decorazione a {address.city}.</p>

        <nav aria-label="Pagine del sito" className={styles.nav}>
          <ul role="list">
            <li>
              <a href={withBase('/')}>Home</a>
            </li>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={withBase(item.href)}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.legal}>
          <p className={styles.company}>{business.legalName}</p>
          <p>
            {address.street}
            <br />
            {address.postalCode} {address.city} ({address.province})
          </p>
          <p>
            Tel. <a href={phone.href}>{phone.display}</a>
          </p>
          <p>P. IVA {business.vatNumber}</p>
        </div>
      </div>

      <div className={styles.giant} aria-hidden="true">
        <Wordmark size="xl" />
      </div>

      <div className={styles.bottom}>
        <p>
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {business.legalName}
        </p>
        <p>Immagini e modelli 3D originali, creati per questo sito.</p>
      </div>
    </footer>
  );
}
