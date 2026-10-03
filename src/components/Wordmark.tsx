import styles from './Wordmark.module.css';

/**
 * Restrained typographic wordmark created for the new website.
 * It is NOT an existing official logo of the shop (see CONTENT-CHECKLIST.md).
 */
export function Wordmark({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <span className={`${styles.mark} ${size === 'lg' ? styles.lg : ''}`}>
      <span className={styles.chips} aria-hidden="true">
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
