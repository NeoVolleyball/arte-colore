import { useEffect, useRef, useState } from 'react';
import { inspirations } from '../content/catalogue';
import { colourById } from '../data/palette';
import { Drips } from './Drips';
import { Icon } from './Icon';
import styles from './InspirationGallery.module.css';
import { withBase } from '../content/paths';

/** Ispirazioni cromatiche: snap-scrolling gallery of three illustrative rooms. */
export function InspirationGallery() {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const slides = Array.from(el.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setIndex(slides.indexOf(e.target as HTMLElement));
        }
      },
      { root: el, threshold: 0.6 },
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const next = Math.max(0, Math.min(inspirations.length - 1, index + dir));
    const slide = el.children[next] as HTMLElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
    setIndex(next);
  };

  return (
    <section className={`card tone-green card-rise ${styles.section}`} aria-labelledby="insp-title">
      <div className={styles.head}>
        <div>
          <p className="kicker">Ispirazioni cromatiche</p>
          <h2 id="insp-title" className={styles.title}>
            Tre stanze, <em>tre atmosfere.</em>
          </h2>
        </div>
        <div className={styles.controls}>
          <span className={styles.count} aria-hidden="true">
            0{index + 1} <i>/</i> 0{inspirations.length}
          </span>
          <button type="button" className={styles.arrow} onClick={() => go(-1)} disabled={index === 0} aria-controls="insp-track">
            <Icon name="arrow" />
            <span className="visually-hidden">Ispirazione precedente</span>
          </button>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => go(1)}
            disabled={index === inspirations.length - 1}
            aria-controls="insp-track"
          >
            <Icon name="arrow" />
            <span className="visually-hidden">Ispirazione successiva</span>
          </button>
        </div>
      </div>

      <ul
        id="insp-track"
        ref={track}
        role="list"
        className={styles.track}
        tabIndex={0}
        aria-label="Galleria ispirazioni, scorri in orizzontale"
      >
        {inspirations.map((c, i) => (
          <li key={c.id} className={styles.slide}>
            <figure className={styles.figure}>
              <div className={styles.media}>
                <img
                  src={withBase(`/images/insp-${c.id}-1100.webp`)}
                  srcSet={withBase(`/images/insp-${c.id}-640.webp 640w, /images/insp-${c.id}-1100.webp 1100w`)}
                  sizes="(min-width: 900px) 34vw, 80vw"
                  width={1100}
                  height={1375}
                  alt={c.alt}
                  loading="lazy"
                  decoding="async"
                  className="parallax"
                />
              </div>
              <figcaption className={styles.caption}>
                <span className={styles.num} aria-hidden="true">
                  0{i + 1}
                </span>
                <h3 className={styles.slideTitle}>{c.title}</h3>
                <p>{c.text}</p>
                <ul role="list" className={styles.palette} aria-label="Colori dell’abbinamento">
                  {c.palette.map((id) => {
                    const col = colourById(id);
                    if (!col) return null;
                    return (
                      <li key={id}>
                        <span className={styles.chip} style={{ backgroundColor: col.hex }} aria-hidden="true" />
                        <span className={styles.chipName}>{col.name}</span>
                        <span className={styles.chipHex}>{col.hex}</span>
                      </li>
                    );
                  })}
                </ul>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className="chip-label">
        <Drips seed={11} />
        <span className="chip-label__name">Verde bottiglia</span>
        <span className="chip-label__meta">
          Ambienti illustrativi creati digitalmente per suggerire abbinamenti di colore.
        </span>
        <span className="chip-label__code">#2F4A3E</span>
      </div>
    </section>
  );
}
