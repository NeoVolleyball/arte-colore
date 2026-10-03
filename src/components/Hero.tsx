import { business } from '../content/business';
import { HeroVisual } from './HeroVisual';
import { Icon } from './Icon';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={`eyebrow ${styles.eyebrow}`}>Pitture · Smalti · Decorazione</p>
          <h1 id="hero-title" className={styles.title}>
            Il colore dà <em>forma</em> ai tuoi spazi.
          </h1>
          <p className={styles.lead}>
            Pitture, smalti e prodotti per la decorazione a Spinea. Scopri Arte Colore e trova
            l’ispirazione per il tuo prossimo progetto.
          </p>
          <div className={styles.actions}>
            <a className="btn" href="#colori">
              Esplora i colori
              <Icon name="arrow-down" />
            </a>
            <a className="btn btn--ghost" href="#dove-siamo">
              Vieni in negozio
            </a>
          </div>
          <p className={styles.place}>
            <span className={styles.dot} aria-hidden="true" />
            {business.address.city} · {business.address.street}
          </p>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
