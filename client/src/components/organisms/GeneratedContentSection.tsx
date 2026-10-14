import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Typography } from '../atoms/Typography';
import { ErrorMessage } from '../molecules/ErrorMessage';
import { LoadingIndicator } from '../molecules/LoadingIndicator';
import type { ProductCard } from '../../types/product';
import { EmptyResultsSection } from './EmptyResultsSection';
import { ProductCardGrid } from './ProductCardGrid';

interface Props {
  cards: ProductCard[];
  loading: boolean;
  regeneratingId: string | null;
  error: string | null;
  cardErrors: Record<string, string>;
  onRetry: () => void;
  onDismissError: () => void;
  onRegenerate: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function GeneratedContentSection({
  cards,
  loading,
  regeneratingId,
  error,
  cardErrors,
  onRetry,
  onDismissError,
  onRegenerate,
  onRemove,
  onClear,
}: Props) {
  const busy = loading || regeneratingId !== null;

  return (
    <section aria-labelledby="results-title" className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Typography variant="heading" id="results-title">
            Generated cards
          </Typography>
          <Typography variant="muted" className="text-xs">
            {cards.length ? `${cards.length} ${cards.length === 1 ? 'card' : 'cards'}, newest first` : 'Results show up here'}
          </Typography>
        </div>

        {cards.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear} disabled={busy} icon={<Icon name="trash" size={16} />}>
            Clear all
          </Button>
        )}
      </div>

      {loading && <LoadingIndicator />}
      {error && <ErrorMessage title="Couldn't generate" message={error} onRetry={onRetry} onDismiss={onDismissError} />}

      {cards.length > 0 ? (
        <ProductCardGrid
          cards={cards}
          regeneratingId={regeneratingId}
          cardErrors={cardErrors}
          busy={busy}
          onRegenerate={onRegenerate}
          onRemove={onRemove}
        />
      ) : (
        !loading && <EmptyResultsSection />
      )}
    </section>
  );
}
