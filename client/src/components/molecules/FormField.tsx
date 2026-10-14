import type { ReactNode } from 'react';
import { Label } from '../atoms/Label';

// the props a field's input needs so the label, hint and error are all wired up for screen readers
export interface FieldProps {
  id: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
}

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  counter?: ReactNode;
  children: (field: FieldProps) => ReactNode;
}

export function FormField({ id, label, required, optional, hint, error, counter, children }: FormFieldProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  // the error replaces the hint, so only point at whichever one is actually on screen
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} required={required} optional={optional}>
        {label}
      </Label>

      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
        'aria-required': required || undefined,
      })}

      {(error || hint || counter) && (
        <div className="flex items-start justify-between gap-3 text-xs">
          {error ? (
            <p id={errorId} className="font-medium text-red-600">
              {error}
            </p>
          ) : (
            <p id={hintId} className="text-slate-500">
              {hint}
            </p>
          )}
          {counter}
        </div>
      )}
    </div>
  );
}
