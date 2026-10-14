import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* Small layout primitives shared by every section, so spacing, tones and
 * type stay consistent. Tokens live in src/site/styles.css. */

type Tone = 'light' | 'stone' | 'dark';

const toneClass: Record<Tone, string> = {
  light: 'bg-bg text-ink',
  stone: 'bg-stone text-ink',
  dark: 'tone-dark bg-night text-on-night',
};

export interface SectionProps extends ComponentPropsWithoutRef<'section'> {
  tone?: Tone;
}

export function Section({ tone = 'light', className, ...props }: SectionProps) {
  return (
    <section
      className={cn(
        'relative py-20 md:py-28 lg:py-32',
        toneClass[tone],
        className,
      )}
      {...props}
    />
  );
}

export function Container({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[var(--container)] px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  );
}

export interface HeadingProps {
  id: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'center';
  /** Use the light-on-dark colour set. */
  onDark?: boolean;
  as?: 'h1' | 'h2';
  className?: string;
}

export function Heading({
  id,
  eyebrow,
  title,
  intro,
  align = 'left',
  onDark,
  as: Tag = 'h2',
  className,
}: HeadingProps) {
  return (
    <header
      className={cn(
        'mb-10 max-w-3xl md:mb-14',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            'mb-4 text-sm font-semibold tracking-[0.14em] uppercase',
            onDark ? 'text-accent-on-night' : 'text-accent',
          )}
        >
          {eyebrow}
        </p>
      )}
      <Tag id={id} className="text-h2 font-medium">
        {title}
      </Tag>
      {intro && (
        <p className={cn('mt-5 text-lead', onDark ? 'text-on-night-muted' : 'text-ink-muted')}>
          {intro}
        </p>
      )}
    </header>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'light';
type ButtonSize = 'md' | 'lg';

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white shadow-soft hover:bg-accent-strong',
  secondary: 'bg-surface text-ink ring-1 ring-line ring-inset hover:bg-stone',
  ghost: 'text-ink hover:bg-stone',
  light: 'bg-on-night text-night hover:bg-white',
};

const sizeClass: Record<ButtonSize, string> = {
  md: 'h-11 px-5 text-[0.9375rem]',
  lg: 'h-13 px-7 text-base',
};

export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md') {
  return cn(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap',
    'transition-[background-color,box-shadow,transform] duration-200 ease-brand active:scale-[0.98]',
    variantClass[variant],
    sizeClass[size],
  );
}

type ButtonProps<T extends ElementType> = {
  as?: T;
  variant?: ButtonVariant;
  size?: ButtonSize;
} & Omit<ComponentPropsWithoutRef<T>, 'as'>;

/** Renders an <a> when `href` is given, otherwise a <button>. */
export function Button<T extends ElementType = 'a'>({
  as,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps<T>) {
  const Tag: ElementType = as ?? ('href' in props ? 'a' : 'button');
  return <Tag className={cn(buttonClasses(variant, size), className)} {...props} />;
}
