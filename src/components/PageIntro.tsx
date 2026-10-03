import { Drips } from './Drips';
import styles from './PageIntro.module.css';

/** Opening colour card for inner pages. */
export function PageIntro({
  tone,
  kicker,
  title,
  children,
  label,
  aside,
}: {
  tone: 'sage' | 'ochre' | 'terra';
  kicker: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  label: { name: string; meta?: string; code: string };
  aside?: React.ReactNode;
}) {
  return (
    <section className={`card tone-${tone} ${styles.intro}`} aria-labelledby="page-title">
      <div className={styles.grid}>
        <div className={styles.inner}>
          <p className={`kicker ${styles.kicker}`}>{kicker}</p>
          <h1 id="page-title" className={styles.title}>
            {title}
          </h1>
          {children ? <div className={styles.body}>{children}</div> : null}
        </div>
        {aside ? <div className={styles.aside}>{aside}</div> : null}
      </div>
      <div className="chip-label">
        <Drips seed={label.code.length + label.name.length} count={10} />
        <span className="chip-label__name">{label.name}</span>
        <span className="chip-label__meta">{label.meta}</span>
        <span className="chip-label__code">{label.code}</span>
      </div>
    </section>
  );
}
