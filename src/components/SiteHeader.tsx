import { useCallback, useEffect, useRef, useState } from 'react';
import { business, nav, type PageId } from '../content/business';
import { Icon } from './Icon';
import { Wordmark } from './Wordmark';
import styles from './SiteHeader.module.css';
import { withBase } from '../content/paths';

const chipColours = ['var(--terracotta)', 'var(--sage)', 'var(--ochre)', 'var(--ivory)'];

export function SiteHeader({ page }: { page: PageId }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close(true);
    const mq = window.matchMedia('(min-width: 960px)');
    const onMq = () => mq.matches && close(false);
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
      document.documentElement.style.overflow = '';
    };
  }, [open, close]);

  // keep Tab inside toggle + open panel
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !open) return;
    const items = [
      toggleRef.current,
      ...Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a, button') ?? []),
    ].filter(Boolean) as HTMLElement[];
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${open ? styles.isOpen : ''}`}
      onKeyDown={onKeyDown}
    >
      <div className={styles.bar}>
        <a href={withBase('/')} className={styles.brand} aria-label="Arte Colore, pagina iniziale">
          <Wordmark />
        </a>

        <nav className={styles.desktopNav} aria-label="Principale">
          <ul role="list">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={withBase(item.href)} aria-current={item.page === page ? 'page' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a className={styles.call} href={business.phone.href}>
            <span className={styles.callIcon}>
              <Icon name="phone" />
            </span>
            <span className={styles.callText}>
              <span className={styles.callLabel}>Chiamaci</span>
              <span className={styles.callNumber}>{business.phone.local}</span>
            </span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => (open ? close(false) : setOpen(true))}
          >
            <span className={styles.burger} aria-hidden="true">
              <i />
              <i />
            </span>
            <span className="visually-hidden">{open ? 'Chiudi il menu' : 'Apri il menu'}</span>
          </button>
        </div>
      </div>

      <div id="menu-mobile" ref={panelRef} className={styles.panel} hidden={!open}>
        <nav aria-label="Menu mobile" className={styles.panelInner}>
          <ul role="list" className={styles.mobileList}>
            {nav.map((item, i) => (
              <li key={item.href} style={{ '--i': i, '--chip': chipColours[i] } as React.CSSProperties}>
                <a
                  href={withBase(item.href)}
                  aria-current={item.page === page ? 'page' : undefined}
                  onClick={() => close(false)}
                >
                  <span className={styles.chip} aria-hidden="true" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.panelFoot}>
            <a className="btn btn--ivory" href={business.phone.href}>
              <Icon name="phone" /> Chiama {business.phone.local}
            </a>
            <p>
              {business.address.street} · {business.address.postalCode} {business.address.city} (
              {business.address.province})
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}
