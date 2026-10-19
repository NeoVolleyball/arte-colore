import { business } from '../content/business';
import { Icon } from './Icon';
import styles from './LabourBadge.module.css';

/** Small highlighted line: the shop also provides painting / wallpapering labour. */
export function LabourBadge({ light = false }: { light?: boolean }) {
  return (
    <p className={`${styles.badge} ${light ? styles.light : ''}`}>
      <Icon name="brush" />
      {business.labour}
    </p>
  );
}
