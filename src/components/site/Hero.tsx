import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { WordRotate } from '@/components/ui/word-rotate';
import { useMediaQuery, useReducedMotion } from '@/hooks/useMediaQuery';
import { site } from '@/data/site';
import { Icon } from './icons';
import { Button, Container } from './primitives';

// Heavy visuals are code-split and only mounted in the browser when useful.
const Particles = lazy(() => import('@/components/ui/particles').then((m) => ({ default: m.Particles })));
const HeroVisual = lazy(() => import('@/components/HeroVisual').then((m) => ({ default: m.HeroVisual })));

const swatches = [
  { label: 'Pavimenti', src: '/images/portfolio/lavoro-1-640.webp' },
  { label: 'Pareti', src: '/images/portfolio/lavoro-2-640.webp' },
  { label: 'Decorazioni', src: '/images/wallpapers/carta-2-480.webp' },
];

export function Hero() {
  const { titleStart, rotatingWords, subline } = site.hero;
  const reduced = useReducedMotion();
  const desktop = useMediaQuery('(min-width: 1024px)');
  const saveData = useSaveData();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);
  // Start on the most general word ("spazi"), cycle once through all, then rest.
  const words = [...rotatingWords.slice(-1), ...rotatingWords.slice(0, -1)];

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-bg pt-10 pb-16 sm:pt-16 md:pb-24 lg:pt-20 lg:pb-28"
    >
      {/* Backdrop: warm light + particles (desktop, motion allowed, on screen only) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 size-[38rem] rounded-full bg-accent-soft/70 blur-3xl" />
        <div className="absolute -bottom-48 -left-32 size-[30rem] rounded-full bg-stone blur-3xl" />
        {desktop && !reduced && !saveData && inView && (
          <Suspense fallback={null}>
            <Particles className="absolute inset-0" quantity={70} ease={70} size={0.6} color="#a3432a" staticity={60} />
          </Suspense>
        )}
      </div>

      <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-surface/80 px-4 py-1.5 text-sm font-semibold text-ink-muted ring-1 ring-line">
            <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
            {site.tagline}
          </p>
          <h1 id="hero-title" className="text-display font-medium text-ink">
            <span className="sr-only">
              {titleStart} {rotatingWords.slice(0, -1).join(', ')} e {rotatingWords.at(-1)}
            </span>
            <span aria-hidden="true">
              {titleStart}
              <br />
              <WordRotate
                words={words}
                cycles={1}
                paused={reduced}
                duration={2200}
                className="text-accent italic"
                motionProps={{
                  initial: { opacity: 0, y: '40%' },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: '-40%' },
                  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                }}
              />
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lead text-ink-muted">{subline}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="#contatti" size="lg">
              Richiedi un preventivo
              <Icon name="arrowRight" />
            </Button>
            <Button href="#lavori" variant="secondary" size="lg">
              Guarda i lavori
            </Button>
          </div>

          <ul className="mt-10 grid max-w-md grid-cols-3 gap-3 lg:hidden" aria-label="Cosa facciamo">
            {swatches.map((s) => (
              <li key={s.label} className="overflow-hidden rounded-2xl bg-surface shadow-soft ring-1 ring-line">
                <img src={s.src} alt="" width={640} height={480} className="aspect-[4/3] w-full object-cover" />
                <span className="block px-3 py-2 text-sm font-semibold">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop: the existing Three.js scene (lazy, static under reduced motion). */}
        <div className="relative hidden aspect-[4/5] w-full max-w-[30rem] justify-self-end opacity-95 lg:block">
          {desktop && !saveData && (
            <Suspense fallback={null}>
              <HeroVisual />
            </Suspense>
          )}
        </div>
      </Container>
    </section>
  );
}

function useSaveData() {
  const [saveData, setSaveData] = useState(false);
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setSaveData(!!conn?.saveData);
  }, []);
  return saveData;
}

function useInView(ref: React.RefObject<Element>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}
