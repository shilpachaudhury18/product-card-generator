import type { FormEvent } from 'react';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Icon } from '../atoms/Icon';
import { Input } from '../atoms/Input';
import { Typography } from '../atoms/Typography';
import { CategorySelector } from '../molecules/CategorySelector';
import { FormField } from '../molecules/FormField';
import { GenerateButton } from '../molecules/GenerateButton';
import { ProductDescriptionField } from '../molecules/ProductDescriptionField';
import { ProductNameField } from '../molecules/ProductNameField';
import { ToneSelector } from '../molecules/ToneSelector';
import { LIMITS } from '../../schemas/productSchema';
import type { FormErrors, ProductForm } from '../../types/product';

interface Props {
  form: ProductForm;
  errors: FormErrors;
  loading: boolean;
  onChange: <K extends keyof ProductForm>(field: K, value: ProductForm[K]) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export function ProductGeneratorForm({ form, errors, loading, onChange, onSubmit, onReset }: Props) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <Card as="section" aria-labelledby="form-title">
      <div className="mb-5">
        <Typography variant="heading" id="form-title">
          Product details
        </Typography>
        <Typography variant="muted" className="text-xs">
          * required
        </Typography>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <ProductNameField
          value={form.productName}
          onChange={(value) => onChange('productName', value)}
          error={errors.productName}
        />

        <ProductDescriptionField
          value={form.features}
          onChange={(value) => onChange('features', value)}
          error={errors.features}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <CategorySelector
            value={form.category}
            onChange={(value) => onChange('category', value)}
            error={errors.category}
          />

          <FormField id="targetAudience" label="Target audience" optional error={errors.targetAudience}>
            {(field) => (
              <Input
                {...field}
                name="targetAudience"
                value={form.targetAudience}
                onChange={(e) => onChange('targetAudience', e.target.value)}
                placeholder="e.g. Commuters"
                maxLength={LIMITS.audience}
                invalid={!!errors.targetAudience}
              />
            )}
          </FormField>
        </div>

        <ToneSelector value={form.tone} onChange={(value) => onChange('tone', value)} />

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.includeTagline}
            onChange={(e) => onChange('includeTagline', e.target.checked)}
            className="h-4 w-4 accent-brand-600"
          />
          Add a short tagline
        </label>

        <div className="flex flex-col gap-3 pt-1 sm:flex-row-reverse">
          <GenerateButton loading={loading} />
          <Button variant="secondary" size="lg" onClick={onReset} disabled={loading} icon={<Icon name="trash" />}>
            Clear form
          </Button>
        </div>
      </form>
    </Card>
  );
}
