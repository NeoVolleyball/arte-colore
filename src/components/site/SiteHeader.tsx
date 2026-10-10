import { useEffect, useRef, useState } from 'react';
import { navLinks, site } from '@/data/site';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { Icon } from './icons';
import { Button, Container } from './primitives';

export function SiteHeader({ showOffers }: { showOffers: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const links = navLinks.filter((l) => showOffers || l.id !== 'sconti');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onDesktop = () => desktop.matches && setOpen(false);
    document.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onDesktop);
    return () => {
      document.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onDesktop);
    };
  }, [open]);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300',
        scrolled || open
          ? 'border-line bg-bg/90 shadow-[0_8px_24px_-20px_rgb(31_26_23/0.5)] backdrop-blur-md'
          : 'border-transparent bg-bg/60 backdrop-blur-sm',
      )}
    >
      <a href="#contenuto" className="sr-only-focusable z-50 rounded-full bg-ink px-4 py-2 text-sm text-bg">
        Vai al contenuto
      </a>
      <Container className="flex h-[var(--header-h)] items-center justify-between gap-4">
        <a href="#top" className="-m-2 flex items-center rounded-lg p-2" aria-label={`${site.brand}, torna all’inizio`}>
          <Logo className="h-9 w-auto sm:h-10" />
        </a>

        <nav aria-label="Principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className="rounded-full px-3 py-2 text-[0.9375rem] font-medium text-ink-muted transition-colors hover:bg-stone hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button href="#contatti" size="md" className="hidden sm:inline-flex">
            Richiedi un preventivo
          </Button>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-2xl text-ink ring-1 ring-line ring-inset hover:bg-stone lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'close' : 'menu'} />
            <span className="sr-only">{open ? 'Chiudi il menu' : 'Apri il menu'}</span>
          </button>
        </div>
      </Container>

      <div
        id="menu-mobile"
        ref={panelRef}
        hidden={!open}
        className="border-t border-line bg-bg lg:hidden"
      >
        <nav aria-label="Menu mobile">
          <Container className="py-4">
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-3.5 font-display text-2xl text-ink hover:bg-stone"
                  >
                    {l.label}
                    <Icon name="arrowRight" className="text-lg text-accent" />
                  </a>
                </li>
              ))}
            </ul>
            <Button href="#contatti" size="lg" className="mt-4 w-full" onClick={() => setOpen(false)}>
              Richiedi un preventivo
            </Button>
          </Container>
        </nav>
      </div>
    </header>
  );
}
