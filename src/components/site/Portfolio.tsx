import { useCallback, useEffect, useRef, useState } from 'react';
import { BentoGrid } from '@/components/ui/bento-grid';
import { GlareHover } from '@/components/ui/glare-hover';
import { Marquee } from '@/components/ui/marquee';
import { projects, type Project } from '@/data/projects';
import { cn } from '@/lib/utils';
import { Icon } from './icons';
import { Container, Heading, Section } from './primitives';
import { withBase } from '@/content/paths';

const src = (p: Project, w: 640 | 1200) => withBase(`${p.image}-${w}.webp`);

export function Portfolio() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <Section id="lavori" aria-labelledby="lavori-title">
      <Container>
        <Heading
          id="lavori-title"
          eyebrow="Lavori fatti"
          title="Case che hanno cambiato volto"
          intro="Una selezione dei nostri lavori di pavimenti, pareti e decorazioni. Tocca una foto per vederla in grande."
        />

        <BentoGrid className="grid-flow-dense auto-rows-[15rem] grid-cols-1 gap-4 sm:grid-cols-2 sm:auto-rows-[17rem] lg:grid-cols-3 lg:auto-rows-[19rem]">
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActive(i)}
              aria-haspopup="dialog"
              className={cn(
                'group relative overflow-hidden rounded-2xl text-left shadow-soft ring-1 ring-line',
                'transition-shadow duration-300 hover:shadow-lift focus-visible:shadow-lift',
                p.size === 'wide' && 'lg:col-span-2',
              )}
            >
              <GlareHover
                width="100%"
                height="100%"
                background="transparent"
                color="#ffffff"
                opacity={0.35}
                size={260}
                className="absolute inset-0 rounded-none"
              >
                <img
                  src={src(p, p.size === 'wide' ? 1200 : 640)}
                  srcSet={`${src(p, 640)} 640w, ${src(p, 1200)} 1200w`}
                  sizes={p.size === 'wide' ? '(min-width: 1024px) 66vw, (min-width: 640px) 50vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  alt={p.alt}
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.04]"
                />
              </GlareHover>
              <span className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-night/85 via-night/20 to-transparent" />
              {p.example && (
                <span className="absolute top-3 left-3 z-20 rounded-full bg-bg/90 px-3 py-1 text-xs font-semibold text-ink">
                  Foto di esempio
                </span>
              )}
              <span className="absolute top-3 right-3 z-20 flex size-9 items-center justify-center rounded-full bg-bg/90 text-ink opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Icon name="expand" />
              </span>
              <span className="absolute inset-x-0 bottom-0 z-20 p-5 text-on-night">
                <span className="mb-2 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="inline-flex items-center gap-1 rounded-full bg-on-night/15 px-2.5 py-1 backdrop-blur-sm">
                    <Icon name="pin" />
                    {p.location}
                  </span>
                  <span className="rounded-full bg-on-night/15 px-2.5 py-1 backdrop-blur-sm">{p.category}</span>
                </span>
                <span className="block font-display text-h3">{p.title}</span>
              </span>
            </button>
          ))}
        </BentoGrid>
      </Container>

      <div className="mt-12 border-y border-line bg-stone/60 py-3" aria-hidden="true">
        <Marquee pauseOnHover className="[--duration:45s] [--gap:2.5rem]" repeat={3}>
          {projects.map((p) => (
            <span key={p.id} className="flex items-center gap-3 text-sm font-semibold whitespace-nowrap text-ink-muted">
              <span className="size-1.5 rounded-full bg-accent" />
              {p.title} · {p.location}
            </span>
          ))}
        </Marquee>
      </div>

      <Lightbox index={active} onChange={setActive} />
    </Section>
  );
}

function Lightbox({ index, onChange }: { index: number | null; onChange: (i: number | null) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const project = index === null ? null : projects[index];
  const go = useCallback(
    (delta: number) => index !== null && onChange((index + delta + projects.length) % projects.length),
    [index, onChange],
  );

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="lightbox-title"
      onClose={() => onChange(null)}
      onClick={(e) => e.target === e.currentTarget && onChange(null)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1);
        if (e.key === 'ArrowLeft') go(-1);
      }}
      className="m-auto max-h-[92dvh] w-[min(64rem,calc(100vw-2rem))] overflow-visible bg-transparent p-0 backdrop:bg-night/85 backdrop:backdrop-blur-sm"
    >
      {project && (
        <figure className="overflow-hidden rounded-2xl bg-night text-on-night shadow-lift">
          <img
            src={src(project, 1200)}
            width={1200}
            height={900}
            alt={project.alt}
            className="max-h-[70dvh] w-full bg-night-soft object-contain"
          />
          <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4 sm:p-5">
            <div className="mr-auto">
              <p id="lightbox-title" className="font-display text-xl">
                {project.title}
              </p>
              <p className="text-sm text-on-night-muted">
                {project.location} · {project.category}
                {project.example && ' · Foto di esempio'}
              </p>
            </div>
            <div className="flex gap-2">
              <LightboxButton label="Foto precedente" icon="arrowLeft" onClick={() => go(-1)} />
              <LightboxButton label="Foto successiva" icon="arrowRight" onClick={() => go(1)} />
              <LightboxButton label="Chiudi" icon="close" onClick={() => onChange(null)} autoFocus />
            </div>
          </figcaption>
        </figure>
      )}
    </dialog>
  );
}

function LightboxButton({
  label,
  icon,
  ...props
}: { label: string; icon: 'arrowLeft' | 'arrowRight' | 'close' } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex size-11 items-center justify-center rounded-full bg-on-night/10 text-xl text-on-night hover:bg-on-night/20"
      {...props}
    >
      <Icon name={icon} />
    </button>
  );
}
