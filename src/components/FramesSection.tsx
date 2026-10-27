import { frames } from '../content/catalogue';
import { framePhotos } from '../content/gallery';
import { Icon } from './Icon';
import { PhotoSlot } from './PhotoSlot';
import styles from './FramesSection.module.css';

/** "Cornici su misura": short service card. Copy in catalogue.ts, photos in gallery.ts. */
export function FramesSection() {
  return (
    <section id="cornici" className={`card tone-sage card-rise ${styles.section}`} aria-labelledby="cornici-title">
      <div className={styles.grid}>
        <div className={styles.copy}>
          <p className="kicker">{frames.kicker}</p>
          <h2 id="cornici-title" className={styles.title}>
            {frames.title}
          </h2>
          <p className={styles.text}>{frames.text}</p>
          <p className={styles.details}>{frames.details}</p>
          <a className="btn" href="#contatti">
            {frames.cta} <Icon name="arrow" />
          </a>
        </div>
        <ul role="list" className={styles.thumbs}>
          {framePhotos.map((p) => (
            <li key={p.id}>
              <PhotoSlot src={p.image} alt={p.alt} ratio="4 / 5" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
