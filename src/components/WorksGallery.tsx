import { works } from '../content/gallery';
import { PhotoSlot } from './PhotoSlot';
import styles from './WorksGallery.module.css';

/** "I nostri lavori": compact grid of jobs done at customers' homes. Photos in src/content/gallery.ts. */
export function WorksGallery() {
  return (
    <section id="lavori" className={styles.section} aria-labelledby="lavori-title">
      <div className="wrap">
        <header className={`${styles.head} reveal`}>
          <p className="kicker">I nostri lavori</p>
          <h2 id="lavori-title" className={styles.title}>
            Dal negozio <em>alle vostre case.</em>
          </h2>
        </header>
        <ul role="list" className={styles.grid}>
          {works.map((w) => (
            <li key={w.id}>
              <figure className={styles.item}>
                <PhotoSlot src={w.image} alt={w.alt} ratio="4 / 3" />
                <figcaption>
                  <strong>{w.title}</strong>
                  {w.place ? <span>{w.place}</span> : null}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
