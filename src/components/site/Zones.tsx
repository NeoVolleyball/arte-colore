import { site } from '@/data/site';
import { Icon } from './icons';
import { Button, Container, Heading, Section } from './primitives';

export function Zones() {
  const { title, intro, areas, cta } = site.zones;
  return (
    <Section id="zone" tone="stone" aria-labelledby="zone-title" className="md:py-24 lg:py-28">
      <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <Heading id="zone-title" eyebrow="Dove lavoriamo" title={title} intro={intro} className="mb-0 md:mb-0" />
        <div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {areas.map((a) => (
              <li key={a} className="flex items-center gap-4 rounded-2xl bg-surface p-5 shadow-soft ring-1 ring-line">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-2xl text-accent-strong">
                  <Icon name="pin" />
                </span>
                <span className="font-display text-h3">{a}</span>
              </li>
            ))}
          </ul>
          <Button href={site.links.zoneMap} target="_blank" rel="noopener noreferrer" variant="secondary" className="mt-6">
            {cta}
            <Icon name="arrowRight" />
            <span className="sr-only">(si apre in una nuova scheda)</span>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
