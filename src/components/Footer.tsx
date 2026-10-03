import { business, nav } from '../content/business';
import { Wordmark } from './Wordmark';
import styles from './Footer.module.css';

export function Footer() {
  const { address, phone } = business;
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Wordmark size="lg" />
          <p>Pitture, smalti e prodotti per la decorazione a {address.city}.</p>
        </div>

        <nav aria-label="Sezioni del sito" className={styles.nav}>
          <ul role="list">
            {nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
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
      <div className={`container ${styles.bottom}`}>
        <p>
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {business.legalName}
        </p>
        <p>Immagini e modelli 3D originali, creati per questo sito.</p>
      </div>
    </footer>
  );
}
