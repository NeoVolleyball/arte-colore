/** The paper label strip that finishes every colour card. */
export function ChipLabel({
  name,
  code,
  meta,
  className = '',
}: {
  name: React.ReactNode;
  code?: string;
  meta?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`chip-label ${className}`}>
      <span className="chip-label__name">{name}</span>
      {meta ? <span className="chip-label__meta">{meta}</span> : <span />}
      {code ? <span className="chip-label__code">{code}</span> : null}
    </div>
  );
}
