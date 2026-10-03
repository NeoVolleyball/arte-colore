import { colourById } from '../data/palette';
import styles from './Inspirations.module.css';

const concepts = [
  {
    id: 'living',
    title: 'Soggiorno in neutri caldi',
    text: 'Lino e calce costruiscono una base morbida: il legno e una nota d’ocra fanno il resto.',
    palette: ['lino-grezzo', 'calce-antica', 'ocra-veneziana'],
    alt: 'Interno illustrativo: soggiorno con pareti beige caldo, una nicchia ad arco, divano chiaro, tavolino rotondo in legno e lampada da terra in ottone.',
  },
  {
    id: 'studio',
    title: 'Studio color salvia',
    text: 'Un verde quieto dietro la scrivania aiuta la concentrazione e dialoga con il legno chiaro.',
    palette: ['salvia', 'verde-lichene', 'calce-antica'],
    alt: 'Interno illustrativo: angolo studio con parete verde salvia, scrivania in legno, mensole con libri, lampada da tavolo e una pianta.',
  },
  {
    id: 'terracotta',
    title: 'Accento terracotta',
    text: 'Un arco dipinto su una parete chiara crea un punto focale senza appesantire la stanza.',
    palette: ['terracotta', 'calce-antica', 'ocra-veneziana'],
    alt: 'Interno illustrativo: parete chiara con un grande arco dipinto color terracotta, panca in legno con cuscino ocra, vasi e una pianta d’ulivo.',
  },
];

export function Inspirations() {
  return (
    <section id="ispirazioni" className={styles.section} aria-labelledby="ispirazioni-title">
      <div className="container">
        <header className={`${styles.head} reveal`}>
          <p className="eyebrow">Ispirazioni cromatiche</p>
          <h2 id="ispirazioni-title" className={styles.title}>
            Tre stanze, <em>tre atmosfere.</em>
          </h2>
          <p className={styles.note}>
            Ambienti illustrativi creati digitalmente per suggerire abbinamenti di colore.
          </p>
        </header>

        <ul role="list" className={styles.grid}>
          {concepts.map((c) => (
            <li key={c.id} className={`${styles.card} ${styles[c.id]} reveal`}>
              <figure>
                <div className={styles.media}>
                  <img
                    src={`/images/insp-${c.id}-1100.webp`}
                    srcSet={`/images/insp-${c.id}-640.webp 640w, /images/insp-${c.id}-1100.webp 1100w`}
                    sizes="(min-width: 900px) 34vw, 92vw"
                    width={1100}
                    height={1375}
                    alt={c.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption className={styles.caption}>
                  <h3 className={styles.cardTitle}>{c.title}</h3>
                  <p>{c.text}</p>
                  <ul role="list" className={styles.palette} aria-label="Colori dell’abbinamento">
                    {c.palette.map((id) => {
                      const col = colourById(id);
                      if (!col) return null;
                      return (
                        <li key={id}>
                          <span style={{ backgroundColor: col.hex }} aria-hidden="true" />
                          {col.name}
                        </li>
                      );
                    })}
                  </ul>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
