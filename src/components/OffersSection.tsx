import { useEffect, useState } from 'react';
import { business } from '../content/business';
import { formatEndDay, formatPrice, isActive, offerEnd, publishedOffers, type Offer } from '../content/offerte';
import { withBase } from '../content/paths';
import { Icon } from './Icon';
import { PhotoSlot } from './PhotoSlot';
import styles from './OffersSection.module.css';

/** Current time, ticking every second. `null` during prerender and hydration,
 *  so server and client markup match; offers are filtered right after. */
function useNow(enabled: boolean) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    if (!enabled) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [enabled]);
  return now;
}

const pad = (n: number) => String(n).padStart(2, '0');

function Countdown({ offer, now }: { offer: Offer; now: number | null }) {
  const end = offerEnd(offer.ends);
  const iso = new Date(end).toISOString();
  if (now === null) {
    return (
      <span className={styles.until}>
        Fino al <time dateTime={iso}>{formatEndDay(offer.ends)}</time>
      </span>
    );
  }
  const s = Math.max(0, Math.floor((end - now) / 1000));
  const parts = [
    { v: Math.floor(s / 86400), u: 'g', label: 'giorni' },
    { v: Math.floor((s % 86400) / 3600), u: 'h', label: 'ore' },
    { v: Math.floor((s % 3600) / 60), u: 'm', label: 'minuti' },
    { v: s % 60, u: 's', label: 'secondi' },
  ];
  return (
    <time className={styles.clock} dateTime={iso} role="timer" aria-label={`Fino al ${formatEndDay(offer.ends)}`}>
      {parts.map((p, i) => (
        <span key={p.u} className={styles.unit} aria-hidden="true">
          {i === 0 ? p.v : pad(p.v)}
          <small>{p.u}</small>
        </span>
      ))}
    </time>
  );
}

/** Homepage "Offerte": photo → prices → countdown. Data in src/content/offerte.ts. */
export function OffersSection() {
  const list = publishedOffers();
  const now = useNow(list.length > 0);
  const visible = now === null ? list : list.filter((o) => isActive(o, now));

  return (
    <section id="offerte" className={styles.section} aria-labelledby="offerte-title">
      <div className="wrap">
        <header className={`${styles.head} reveal`}>
          <p className="kicker">Offerte</p>
          <h2 id="offerte-title" className={styles.title}>
            Prezzi speciali, <em>per poco tempo.</em>
          </h2>
        </header>

        {visible.length > 0 ? (
          <ul role="list" className={styles.track} aria-label="Offerte attive">
            {visible.map((o) => {
              const off = Math.round((1 - o.newPrice / o.oldPrice) * 100);
              return (
                <li key={o.id} className={`card tone-${o.tone ?? 'sage'} ${styles.offer}`}>
                  <div className={styles.media}>
                    {o.image ? (
                      <img src={withBase(o.image)} alt={o.name} width={540} height={540} loading="lazy" decoding="async" />
                    ) : (
                      <PhotoSlot alt="" ratio="4 / 3" pattern="tin" className={styles.slot} />
                    )}
                    {off > 0 ? <span className={styles.badge}>−{off}%</span> : null}
                  </div>
                  <div className={styles.body}>
                    {o.demo ? <span className={styles.demo}>Demo di esempio</span> : null}
                    <h3 className={styles.name}>{o.name}</h3>
                    {o.detail ? <p className={styles.detail}>{o.detail}</p> : null}
                    <p className={styles.prices}>
                      <del>
                        <span className="visually-hidden">Prezzo pieno </span>
                        {formatPrice(o.oldPrice)}
                      </del>
                      <strong>
                        <span className="visually-hidden">Prezzo in offerta </span>
                        {formatPrice(o.newPrice)}
                      </strong>
                    </p>
                  </div>
                  <div className={`chip-label ${styles.strip}`}>
                    <span className={styles.stripLabel}>Termina tra</span>
                    <Countdown offer={o} now={now} />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className={styles.empty}>
            <Icon name="tag" />
            <p>
              Al momento non ci sono offerte attive. Per le promozioni del momento{' '}
              <a href={business.phone.href}>chiamaci al {business.phone.local}</a>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
