import { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';

type Mode = 'still' | 'live';

function canUse3D(): boolean {
  if (typeof window === 'undefined') return false;
  if (!window.matchMedia('(min-width: 960px)').matches) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * The Cycles-rendered still is always present (instant, no layout shift,
 * mobile + no-WebGL fallback). On capable desktops the Three.js scene is
 * lazy-loaded on top and cross-fades in once its first frame is drawn.
 */
export function HeroVisual() {
  const stage = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>('still');

  useEffect(() => {
    if (!canUse3D() || !stage.current) return;
    let disposed = false;
    let dispose: (() => void) | undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = () =>
      import('../three/heroScene')
        .then(({ createHeroScene }) => {
          if (disposed || !stage.current) return;
          return createHeroScene(stage.current, {
            reducedMotion: reduced,
            onReady: () => !disposed && setMode('live'),
            onLost: () => !disposed && setMode('still'),
          });
        })
        .then((handle) => {
          if (!handle) return;
          if (disposed) handle.dispose();
          else dispose = handle.dispose;
        })
        .catch(() => {
          // WebGL context or asset failure: the static render stays visible.
          if (!disposed) setMode('still');
        });
    // let the page settle before fetching the 3D bundle
    const hasIdle = typeof window.requestIdleCallback === 'function';
    const handle = hasIdle
      ? window.requestIdleCallback(() => void start(), { timeout: 1500 })
      : window.setTimeout(() => void start(), 300);
    return () => {
      disposed = true;
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      dispose?.();
    };
  }, []);

  return (
    <figure className={`${styles.visual} ${mode === 'live' ? styles.live : ''}`}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.frame}>
        <img
          className={styles.still}
          src="/images/hero-still-1200.webp"
          srcSet="/images/hero-still-720.webp 720w, /images/hero-still-1200.webp 1200w"
          sizes="(min-width: 960px) 46vw, 92vw"
          width={1200}
          height={1500}
          alt="Composizione illustrativa: un barattolo di pittura aperto color terracotta con etichetta Arte Colore, il coperchio appoggiato e un ventaglio di cartelle colore davanti a un arco in intonaco verde salvia."
          {...{ fetchpriority: 'high' }}
          decoding="async"
        />
        <div ref={stage} className={styles.stage} aria-hidden="true" />
      </div>
      <figcaption className="visually-hidden">
        Illustrazione 3D originale creata per il sito: non raffigura un prodotto in vendita.
      </figcaption>
    </figure>
  );
}
