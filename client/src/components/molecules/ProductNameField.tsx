import { Input } from '../atoms/Input';
import { LIMITS } from '../../schemas/productSchema';
import { FormField } from './FormField';

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function ProductNameField({ value, onChange, error }: Props) {
  return (
    <FormField id="productName" label="Product name" required error={error}>
      {(field) => (
        <Input
          {...field}
          name="productName"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Wireless Headphones"
          maxLength={LIMITS.name}
          autoComplete="off"
          invalid={!!error}
        />
      )}
    </FormField>
  );
}
