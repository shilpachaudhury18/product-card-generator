import type { TextareaHTMLAttributes } from 'react';
import { inputBase, inputBorder } from './Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export function Textarea({ invalid, className = '', rows = 4, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || undefined}
      className={`${inputBase} ${inputBorder(invalid)} resize-y py-2 leading-relaxed ${className}`}
      {...props}
    />
  );
}
