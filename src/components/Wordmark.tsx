import styles from './Wordmark.module.css';

/**
 * Typographic wordmark created for the new website: NOT an existing official
 * logo of the shop (see CONTENT-CHECKLIST.md). A tiny fanned colour deck +
 * "Arte Colore" in Instrument Serif.
 */
export function Wordmark({ size = 'md' }: { size?: 'md' | 'xl' }) {
  return (
    <span className={`${styles.mark} ${size === 'xl' ? styles.xl : ''}`}>
      <span className={styles.fan} aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className={styles.text}>
        Arte <em>Colore</em>
      </span>
    </span>
  );
}
