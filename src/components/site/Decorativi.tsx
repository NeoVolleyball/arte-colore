import { MagicCard } from '@/components/ui/magic-card';
import { wallpapers } from '@/data/wallpapers';
import { Icon } from './icons';
import { Button, Container, Heading, Section } from './primitives';
import { withBase } from '@/content/paths';

export function Decorativi() {
  return (
    <Section id="decorativi" tone="stone" aria-labelledby="decorativi-title">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Heading
            id="decorativi-title"
            eyebrow="Decorativi"
            title="Carta da parati"
            intro="Carta da parati per abbellire o dare carattere a una stanza."
            className="md:mb-14"
          />
          <Button href="#contatti" variant="secondary" className="mb-10 self-start md:mb-14 md:self-auto">
            Chiedi informazioni
            <Icon name="arrowRight" />
          </Button>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {wallpapers.map((w) => (
            <li key={w.id} className="rounded-2xl">
              <MagicCard
                className="h-full rounded-2xl shadow-soft"
                gradientSize={260}
                gradientColor="#f5e1d7"
                gradientOpacity={0.55}
                gradientFrom="#a3432a"
                gradientTo="#c58a2c"
              >
                <article className="flex h-full flex-col p-3">
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={withBase(`${w.image}-480.webp`)}
                      srcSet={withBase(`${w.image}-480.webp 480w, ${w.image}-800.webp 800w`)}
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw"
                      width={800}
                      height={1000}
                      loading="lazy"
                      decoding="async"
                      alt={w.alt}
                      className="aspect-[4/5] w-full object-cover"
                    />
                    {w.example && (
                      <span className="absolute top-3 left-3 rounded-full bg-bg/90 px-3 py-1 text-xs font-semibold">
                        Foto di esempio
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
                    <p className="text-xs font-semibold tracking-[0.12em] text-accent uppercase">{w.tag}</p>
                    <h3 className="mt-1.5 text-h3 font-medium">{w.title}</h3>
                    <p className="mt-2 text-[0.9375rem] text-ink-muted">{w.description}</p>
                  </div>
                </article>
              </MagicCard>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
