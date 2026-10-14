import { ChipLabel } from '../components/ChipLabel';
import { Icon } from '../components/Icon';
import { Layout } from '../components/Layout';
import { PageIntro } from '../components/PageIntro';
import { business, maps } from '../content/business';
import { products } from '../content/catalogue';
import styles from './ProductsPage.module.css';
import { withBase } from '../content/paths';

export function ProductsPage() {
  return (
    <Layout page="prodotti">
      <PageIntro
        tone="sage"
        kicker="Prodotti"
        title={
          <>
            Il colore, dalla parete <em>al dettaglio.</em>
          </>
        }
        label={{ name: 'Salvia', meta: 'Pitture · Smalti · Decorazione', code: '#879480' }}
        aside={
          <ul role="list" className={styles.trio} aria-hidden="true">
            {products.map((p, i) => (
              <li key={p.id} style={{ '--i': i } as React.CSSProperties}>
                <img src={withBase(`/images/product-${p.id}-540.webp`)} width={540} height={675} alt="" decoding="async" />
              </li>
            ))}
          </ul>
        }
      >
        <p>
          Il cuore di Arte Colore: pitture, smalti e prodotti per la decorazione. Per sapere cosa
          trovi oggi in negozio, <a href={business.phone.href}>chiamaci al {business.phone.local}</a>.
        </p>
        <ul role="list" className={styles.index}>
          {products.map((p, i) => (
            <li key={p.id}>
              <a href={`#${p.id}`}>
                <span aria-hidden="true">0{i + 1}</span> {p.name}
              </a>
            </li>
          ))}
        </ul>
      </PageIntro>

      {products.map((p, i) => (
        <section
          key={p.id}
          id={p.id}
          className={`card tone-${p.tone} card-rise ${styles.band} ${i % 2 ? styles.flip : ''}`}
          aria-labelledby={`${p.id}-title`}
        >
          <div className={styles.grid}>
            <div className={styles.media}>
              <img
                src={withBase(`/images/product-${p.id}-900.webp`)}
                srcSet={withBase(`/images/product-${p.id}-540.webp 540w, /images/product-${p.id}-900.webp 900w`)}
                sizes="(min-width: 960px) 44vw, 92vw"
                width={900}
                height={1125}
                alt={p.alt}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="parallax"
              />
            </div>
            <div className={styles.copy}>
              <span className={styles.num} aria-hidden="true">
                0{i + 1}
              </span>
              <p className="kicker">{p.kicker}</p>
              <h2 id={`${p.id}-title`} className={styles.title}>
                {p.name}
              </h2>
              <p className={styles.text}>{p.text}</p>
              <h3 className={styles.usesTitle}>Utili per</h3>
              <ul role="list" className={styles.uses}>
                {p.uses.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
              <a className="text-link" href={business.phone.href}>
                <Icon name="phone" /> Chiedi in negozio: {business.phone.local}
              </a>
            </div>
          </div>
          <ChipLabel name={p.name} meta="Immagine illustrativa creata digitalmente" code={p.code} seed={i * 17 + 4} />
        </section>
      ))}

      <section className={`card tone-charcoal card-rise ${styles.cta}`} aria-labelledby="cta-title">
        <div className={styles.ctaInner}>
          <h2 id="cta-title" className={styles.ctaTitle}>
            Hai un progetto <em>in mente?</em>
          </h2>
          <p>Raccontacelo in negozio, in {business.address.street} a {business.address.city}.</p>
          <div className={styles.ctaActions}>
            <a className="btn btn--ivory" href={business.phone.href}>
              <Icon name="phone" /> Chiama il negozio
            </a>
            <a className="btn btn--outline" href={maps.directionsUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="route" /> Ottieni indicazioni
              <span className="visually-hidden">(Google Maps, si apre in una nuova scheda)</span>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
