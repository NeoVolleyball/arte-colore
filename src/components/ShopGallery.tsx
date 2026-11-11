import { useEffect, useRef, useState } from 'react';
import { business } from '../content/business';
import { departments } from '../content/gallery';
import { withBase } from '../content/paths';
import { Icon } from './Icon';
import styles from './ShopGallery.module.css';

type Item = { file: string; alt: string; w: number; h: number; dept: string };

const all: Item[] = departments.flatMap((d) => d.photos.map((p) => ({ ...p, dept: d.name })));
/** in "Tutti", show the first photo of every department first, then the rest */
const tutti: Item[] = [
  ...departments.map((d) => ({ ...d.photos[0], dept: d.name })),
  ...departments.flatMap((d) => d.photos.slice(1).map((p) => ({ ...p, dept: d.name }))),
];
const PREVIEW = 8;

const src = (file: string, w: 640 | 1280) => withBase(`/images/negozio/${file}-${w}.webp`);

/** "Reparti": real photos of the shop, filterable by department, with a lightbox. Data in gallery.ts. */
export function ShopGallery() {
  const [filter, setFilter] = useState<string>('tutti');
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const dept = departments.find((d) => d.id === filter);
  const items: Item[] = dept ? dept.photos.map((p) => ({ ...p, dept: dept.name })) : tutti;
  const visible = dept || expanded ? items : items.slice(0, PREVIEW);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal?.();
    if (open === null && d.open) d.close();
  }, [open]);

  const step = (delta: number) => setOpen((i) => (i === null ? i : (i + delta + items.length) % items.length));
  const current = open !== null ? items[open] : null;

  return (
    <section id="reparti" className={styles.section} aria-labelledby="reparti-title">
      <div className="wrap">
        <header className={`${styles.head} reveal`}>
          <p className="kicker">Il negozio</p>
          <h2 id="reparti-title" className={styles.title}>
            Tutto per il colore, <em>e non solo.</em>
          </h2>
          <p className={styles.lead}>
            Foto dai nostri reparti in Via Roma 175 a Spinea: pitture, pavimenti, carte da parati, belle arti,
            accessori, abrasivi e duplicazione chiavi.
          </p>
        </header>

        <div className={styles.filters} role="group" aria-label="Filtra per reparto">
          <button type="button" aria-pressed={filter === 'tutti'} onClick={() => setFilter('tutti')}>
            Tutti <span>{all.length}</span>
          </button>
          {departments.map((d) => (
            <button key={d.id} type="button" aria-pressed={filter === d.id} onClick={() => setFilter(d.id)}>
              {d.name} <span>{d.photos.length}</span>
            </button>
          ))}
        </div>

        {dept ? (
          <p className={styles.deptText} aria-live="polite">
            <strong>{dept.name}.</strong> {dept.text}
          </p>
        ) : null}

        <ul role="list" className={styles.grid}>
          {visible.map((p, i) => (
            <li key={p.file}>
              <button type="button" className={styles.item} onClick={() => setOpen(i)} aria-label={`Ingrandisci: ${p.alt}`}>
                <img
                  src={src(p.file, 640)}
                  srcSet={`${src(p.file, 640)} 640w, ${src(p.file, 1280)} 1280w`}
                  sizes="(min-width: 1100px) 25vw, (min-width: 700px) 33vw, 50vw"
                  width={p.w}
                  height={p.h}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <span className={styles.caption}>{p.dept}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.foot}>
          {!dept && !expanded && items.length > PREVIEW ? (
            <button type="button" className="btn" onClick={() => setExpanded(true)}>
              Mostra tutte le foto ({items.length}) <Icon name="arrow-down" />
            </button>
          ) : null}
          <a className="text-link" href={business.phone.href}>
            <Icon name="phone" /> Cerchi qualcosa? Chiamaci al {business.phone.local}
          </a>
        </div>
      </div>

      <dialog
        ref={dialog}
        className={styles.lightbox}
        aria-label="Foto del negozio"
        onClose={() => setOpen(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(null);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1);
          if (e.key === 'ArrowLeft') step(-1);
        }}
      >
        {current ? (
          <figure>
            <img src={src(current.file, 1280)} width={current.w} height={current.h} alt={current.alt} />
            <figcaption>
              <strong>{current.dept}</strong>
              <span>
                {(open ?? 0) + 1} / {items.length}
              </span>
            </figcaption>
          </figure>
        ) : null}
        <button type="button" className={styles.close} onClick={() => setOpen(null)} aria-label="Chiudi">
          <Icon name="close" />
        </button>
        {items.length > 1 ? (
          <>
            <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => step(-1)} aria-label="Foto precedente">
              <Icon name="arrow" />
            </button>
            <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => step(1)} aria-label="Foto successiva">
              <Icon name="arrow" />
            </button>
          </>
        ) : null}
      </dialog>
    </section>
  );
}
