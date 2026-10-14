import type { ElementType, HTMLAttributes } from 'react';

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: keyof typeof styles;
  as?: ElementType;
}

const styles = {
  title: { tag: 'h1', className: 'text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl' },
  heading: { tag: 'h2', className: 'text-lg font-semibold text-slate-900' },
  subheading: { tag: 'h3', className: 'text-base font-semibold leading-snug text-slate-900' },
  body: { tag: 'p', className: 'text-sm leading-relaxed text-slate-700' },
  muted: { tag: 'p', className: 'text-sm text-slate-500' },
} as const;

export function Typography({ variant = 'body', as, className = '', children, ...props }: TypographyProps) {
  const { tag, className: base } = styles[variant];
  const Tag = as ?? tag;
  return (
    <Tag className={`${base} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
