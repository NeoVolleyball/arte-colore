import { contactLinks, site } from '@/data/site';
import { Icon, type IconName } from './icons';
import { Button, Container, Section } from './primitives';

export function Contact() {
  const c = site.contact;
  const address = `${c.address.street}, ${c.address.postalCode} ${c.address.city} (${c.address.province})`;
  const items: { icon: IconName; label: string; value: string; href?: string; external?: boolean }[] = [
    { icon: 'phone', label: 'Telefono', value: c.phoneDisplay, href: contactLinks.tel },
    { icon: 'whatsapp', label: 'WhatsApp', value: 'Scrivici su WhatsApp', href: contactLinks.whatsapp, external: true },
    { icon: 'mail', label: 'Email', value: c.email, href: contactLinks.mailto },
    { icon: 'pin', label: 'Indirizzo', value: address },
    { icon: 'clock', label: 'Orari', value: c.hours },
  ];

  return (
    <Section id="contatti" tone="dark" aria-labelledby="contatti-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-[-10%] size-[32rem] rounded-full bg-accent/25 blur-3xl" />
      </div>
      <Container className="relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-semibold tracking-[0.14em] text-accent-on-night uppercase">Contatti</p>
          <h2 id="contatti-title" className="text-h2 font-medium">
            Raccontaci cosa vuoi rinnovare
          </h2>
          <p className="mt-5 max-w-xl text-lead text-on-night-muted">
            Richiedi un preventivo: chiamaci o scrivici su WhatsApp con qualche foto della stanza, oppure mandaci una
            email.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href={contactLinks.tel} size="lg">
              <Icon name="phone" />
              Chiama ora
            </Button>
            <Button href={contactLinks.whatsapp} target="_blank" rel="noopener noreferrer" variant="light" size="lg">
              <Icon name="whatsapp" />
              Scrivi su WhatsApp
              <span className="sr-only">(si apre in una nuova scheda)</span>
            </Button>
          </div>
        </div>

        <address className="rounded-3xl bg-night-soft p-6 not-italic ring-1 ring-on-night/10 sm:p-8">
          <ul className="divide-y divide-on-night/10">
            {items.map((it) => (
              <li key={it.label} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-on-night/10 text-xl text-accent-on-night">
                  <Icon name={it.icon} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold tracking-wide text-on-night-muted uppercase">{it.label}</span>
                  {it.href ? (
                    <a
                      href={it.href}
                      {...(it.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="block font-semibold break-words text-on-night underline-offset-4 hover:underline"
                    >
                      {it.value}
                    </a>
                  ) : (
                    <span className="block font-semibold break-words">{it.value}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </address>
      </Container>
    </Section>
  );
}
