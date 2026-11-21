import { withBase } from '../content/paths';
import styles from './Logo.module.css';

/** The official Arte Colore logo (supplied by the owner, Nov 2026). Files: public/images/logo/. */
export const LOGO_ASPECT = 1019 / 685;

export function Logo({ size = 'md' }: { size?: 'md' | 'xl' }) {
  const h = size === 'xl' ? 322 : 54;
  return (
    <span className={`${styles.logo} ${size === 'xl' ? styles.xl : ''}`}>
      <img
        src={withBase('/images/logo/arte-colore-logo-480.webp')}
        srcSet={`${withBase('/images/logo/arte-colore-logo-480.webp')} 480w, ${withBase('/images/logo/arte-colore-logo-960.webp')} 960w`}
        sizes={size === 'xl' ? '(min-width: 600px) 480px, 80vw' : '82px'}
        alt=""
        width={Math.round(h * LOGO_ASPECT)}
        height={h}
        decoding="async"
      />
    </span>
  );
}
