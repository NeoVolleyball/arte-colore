import { useEffect, useMemo, useRef, useState } from 'react';
import {
  COLOUR_EVENT,
  colourById,
  colours,
  families,
  initialColour,
  inkFor,
  type Colour,
  type FamilyId,
} from '../data/palette';
import { createLiquidPour, type LiquidPour } from '../effects/liquidPour';
import { Drips } from './Drips';
import { Icon } from './Icon';
import styles from './ColourExplorer.module.css';
import { withBase } from '../content/paths';

type Filter = 'tutti' | FamilyId;

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Colour explorer. Picking a sample floods the whole card with that colour
 * (a circular "paint pour" from the sample), recolours the wall of the
 * rendered room and tints the paint in the 3D hero tin.
 */
export function ColourExplorer() {
  const [selectedId, setSelectedId] = useState(initialColour.id);
  const [cardColour, setCardColour] = useState<Colour>(initialColour);
  const [inkColour, setInkColour] = useState<Colour>(initialColour);
  const [filter, setFilter] = useState<Filter>('tutti');
  const [announce, setAnnounce] = useState('');
  const sectionRef = useRef<HTMLElement>(null);
  const floodRef = useRef<HTMLDivElement>(null);
  const floodAnim = useRef<Animation | null>(null);
  const liquid = useRef<LiquidPour | null | undefined>(undefined);

  useEffect(() => () => liquid.current?.dispose(), []);
  const swatchRefs = useRef(new Map<string, HTMLButtonElement>());
  const firstRender = useRef(true);

  const selected = colourById(selectedId) ?? initialColour;
  const visible = useMemo(
    () => (filter === 'tutti' ? colours : colours.filter((c) => c.family === filter)),
    [filter],
  );
  const familyLabel = families.find((f) => f.id === selected.family)?.label ?? '';
  const tabStopId = visible.some((c) => c.id === selectedId) ? selectedId : visible[0]?.id;

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.dispatchEvent(new CustomEvent(COLOUR_EVENT, { detail: selected.hex }));
    setAnnounce(`Parete in ${selected.name}, ${selected.hex}.`);
  }, [selected]);

  /** Pour the new colour over the card from `origin` (a swatch element). */
  const pour = (next: Colour, origin?: HTMLElement | null) => {
    const section = sectionRef.current;
    const flood = floodRef.current;
    floodAnim.current?.finish();
    liquid.current?.finish();
    if (!section || !flood || !origin || reducedMotion() || typeof flood.animate !== 'function') {
      setCardColour(next);
      setInkColour(next);
      return;
    }
    const s = section.getBoundingClientRect();
    const o = origin.getBoundingClientRect();
    const x = o.left + o.width / 2 - s.left;
    const y = o.top + o.height / 2 - s.top;

    // preferred: WebGL wet-paint pour (created on first use)
    if (liquid.current === undefined) liquid.current = createLiquidPour(section);
    if (liquid.current) {
      liquid.current.pour({
        x,
        y,
        hex: next.hex,
        midAt: 0.62,
        onMid: () => setInkColour(next),
        onDone: () => {
          setInkColour(next);
          setCardColour(next);
        },
      });
      return;
    }

    // fallback: circular clip-path pour
    const r = Math.hypot(Math.max(x, s.width - x), Math.max(y, s.height - y));
    flood.style.backgroundColor = next.hex;
    const anim = flood.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${r}px at ${x}px ${y}px)` },
      ],
      { duration: 950, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' },
    );
    floodAnim.current = anim;
    // swap the text ink half-way through the pour; commit the card colour at the end
    const swap = window.setTimeout(() => setInkColour(next), 620);
    anim.onfinish = () => {
      window.clearTimeout(swap);
      setInkColour(next);
      setCardColour(next);
      anim.cancel();
      if (floodAnim.current === anim) floodAnim.current = null;
    };
  };

  const select = (id: string, focus = false) => {
    const next = colourById(id);
    if (!next || id === selectedId) return;
    setSelectedId(id);
    const el = swatchRefs.current.get(id);
    if (focus) el?.focus();
    pour(next, el);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = visible.length - 1;
    const map: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowDown: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (e.key in map) {
      e.preventDefault();
      select(visible[map[e.key]].id, true);
    }
  };

  const reset = (e: React.MouseEvent<HTMLButtonElement>) => {
    setFilter('tutti');
    if (selectedId === initialColour.id) return;
    setSelectedId(initialColour.id);
    pour(initialColour, e.currentTarget);
  };

  const ink = inkFor(inkColour.hex);

  return (
    <section
      id="colori"
      ref={sectionRef}
      className={`card ${styles.section}`}
      style={
        {
          '--card-bg': cardColour.hex,
          '--ink': ink.ink,
          '--ink-soft': ink.soft,
        } as React.CSSProperties
      }
      data-ink={ink.dark ? 'light' : 'dark'}
      aria-labelledby="colori-title"
    >
      <div ref={floodRef} className={styles.flood} aria-hidden="true" />

      <div className={styles.layout}>
        <header className={styles.head}>
          <p className="kicker">Esplora i colori</p>
          <h2 id="colori-title" className={styles.title}>
            Prova un colore <em>sulla parete.</em>
          </h2>
          <p className={styles.intro}>
            Tocca un campione: il colore riempie la stanza e la pagina. Un primo passo per
            orientarti, prima di scegliere dal vero.
          </p>
        </header>

        <figure className={styles.preview}>
          <div
            className={styles.room}
            role="img"
            aria-label={`Anteprima illustrativa: soggiorno con divano chiaro, tavolino in legno e lampada da terra. La parete di fondo è nel colore ${selected.name} (${selected.hex}).`}
          >
            <img
              className={styles.base}
              src={withBase('/images/explorer-room-1600.webp')}
              srcSet={withBase('/images/explorer-room-960.webp 960w, /images/explorer-room-1600.webp 1600w')}
              sizes="(min-width: 960px) 58vw, 100vw"
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
          <button type="button" className={styles.reset} onClick={reset}>
            <Icon name="reset" />
            <span>Ripristina il colore iniziale</span>
          </button>
        </figure>

        <div className={styles.controls}>
          <div className={styles.now}>
            <p className={styles.nowFamily}>{familyLabel}</p>
            <p className={styles.nowName}>{selected.name}</p>
            <p className={styles.nowMeta}>
              <span className={styles.nowHex}>
                <span className="visually-hidden">Codice esadecimale </span>
                {selected.hex}
              </span>
              <span>{selected.note}</span>
            </p>
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

          <div className={styles.swatches} role="radiogroup" aria-label="Colori di esempio">
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
                style={{ '--c': c.hex, '--d': `${i * 28}ms` } as React.CSSProperties}
                onClick={() => select(c.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                <span className={styles.swatchColour} aria-hidden="true" />
                <span className={styles.swatchName}>{c.name}</span>
                <span className="visually-hidden">, {c.hex}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`chip-label ${styles.label}`}>
        <Drips seed={7} count={12} />
        <span className="chip-label__name">{selected.name}</span>
        <span className="chip-label__meta">
          Colori illustrativi: la resa sullo schermo può differire dal colore reale. Verifica la
          tonalità in negozio.
        </span>
        <span className="chip-label__code">{selected.hex}</span>
      </div>
      <p className="visually-hidden" aria-live="polite">
        {announce}
      </p>
    </section>
  );
}
