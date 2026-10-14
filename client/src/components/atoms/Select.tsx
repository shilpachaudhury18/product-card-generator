import type { SelectHTMLAttributes } from 'react';
import { inputBase, inputBorder } from './Input';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: readonly string[];
  placeholder?: string;
  invalid?: boolean;
}

export function Select({ options, placeholder, invalid, className = '', ...props }: SelectProps) {
  return (
    <select
      aria-invalid={invalid || undefined}
      className={`${inputBase} ${inputBorder(invalid)} h-10 pr-8 ${className}`}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
