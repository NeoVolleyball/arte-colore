import { useCallback, useEffect, useRef, useState } from 'react';
import { business, nav } from '../content/business';
import { Icon } from './Icon';
import { Wordmark } from './Wordmark';
import styles from './Header.module.css';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // subtle visual change after scrolling
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

  // focus management + Escape + lock page scroll while the menu is open
  useEffect(() => {
    if (!open) return;
    const first = panelRef.current?.querySelector<HTMLElement>('a, button');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(true);
    };
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

  // keep keyboard focus inside the open menu (header row + panel)
  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !open) return;
    const items = [
      toggleRef.current,
      ...Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a, button') ?? []),
    ].filter(Boolean) as HTMLElement[];
    const firstEl = items[0];
    const lastEl = items[items.length - 1];
    if (e.shiftKey && document.activeElement === firstEl) {
      e.preventDefault();
      lastEl.focus();
    } else if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault();
      firstEl.focus();
    }
  };

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${open ? styles.isOpen : ''}`}
      onKeyDown={onPanelKeyDown}
    >
      <div className={`container ${styles.bar}`}>
        <a href="#top" className={styles.brand} aria-label="Arte Colore, torna all'inizio">
          <Wordmark />
        </a>

        <nav className={styles.desktopNav} aria-label="Principale">
          <ul role="list">
            {nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a className={`btn ${styles.call}`} href={business.phone.href}>
            <Icon name="phone" />
            <span>Chiamaci</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => (open ? close(false) : setOpen(true))}
          >
            <Icon name={open ? 'close' : 'menu'} />
            <span className="visually-hidden">{open ? 'Chiudi il menu' : 'Apri il menu'}</span>
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        ref={panelRef}
        className={styles.panel}
        hidden={!open}
      >
        <nav aria-label="Menu mobile" className="container">
          <ul role="list" className={styles.mobileList}>
            {nav.map((item, i) => (
              <li key={item.id} style={{ '--i': i } as React.CSSProperties}>
                <a href={`#${item.id}`} onClick={() => close(false)}>
                  <span className={styles.idx}>0{i + 1}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.panelFoot}>
            <a className="btn" href={business.phone.href}>
              <Icon name="phone" /> Chiama {business.phone.local}
            </a>
            <p>
              {business.address.street}, {business.address.city}
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}
