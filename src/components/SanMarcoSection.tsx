import { business } from '../content/business';
import { withBase } from '../content/paths';
import { Icon } from './Icon';
import styles from './SanMarcoSection.module.css';

/** San Marco dealer network, other brands and the Belle Arti colours (Maimeri, a separate brand). */
export function SanMarcoSection() {
  const { sanMarco } = business;
  const { belleArti } = business;
  const links = [
    { label: 'Sito San Marco', href: sanMarco.siteUrl },
    { label: `Belle Arti ${belleArti.brand}`, href: belleArti.siteUrl },
  ];
  return (
    <section id="san-marco" className={`card tone-paper card-rise ${styles.section}`} aria-labelledby="sm-title">
      <div className={styles.inner}>
        <a
          className={styles.logo}
          href={sanMarco.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Sito San Marco (si apre in una nuova scheda)"
        >
          {sanMarco.logo ? (
            <img src={withBase(sanMarco.logo)} alt="" width={240} height={120} loading="lazy" />
          ) : (
            <span aria-hidden="true">
              San <em>Marco</em>
            </span>
          )}
        </a>
        <div className={styles.copy}>
          <p className="kicker">Rete rivenditori</p>
          <h2 id="sm-title" className={styles.title}>
            Colorificio <em>San Marco</em>
          </h2>
          <p>{sanMarco.statement} Chiedi in negozio i prodotti San Marco.</p>
          <p>
            In negozio trovi anche i prodotti di{' '}
            {business.otherBrands.map((b, i) => (
              <span key={b}>
                {i > 0 ? (i === business.otherBrands.length - 1 ? ' e ' : ', ') : ''}
                <strong>{b}</strong>
              </span>
            ))}
            . Per le belle arti trovi i colori <strong>{belleArti.brand}</strong>.
          </p>
          <ul role="list" className={styles.links}>
            {links.map((l) => (
              <li key={l.label}>
                <a className="text-link" href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}
                  <Icon name="external" />
                  <span className="visually-hidden">(si apre in una nuova scheda)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
