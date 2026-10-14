import { Header } from '../components/organisms/Header';
import { ProductGeneratorForm } from '../components/organisms/ProductGeneratorForm';
import { GeneratedContentSection } from '../components/organisms/GeneratedContentSection';
import { ProductGeneratorLayout } from '../components/templates/ProductGeneratorLayout';
import { useProductGenerator } from '../hooks/useProductGenerator';

export function ProductGeneratorPage() {
  const generator = useProductGenerator();

  return (
    <ProductGeneratorLayout
      header={<Header />}
      form={
        <ProductGeneratorForm
          form={generator.form}
          errors={generator.errors}
          loading={generator.loading}
          onChange={generator.updateField}
          onSubmit={generator.submit}
          onReset={generator.resetForm}
        />
      }
      results={
        <GeneratedContentSection
          cards={generator.cards}
          loading={generator.loading}
          regeneratingId={generator.regeneratingId}
          error={generator.error}
          cardErrors={generator.cardErrors}
          onRetry={generator.submit}
          onDismissError={generator.dismissError}
          onRegenerate={generator.regenerate}
          onRemove={generator.removeCard}
          onClear={generator.clearCards}
        />
      }
    />
  );
}
