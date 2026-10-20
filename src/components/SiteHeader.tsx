import { useCallback, useEffect, useRef, useState } from 'react';
import { business, maps, nav } from '../content/business';
import { Icon } from './Icon';
import { Wordmark } from './Wordmark';
import styles from './SiteHeader.module.css';
import { withBase } from '../content/paths';
import { useActiveSection } from './useActiveSection';

const chipColours = ['var(--ochre)', 'var(--terracotta)', 'var(--sage)', 'var(--ivory)', '#c9d6b8', '#f2c3a9'];
/** Width where the full menu fits in the bar; below it the burger menu is used. */
const DESKTOP_MQ = '(min-width: 1100px)';
const sectionIds = nav.map((item) => item.href.slice(1));

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const { active, goTo } = useActiveSection(sectionIds);

  // one shared pill slides under the active desktop item
  useEffect(() => {
    const navEl = navRef.current;
    const pill = pillRef.current;
    if (!navEl || !pill) return;
    const place = () => {
      const link = active ? navEl.querySelector<HTMLElement>(`a[href="#${active}"]`) : null;
      if (!link) {
        pill.style.opacity = '0';
        return;
      }
      const appearing = pill.style.opacity !== '1';
      if (appearing) pill.style.transition = 'none'; // first show: appear in place, don't slide in
      const navBox = navEl.getBoundingClientRect();
      const box = link.getBoundingClientRect();
      pill.style.width = `${box.width}px`;
      pill.style.transform = `translateX(${box.left - navBox.left}px)`;
      pill.style.opacity = '1';
      if (appearing) {
        void pill.offsetWidth;
        pill.style.transition = '';
      }
    };
    place();
    // fonts loading or resizing change item widths
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(place);
    ro?.observe(navEl);
    return () => ro?.disconnect();
  }, [active]);

  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    goTo(id);
    setOpen(false);
    history.pushState(null, '', href);
    // after the menu closes (and the page unlocks), scroll; scroll-padding-top keeps the title clear of the header
    requestAnimationFrame(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!open) return;
    // preventScroll: focusing inside the sticky header would otherwise nudge the page by scroll-padding-top
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close(true);
    const mq = window.matchMedia(DESKTOP_MQ);
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
        <a href={withBase('/')} className={styles.brand} aria-label="Arte Colore, torna all’inizio">
          <Wordmark />
        </a>

        <nav ref={navRef} className={styles.desktopNav} aria-label="Principale">
          <span ref={pillRef} className={styles.pill} aria-hidden="true" />
          <ul role="list">
            {nav.map((item) => {
              const current = active === item.href.slice(1);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={[item.highlight && styles.hot, current && styles.current].filter(Boolean).join(' ') || undefined}
                    aria-current={current ? 'location' : undefined}
                    onClick={(e) => onNavClick(e, item.href)}
                  >
                    {item.highlight ? <Icon name="tag" /> : null}
                    {item.label}
                  </a>
                </li>
              );
            })}
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
                  href={item.href}
                  className={active === item.href.slice(1) ? styles.current : undefined}
                  aria-current={active === item.href.slice(1) ? 'location' : undefined}
                  onClick={(e) => onNavClick(e, item.href)}
                >
                  <span className={styles.chip} aria-hidden="true" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.panelFoot}>
            <a className="btn btn--ivory" href={business.phone.href}>
              <Icon name="phone" /> Chiamaci: {business.phone.local}
            </a>
            <a className="btn btn--outline" href={maps.directionsUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="route" /> Come arrivare
              <span className="visually-hidden">(Google Maps, si apre in una nuova scheda)</span>
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
