import { business } from '../content/business';
import { spcFloor } from '../content/catalogue';
import { spcPhoto } from '../content/gallery';
import { Drips } from './Drips';
import { Icon } from './Icon';
import { PhotoSlot } from './PhotoSlot';
import styles from './SpcFloorCard.module.css';

/** Homepage highlight: SPC laminate floors. Copy in src/content/catalogue.ts. */
export function SpcFloorCard() {
  return (
    <section id="pavimenti" className={`card tone-ochre card-rise ${styles.section}`} aria-labelledby="spc-title">
      <div className={styles.grid}>
        <div className={styles.copy}>
          <div className={styles.eyebrow}>
            <p className="kicker">{spcFloor.kicker}</p>
            <span className={styles.flag}>In evidenza</span>
          </div>
          <h2 id="spc-title" className={styles.title}>
            {spcFloor.title[0]} <em>{spcFloor.title[1]}</em>
          </h2>
          <p className={styles.text}>{spcFloor.text}</p>
          <ul role="list" className={styles.benefits}>
            {spcFloor.benefits.map((b) => (
              <li key={b.title}>
                <Icon name="check" />
                <span>
                  <strong>{b.title}</strong> {b.text}
                </span>
              </li>
            ))}
          </ul>
          <a className="btn" href={business.phone.href}>
            <Icon name="phone" /> Chiamaci per informazioni
          </a>
        </div>
        <PhotoSlot src={spcPhoto.image} alt={spcPhoto.alt} ratio="4 / 3" pattern="planks" className={styles.media} />
      </div>
      <div className="chip-label">
        <Drips seed={23} count={8} />
        <span className="chip-label__name">Laminato SPC</span>
        <span className="chip-label__meta">{spcFloor.note}</span>
        <span className="chip-label__code">#C7A35D</span>
      </div>
    </section>
  );
}
