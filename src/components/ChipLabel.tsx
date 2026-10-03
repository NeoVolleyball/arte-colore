import { Drips } from './Drips';

/** The paper label strip that finishes every colour card. */
export function ChipLabel({
  name,
  code,
  meta,
  className = '',
  seed,
}: {
  name: React.ReactNode;
  code?: string;
  meta?: React.ReactNode;
  className?: string;
  seed?: number;
}) {
  return (
    <div className={`chip-label ${className}`}>
      {seed !== undefined ? <Drips seed={seed} /> : null}
      <span className="chip-label__name">{name}</span>
      {meta ? <span className="chip-label__meta">{meta}</span> : <span />}
      {code ? <span className="chip-label__code">{code}</span> : null}
    </div>
  );
}
