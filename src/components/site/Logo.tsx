import logoUrl from '@/assets/logo.svg';
import { cn } from '@/lib/utils';

/** Colour logo (mark + "arte-colore" wordmark). A monochrome version for
 *  print or dark backgrounds is in src/assets/logo-mono.svg (uses currentColor). */
export function Logo({ className, alt = '' }: { className?: string; alt?: string }) {
  return <img src={logoUrl} width={277} height={48} alt={alt} className={cn('h-10 w-auto', className)} />;
}
