/**
 * Prefix site-absolute paths with the deploy base (e.g. "/arte-colore/" on
 * GitHub Pages, "/" elsewhere). Works on single paths and on srcset lists.
 */
const BASE: string = (import.meta.env?.BASE_URL as string | undefined) ?? '/';

export function withBase(value: string): string {
  if (BASE === '/') return value;
  return value.replace(/(^|,\s*)\/(?!\/)/g, `$1${BASE}`);
}
