import { useCallback, useEffect, useRef, useState } from 'react';

/** Extra room below a section that still counts as "inside" it, so the
 *  highlight doesn't drop out in the gap between two cards. */
const GAP = 80;

/**
 * Id of the menu section currently on screen, or null (hero, or a section
 * that isn't in the menu). A section is current when a probe line ~a third
 * down the viewport falls inside it.
 *
 * `goTo(id)` marks a section current right away and ignores scroll updates
 * until the smooth scroll settles, so the pill goes straight to the target.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const locked = useRef(false);
  const cancelLock = useRef<(() => void) | null>(null);
  const key = ids.join(',');

  useEffect(() => {
    const list = key.split(',');
    let frame = 0;

    const measure = () => {
      frame = 0;
      if (locked.current) return;
      const doc = document.documentElement;
      const header = parseFloat(getComputedStyle(doc).getPropertyValue('--header-h')) || 72;
      const probe = header + (window.innerHeight - header) * 0.3;
      const atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 4;
      let current: string | null = null;
      for (const [i, id] of list.entries()) {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        if (!rect) continue;
        if (i === list.length - 1) {
          // last section: only the footer follows it, so it stays current to the end
          // (and counts as soon as the page bottoms out, even if it never reaches the probe)
          if (rect.top <= probe || (atBottom && rect.top < window.innerHeight)) current = id;
        } else if (rect.top <= probe && rect.bottom + GAP > probe) {
          current = id;
        }
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [key]);

  const goTo = useCallback((id: string) => {
    setActive(id);
    cancelLock.current?.(); // a quick second click replaces the first
    locked.current = true;
    let timer = 0;
    const stop = () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', wait);
      cancelLock.current = null;
    };
    const unlock = () => {
      stop();
      locked.current = false;
      window.dispatchEvent(new Event('scroll')); // re-measure where we landed
    };
    cancelLock.current = stop;
    // unlock once scrolling has been idle for a moment. Not `scrollend`: a stray
    // one from a tiny scroll just before the click would unlock too early.
    const wait = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(unlock, 250);
    };
    window.addEventListener('scroll', wait, { passive: true });
    timer = window.setTimeout(unlock, 600); // no scroll started at all
  }, []);

  return { active, goTo };
}
