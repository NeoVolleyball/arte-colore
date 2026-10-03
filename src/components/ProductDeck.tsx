import { products } from '../content/catalogue';
import { Drips } from './Drips';
import { Icon } from './Icon';
import styles from './ProductDeck.module.css';

/** Homepage teaser: the three core categories as a fanned deck of cards. */
export function ProductDeck() {
  return (
    <section className={styles.section} aria-labelledby="deck-title">
      <div className="wrap">
        <header className={`${styles.head} reveal`}>
          <p className="kicker">Prodotti</p>
          <h2 id="deck-title" className={styles.title}>
            Tre modi di <em>cominciare.</em>
          </h2>
          <a className="text-link" href="/prodotti/">
            Tutti i prodotti <Icon name="arrow" />
          </a>
        </header>

        <ul role="list" className={styles.deck}>
          {products.map((p, i) => (
            <li key={p.id} className={`card tone-${p.tone} ${styles.item}`} style={{ '--i': i } as React.CSSProperties}>
              <div className={styles.media}>
                <img
                  src={`/images/product-${p.id}-540.webp`}
                  srcSet={`/images/product-${p.id}-540.webp 540w, /images/product-${p.id}-900.webp 900w`}
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
                <h3 className={styles.name}>
                  <a href={`/prodotti/#${p.id}`} className={styles.stretch}>
                    {p.name}
                  </a>
                </h3>
                <p className={styles.short}>{p.short}</p>
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
        <p className={styles.note}>Immagini illustrative create digitalmente.</p>
      </div>
    </section>
  );
}
