import { business } from '../content/business';
import { products } from '../content/catalogue';
import { Drips } from './Drips';
import { Icon } from './Icon';
import styles from './ProductDeck.module.css';
import { withBase } from '../content/paths';

/** "Prodotti": the three core categories as a fanned deck of cards; each card
 *  opens in place to show what the products are for (no separate page). */
export function ProductDeck() {
  return (
    <section id="prodotti" className={styles.section} aria-labelledby="deck-title">
      <div className="wrap">
        <header className={`${styles.head} reveal`}>
          <p className="kicker">Prodotti</p>
          <h2 id="deck-title" className={styles.title}>
            Tre modi di <em>cominciare.</em>
          </h2>
        </header>

        <ul role="list" className={styles.deck}>
          {products.map((p, i) => (
            <li key={p.id} className={`card tone-${p.tone} ${styles.item}`} style={{ '--i': i } as React.CSSProperties}>
              <div className={styles.media}>
                <img
                  src={withBase(`/images/product-${p.id}-540.webp`)}
                  srcSet={withBase(`/images/product-${p.id}-540.webp 540w, /images/product-${p.id}-900.webp 900w`)}
                  sizes="(min-width: 900px) 30vw, 88vw"
                  width={900}
                  height={1125}
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                  className="parallax"
                />
              </div>
              <div className={styles.body}>
                <p className={styles.kicker}>{p.kicker}</p>
                <h3 className={styles.name}>{p.name}</h3>
                <p className={styles.short}>{p.short}</p>
                <details className={styles.more}>
                  <summary>
                    A cosa servono <Icon name="arrow-down" />
                  </summary>
                  <ul role="list" className={styles.uses}>
                    {p.uses.map((u) => (
                      <li key={u}>{u}</li>
                    ))}
                  </ul>
                </details>
              </div>
              <div className="chip-label">
                <Drips seed={i * 13 + 2} count={5} />
                <span className="chip-label__name">N° 0{i + 1}</span>
                <span />
                <span className="chip-label__code">{p.code}</span>
              </div>
            </li>
          ))}
        </ul>
        <p className={styles.note}>
          Per sapere cosa trovi oggi in negozio:{' '}
          <a className="text-link" href={business.phone.href}>
            <Icon name="phone" /> Chiamaci al {business.phone.local}
          </a>
          <br />
          <span>Immagini illustrative create digitalmente.</span>
        </p>
      </div>
    </section>
  );
}
