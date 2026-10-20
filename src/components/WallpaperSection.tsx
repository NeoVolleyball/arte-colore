import { business } from '../content/business';
import { wallpaper } from '../content/catalogue';
import { wallpapers } from '../content/gallery';
import { ChipLabel } from './ChipLabel';
import { Icon } from './Icon';
import { LabourBadge } from './LabourBadge';
import { PhotoSlot } from './PhotoSlot';
import styles from './WallpaperSection.module.css';

/** /prodotti/: "Decorativi" with the "Carta da parati" subsection. */
export function WallpaperSection() {
  return (
    <section id="carta-da-parati" className={`card tone-green card-rise ${styles.section}`} aria-labelledby="carta-title">
      <div className={styles.grid}>
        <div className={styles.copy}>
          <p className="kicker">{wallpaper.kicker}</p>
          <h2 id="carta-title" className={styles.title}>
            {wallpaper.title}
          </h2>
          <p className={styles.text}>{wallpaper.text}</p>
          <LabourBadge light />
          <a className="text-link" href={business.phone.href}>
            <Icon name="phone" /> Chiamaci al {business.phone.local}
          </a>
        </div>
        <ul role="list" className={styles.thumbs}>
          {wallpapers.map((p) => (
            <li key={p.id}>
              <PhotoSlot src={p.image} alt={p.alt} ratio="3 / 4" pattern="wallpaper" />
            </li>
          ))}
        </ul>
      </div>
      <ChipLabel name="Carta da parati" meta="Per abbellire o dare carattere a una stanza" code="#2F4A3E" seed={31} />
    </section>
  );
}
