import { site } from '@/data/site';
import { cn } from '@/lib/utils';

/** Temporary text wordmark; replaced by the SVG logo in step 5. */
export function Logo({ className }: { className?: string; mono?: boolean }) {
  return (
    <span className={cn('flex items-center font-display text-2xl font-semibold', className)}>
      {site.brand}
    </span>
  );
}
