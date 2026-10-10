import { qrSvgDataUri } from 'virtual:site-qr';
import { navLinks, site } from '@/data/site';
import { Logo } from './Logo';
import { Icon } from './icons';
import { Container } from './primitives';

export function Footer({ showOffers }: { showOffers: boolean }) {
  const links = navLinks.filter((l) => showOffers || l.id !== 'sconti');
  return (
    <footer className="border-t border-line bg-bg pt-16 pb-28 md:pb-12">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <Logo className="h-10 w-auto" />
            <p className="mt-4 max-w-sm text-ink-muted">Pavimenti in laminato SPC, carta da parati e decorazioni per rinnovare la casa.</p>
            <a
              href={site.links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-line bg-surface py-1.5 pr-3 pl-2 text-xs font-semibold text-ink-muted transition-colors hover:border-ink-muted hover:text-ink"
            >
              <span className="flex size-6 items-center justify-center rounded bg-[#1877f2] text-sm text-white">
                <Icon name="facebook" strokeWidth={0} fill="currentColor" />
              </span>
              Seguici su Facebook
              <span className="sr-only">(si apre in una nuova scheda)</span>
            </a>
          </div>

          <nav aria-label="Piè di pagina">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-[0.9375rem]">
              {links.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="text-ink-muted underline-offset-4 hover:text-ink hover:underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-line pt-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-sm text-ink-muted">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {site.brand}. Tutti i diritti riservati.
          </p>
          <figure className="flex items-center gap-4 sm:flex-row-reverse sm:text-right">
            <img
              src={qrSvgDataUri}
              width={96}
              height={96}
              loading="lazy"
              alt={`Codice QR che apre il sito ${site.url}`}
              className="size-24 rounded-lg bg-surface p-2 ring-1 ring-line"
            />
            <figcaption className="max-w-40 text-xs text-ink-muted">Inquadra il codice per aprire il sito dal telefono</figcaption>
          </figure>
        </div>
      </Container>
    </footer>
  );
}
