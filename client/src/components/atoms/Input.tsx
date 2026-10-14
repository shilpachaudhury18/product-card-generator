import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

// shared with Textarea and Select so all fields look the same
export const inputBase =
  'block w-full rounded-lg border bg-white px-3 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100';

export const inputBorder = (invalid?: boolean) =>
  invalid
    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
    : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100';

export function Input({ invalid, className = '', type = 'text', ...props }: InputProps) {
  return (
    <input
      type={type}
      aria-invalid={invalid || undefined}
      className={`${inputBase} ${inputBorder(invalid)} h-10 ${className}`}
      {...props}
    />
  );
}
