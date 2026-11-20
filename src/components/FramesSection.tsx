import { frames } from '../content/catalogue';
import { framePhotos } from '../content/gallery';
import { Icon } from './Icon';
import { PhotoSlot } from './PhotoSlot';
import styles from './FramesSection.module.css';

/** "Cornici su misura": short service card. Copy in catalogue.ts, photos in gallery.ts. */
export function FramesSection() {
  const photos = framePhotos.filter((p) => p.image);
  return (
    <section id="cornici" className={`card tone-sage card-rise ${styles.section}`} aria-labelledby="cornici-title">
      <div className={`${styles.grid} ${photos.length === 0 ? styles.solo : ''}`}>
        <div className={styles.copy}>
          <p className="kicker">{frames.kicker}</p>
          <h2 id="cornici-title" className={styles.title}>
            {frames.title}
          </h2>
          <p className={styles.text}>{frames.text}</p>
          <a className="btn" href="#contatti">
            {frames.cta} <Icon name="arrow" />
          </a>
        </div>
        {photos.length > 0 ? (
          <ul role="list" className={styles.thumbs}>
            {photos.map((p) => (
              <li key={p.id}>
                <PhotoSlot src={p.image} alt={p.alt} ratio="4 / 5" />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
