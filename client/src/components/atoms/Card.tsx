import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article';
}

export function Card({ as: Tag = 'div', className = '', children, ...props }: CardProps) {
  return (
    <Tag className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`} {...props}>
      {children}
    </Tag>
  );
}
