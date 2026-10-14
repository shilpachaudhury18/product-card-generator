import { Select } from '../atoms/Select';
import { CATEGORIES } from '../../types/product';
import type { Category } from '../../types/product';
import { FormField } from './FormField';

interface Props {
  value: Category | '';
  onChange: (value: Category | '') => void;
  error?: string;
}

export function CategorySelector({ value, onChange, error }: Props) {
  return (
    <FormField id="category" label="Category" optional error={error}>
      {(field) => (
        <Select
          {...field}
          name="category"
          value={value}
          onChange={(e) => onChange(e.target.value as Category | '')}
          options={CATEGORIES}
          placeholder="Pick a category"
          invalid={!!error}
        />
      )}
    </FormField>
  );
}
