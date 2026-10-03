import { useEffect, useMemo, useRef, useState } from 'react';
import {
  COLOUR_EVENT,
  colourById,
  colours,
  families,
  initialColour,
  isDark,
  type FamilyId,
} from '../data/palette';
import { Icon } from './Icon';
import styles from './ColourExplorer.module.css';

type Filter = 'tutti' | FamilyId;

export function ColourExplorer() {
  const [selectedId, setSelectedId] = useState(initialColour.id);
  const [filter, setFilter] = useState<Filter>('tutti');
  const [announce, setAnnounce] = useState('');
  const swatchRefs = useRef(new Map<string, HTMLButtonElement>());
  const firstRender = useRef(true);

  const selected = colourById(selectedId) ?? initialColour;
  const visible = useMemo(
    () => (filter === 'tutti' ? colours : colours.filter((c) => c.family === filter)),
    [filter],
  );
  const familyLabel = families.find((f) => f.id === selected.family)?.label ?? '';
  // roving tabindex: the selected swatch if visible, otherwise the first one
  const tabStopId = visible.some((c) => c.id === selectedId) ? selectedId : visible[0]?.id;

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.dispatchEvent(new CustomEvent(COLOUR_EVENT, { detail: selected.hex }));
    setAnnounce(`Parete in ${selected.name}, ${selected.hex}.`);
  }, [selected]);

  const select = (id: string, focus = false) => {
    setSelectedId(id);
    if (focus) swatchRefs.current.get(id)?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = visible.length - 1;
    let next: number | null = null;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = index === last ? 0 : index + 1;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = index === 0 ? last : index - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
    }
    if (next !== null) {
      e.preventDefault();
      select(visible[next].id, true);
    }
  };

  const reset = () => {
    setFilter('tutti');
    setSelectedId(initialColour.id);
  };

  const ink = isDark(selected.hex) ? 'var(--ivory)' : 'var(--charcoal)';

  return (
    <section id="colori" className={styles.section} aria-labelledby="colori-title">
      <div className="container">
        <header className={`${styles.head} reveal`}>
          <p className="eyebrow">Esplora i colori</p>
          <h2 id="colori-title" className={styles.title}>
            Prova un colore <em>sulla parete.</em>
          </h2>
          <p className={styles.intro}>
            Scegli una tonalità e guarda come cambia l’atmosfera della stanza. Un primo passo per
            orientarti, prima di scegliere dal vero.
          </p>
        </header>

        <div className={styles.layout}>
          <div className={styles.previewCol}>
            <figure className={styles.preview}>
              <div
                className={styles.room}
                role="img"
                aria-label={`Anteprima illustrativa: soggiorno con divano chiaro, tavolino in legno e lampada da terra. La parete di fondo è nel colore ${selected.name} (${selected.hex}).`}
              >
                <img
                  className={styles.base}
                  src="/images/explorer-room-1600.webp"
                  srcSet="/images/explorer-room-960.webp 960w, /images/explorer-room-1600.webp 1600w"
                  sizes="(min-width: 900px) 60vw, 100vw"
                  width={1600}
                  height={1000}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <div className={styles.paint} style={{ backgroundColor: selected.hex }} />
              </div>
              <figcaption className={styles.tag} aria-hidden="true">
                <span className={styles.tagChip} style={{ backgroundColor: selected.hex }} />
                <span className={styles.tagName}>{selected.name}</span>
                <span className={styles.tagHex}>{selected.hex}</span>
              </figcaption>
            </figure>
            <p className={styles.disclaimer}>
              Colori illustrativi: la resa sullo schermo può differire dal colore reale. Verifica la
              tonalità in negozio.
            </p>
            <button
              type="button"
              className={`text-link ${styles.reset} ${styles.resetMobile}`}
              onClick={reset}
            >
              <Icon name="reset" />
              Ripristina il colore iniziale
            </button>
          </div>

          <div className={styles.controls}>
            <div
              className={styles.detail}
              style={{ '--c': selected.hex, '--ink': ink } as React.CSSProperties}
            >
              <div className={styles.detailChip}>
                <span className={styles.detailFamily}>{familyLabel}</span>
              </div>
              <div className={styles.detailText}>
                <p className={styles.detailName}>{selected.name}</p>
                <p className={styles.detailHex}>
                  <span className="visually-hidden">Codice esadecimale </span>
                  {selected.hex}
                </p>
                <p className={styles.detailNote}>{selected.note}</p>
              </div>
            </div>

            <div className={styles.filters} role="group" aria-label="Filtra per famiglia di colore">
              {[{ id: 'tutti', label: 'Tutti' } as const, ...families].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={styles.filter}
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div
              className={styles.swatches}
              role="radiogroup"
              aria-label="Colori di esempio"
            >
              {visible.map((c, i) => (
                <button
                  key={c.id}
                  ref={(el) => {
                    if (el) swatchRefs.current.set(c.id, el);
                    else swatchRefs.current.delete(c.id);
                  }}
                  type="button"
                  role="radio"
                  aria-checked={c.id === selectedId}
                  tabIndex={c.id === tabStopId ? 0 : -1}
                  className={styles.swatch}
                  style={{ '--c': c.hex } as React.CSSProperties}
                  onClick={() => select(c.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                >
                  <span className={styles.swatchColour} aria-hidden="true" />
                  <span className={styles.swatchName}>{c.name}</span>
                  <span className="visually-hidden">, {c.hex}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className={`text-link ${styles.reset} ${styles.resetDesktop}`}
              onClick={reset}
            >
              <Icon name="reset" />
              Ripristina il colore iniziale
            </button>
          </div>
        </div>
        <p className="visually-hidden" aria-live="polite">
          {announce}
        </p>
      </div>
    </section>
  );
}
