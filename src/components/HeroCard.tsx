import { business } from '../content/business';
import { colourById, colours } from '../data/palette';
import { HeroVisual } from './HeroVisual';
import { Icon } from './Icon';
import styles from './HeroCard.module.css';

const fanIds = ['calce-antica', 'ocra-veneziana', 'rosa-intonaco', 'salvia', 'azzurro-burano', 'verde-bottiglia', 'giallo-zafferano'];

export function HeroCard() {
  const fan = fanIds.map((id) => colourById(id)!).filter(Boolean);
  const ticker = colours.map((c) => c.name);
  return (
    <section className={`card tone-terra ${styles.hero}`} aria-labelledby="hero-title">
      <div className={styles.grid}>
        <div className={styles.copy}>
          <p className={`kicker ${styles.kicker}`}>Negozio di colori a {business.address.city}</p>
          <h1 id="hero-title" className={styles.title}>
            <span className={styles.line}>Il colore dà</span>{' '}
            <span className={styles.line}>
              <em>forma</em> ai tuoi
            </span>{' '}
            <span className={styles.line}>spazi.</span>
          </h1>
          <p className={`lede ${styles.lede}`}>
            Pitture, smalti e prodotti per la decorazione a Spinea. Scopri Arte Colore e trova
            l’ispirazione per il tuo prossimo progetto.
          </p>
          <div className={styles.actions}>
            <a className="btn btn--ivory" href="#colori">
              Esplora i colori
              <Icon name="arrow-down" />
            </a>
            <a className="btn btn--outline" href="#visita">
              Vieni in negozio
            </a>
          </div>
        </div>

        <div className={styles.stage}>
          <ul role="list" className={styles.fan} aria-hidden="true">
            {fan.map((c, i) => (
              <li
                key={c.id}
                style={{ '--c': c.hex, '--i': i, '--n': fan.length } as React.CSSProperties}
              >
                <span className={styles.fanName}>{c.name}</span>
                <span className={styles.fanHex}>{c.hex}</span>
              </li>
            ))}
          </ul>
          <HeroVisual />
        </div>
      </div>

      <div className={`chip-label ${styles.label}`}>
        <span className="chip-label__name">Terracotta</span>
        <div className={styles.ticker} aria-hidden="true">
          <div className={styles.tickerTrack}>
            {[0, 1].map((k) => (
              <span key={k}>
                {ticker.map((n) => (
                  <span key={n} className={styles.tickerItem}>
                    {n}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
        <span className="chip-label__code">
          {business.address.city} · {business.address.street}
        </span>
      </div>
    </section>
  );
}
