import { withBase } from '../content/paths';
import styles from './PhotoSlot.module.css';

/**
 * A photo, or a clearly marked placeholder while the real photo is missing.
 * The frame keeps its aspect ratio either way, so swapping in the photo
 * never moves the layout.
 */
export function PhotoSlot({
  src,
  alt,
  ratio = '4 / 3',
  pattern = 'plain',
  className = '',
}: {
  src?: string;
  alt: string;
  ratio?: string;
  pattern?: 'plain' | 'planks' | 'wallpaper' | 'tin';
  className?: string;
}) {
  return (
    <div className={`${styles.frame} ${className}`} style={{ aspectRatio: ratio }}>
      {src ? (
        <img src={withBase(src)} alt={alt} width={1200} height={900} loading="lazy" decoding="async" />
      ) : (
        <div className={`${styles.placeholder} ${styles[pattern]}`}>
          <span className={styles.tag}>Foto in arrivo</span>
        </div>
      )}
    </div>
  );
}
