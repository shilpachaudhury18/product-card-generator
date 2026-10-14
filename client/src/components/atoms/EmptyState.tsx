import type { ReactNode } from 'react';
import { Typography } from './Typography';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 px-6 py-12 text-center">
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600" aria-hidden="true">
          {icon}
        </div>
      )}
      <Typography variant="subheading" as="p">
        {title}
      </Typography>
      {description && (
        <Typography variant="muted" className="mt-1 max-w-sm">
          {description}
        </Typography>
      )}
    </div>
  );
}
