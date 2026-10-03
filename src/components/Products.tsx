import { business } from '../content/business';
import styles from './Products.module.css';

const products = [
  {
    id: 'pitture',
    name: 'Pitture',
    kicker: 'Pareti e soffitti',
    text: 'Pitture murali per rinnovare pareti e soffitti, dagli ambienti di tutti i giorni alle stanze da reinventare.',
    alt: 'Illustrazione: due barattoli di pittura su fondo verde salvia, uno aperto con pittura chiara, accanto a un rullo.',
    accent: 'var(--sage)',
  },
  {
    id: 'smalti',
    name: 'Smalti',
    kicker: 'Superfici e dettagli',
    text: 'Smalti per dare carattere a porte, infissi, ringhiere e piccoli arredi: il colore anche nei dettagli.',
    alt: 'Illustrazione: piccoli barattoli metallici su fondo terracotta, uno aperto con smalto verde bottiglia, e un pennello.',
    accent: 'var(--terracotta)',
  },
  {
    id: 'decorazione',
    name: 'Prodotti per la decorazione',
    kicker: 'Strumenti e accessori',
    text: 'Accessori per pitturare e decorare: tutto ciò che serve per preparare il lavoro e portarlo a termine con cura.',
    alt: 'Illustrazione: un campione materico in intonaco, una spatola, un rullo e un ventaglio di cartelle colore su fondo ocra.',
    accent: 'var(--ochre)',
  },
];

export function Products() {
  return (
    <section id="prodotti" className={styles.section} aria-labelledby="prodotti-title">
      <div className="container">
        <header className={`${styles.head} reveal`}>
          <p className="eyebrow">Prodotti</p>
          <h2 id="prodotti-title" className={styles.title}>
            Tutto parte da un <em>barattolo</em> di colore.
          </h2>
          <p className={styles.note}>
            L’assortimento può variare nel tempo: per sapere cosa trovi in negozio,{' '}
            <a href={business.phone.href}>chiamaci al {business.phone.local}</a>.
          </p>
        </header>

        <ul role="list" className={styles.list}>
          {products.map((p, i) => (
            <li
              key={p.id}
              className={`${styles.item} reveal`}
              style={{ '--accent': p.accent } as React.CSSProperties}
            >
              <article aria-labelledby={`prod-${p.id}`}>
                <div className={styles.media}>
                  <img
                    src={`/images/product-${p.id}-900.webp`}
                    srcSet={`/images/product-${p.id}-540.webp 540w, /images/product-${p.id}-900.webp 900w`}
                    sizes="(min-width: 900px) 30vw, 90vw"
                    width={900}
                    height={1125}
                    alt={p.alt}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className={styles.index} aria-hidden="true">
                    0{i + 1}
                  </span>
                </div>
                <p className={styles.kicker}>{p.kicker}</p>
                <h3 id={`prod-${p.id}`} className={styles.name}>
                  {p.name}
                </h3>
                <p className={styles.text}>{p.text}</p>
              </article>
            </li>
          ))}
        </ul>
        <p className={styles.disclaimer}>
          Immagini illustrative create digitalmente: non raffigurano prodotti specifici in vendita.
        </p>
      </div>
    </section>
  );
}
