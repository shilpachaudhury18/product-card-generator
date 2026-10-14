import { Textarea } from '../atoms/Textarea';
import { LIMITS } from '../../schemas/productSchema';
import { FormField } from './FormField';

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function ProductDescriptionField({ value, onChange, error }: Props) {
  return (
    <FormField
      id="features"
      label="Description or key features"
      required
      error={error}
      hint="Stick to real features - the AI won't add specs you didn't mention."
      counter={
        <span className="shrink-0 tabular-nums text-slate-500">
          {value.length}/{LIMITS.features}
        </span>
      }
    >
      {(field) => (
        <Textarea
          {...field}
          name="features"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Noise cancellation, Bluetooth, 30 hour battery"
          rows={5}
          maxLength={LIMITS.features}
          invalid={!!error}
        />
      )}
    </FormField>
  );
}
