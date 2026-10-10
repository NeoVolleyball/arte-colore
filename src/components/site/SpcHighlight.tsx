import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import { BorderBeam } from '@/components/ui/border-beam';
import { site } from '@/data/site';
import { Icon, type IconName } from './icons';
import { Button, Container, Section } from './primitives';

const benefitIcons: IconName[] = ['zap', 'drop', 'layers'];

export function SpcHighlight() {
  const { badge, title, intro, benefits } = site.spc;
  return (
    <Section id="spc" tone="stone" aria-labelledby="spc-title">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-surface shadow-lift ring-1 ring-line">
          <BorderBeam size={220} duration={9} borderWidth={2} colorFrom="#a3432a" colorTo="#c58a2c" />
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 sm:p-10 lg:p-14">
              <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-1.5 text-sm font-semibold">
                <Icon name="sparkle" className="text-accent-strong" />
                <AnimatedShinyText className="mx-0 max-w-none text-accent-strong via-white/90" shimmerWidth={80}>
                  {badge}
                </AnimatedShinyText>
              </p>
              <h2 id="spc-title" className="mt-6 text-h2 font-medium">
                {title}
              </h2>
              <p className="mt-5 max-w-xl text-lead text-ink-muted">{intro}</p>

              <ul className="mt-9 space-y-6">
                {benefits.map((b, i) => (
                  <li key={b.title} className="flex gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-2xl text-white shadow-soft">
                      <Icon name={benefitIcons[i % benefitIcons.length]} />
                    </span>
                    <div>
                      <h3 className="font-sans text-lg font-semibold tracking-normal">{b.title}</h3>
                      <p className="mt-1 text-ink-muted">{b.text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button href="#contatti" size="lg">
                  Chiedi informazioni sull’SPC
                  <Icon name="arrowRight" />
                </Button>
                <Button href="#lavori" variant="secondary" size="lg">
                  Vedi i lavori
                </Button>
              </div>
            </div>

            <div className="relative min-h-72 lg:min-h-full">
              <img
                src="/images/portfolio/lavoro-1-1200.webp"
                srcSet="/images/portfolio/lavoro-1-640.webp 640w, /images/portfolio/lavoro-1-1200.webp 1200w"
                sizes="(min-width: 1024px) 45vw, 100vw"
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
                alt="Immagine di esempio: doghe di pavimento effetto legno chiaro"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/80 to-transparent p-6 pt-20 text-on-night">
                <p className="text-sm font-semibold tracking-[0.14em] uppercase">Effetto legno · Effetto pietra</p>
                <p className="mt-1 text-xs text-on-night-muted">Foto di esempio</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
