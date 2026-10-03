/**
 * Paint dripping from a card's colour over its paper label strip. Pure SVG,
 * deterministic per seed (identical on server and client). The drips grow
 * with scroll where scroll-driven animations are supported.
 */
function rand(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export function Drips({ seed = 1, count = 9 }: { seed?: number; count?: number }) {
  const r = rand(seed * 9301 + 49297);
  let d = 'M0 0H1000V3';
  const xs = Array.from({ length: count }, (_, i) => (i + 0.15 + r() * 0.7) * (1000 / count)).sort((a, b) => b - a);
  // walk right-to-left along the bottom edge, dropping a drip at each x
  let cursor = 1000;
  for (const x of xs) {
    const w = 5 + r() * 9;
    const len = 6 + r() * 20;
    const left = x - w / 2;
    const right = x + w / 2;
    d += `L${Math.min(cursor, right + 4).toFixed(1)} 3`;
    d += `Q${right.toFixed(1)} 3 ${right.toFixed(1)} ${(6).toFixed(1)}`;
    d += `L${right.toFixed(1)} ${(len - w / 2).toFixed(1)}`;
    d += `A${(w / 2).toFixed(1)} ${(w / 2).toFixed(1)} 0 0 1 ${left.toFixed(1)} ${(len - w / 2).toFixed(1)}`;
    d += `L${left.toFixed(1)} 6Q${left.toFixed(1)} 3 ${(left - 4).toFixed(1)} 3`;
    cursor = left - 4;
  }
  d += 'L0 3Z';
  return (
    <svg className="drips" viewBox="0 0 1000 30" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d={d} />
    </svg>
  );
}
