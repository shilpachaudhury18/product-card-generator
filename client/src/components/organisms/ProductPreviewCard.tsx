import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Icon } from '../atoms/Icon';
import { Typography } from '../atoms/Typography';
import { ErrorMessage } from '../molecules/ErrorMessage';
import { ProductCardHeader } from '../molecules/ProductCardHeader';
import { TagList } from '../molecules/TagList';
import { useClipboard } from '../../hooks/useClipboard';
import type { ProductCard } from '../../types/product';
import { cardToText } from '../../utils/formatters';

interface Props {
  card: ProductCard;
  regenerating?: boolean;
  error?: string;
  disabled?: boolean;
  onRegenerate: (id: string) => void;
  onRemove: (id: string) => void;
}

const copyText = { idle: 'Copy', copied: 'Copied!', failed: 'Copy failed' };

export function ProductPreviewCard({ card, regenerating, error, disabled, onRegenerate, onRemove }: Props) {
  const { status, copy } = useClipboard();

  return (
    <Card
      as="article"
      aria-label={card.title}
      aria-busy={regenerating || undefined}
      className={`relative flex h-full flex-col transition-opacity ${regenerating ? 'opacity-60' : ''}`}
    >
      <button
        type="button"
        onClick={() => onRemove(card.id)}
        disabled={regenerating}
        aria-label={`Remove ${card.title}`}
        title="Remove"
        className="absolute top-7 right-7 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-white/85 text-slate-600 shadow-sm transition-colors hover:bg-white hover:text-red-600 focus-visible:outline-2 focus-visible:outline-brand-600 disabled:opacity-50 sm:top-8 sm:right-8"
      >
        <Icon name="trash" size={16} />
      </button>

      <ProductCardHeader title={card.title} tagline={card.tagline} category={card.category} tone={card.tone} />

      <Typography className="mt-3">{card.description}</Typography>

      <TagList tags={card.tags} label={`Tags for ${card.title}`} className="mt-4 mb-5" />

      {error && (
        <div className="mb-5">
          <ErrorMessage title="Couldn't regenerate" message={error} />
        </div>
      )}

      <div className="mt-auto flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => copy(cardToText(card))}
          icon={<Icon name={status === 'copied' ? 'check' : 'copy'} size={16} />}
          aria-label={`Copy ${card.title}`}
        >
          {copyText[status]}
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onRegenerate(card.id)}
          loading={regenerating}
          disabled={disabled}
          icon={<Icon name="refresh" size={16} />}
          aria-label={`Regenerate ${card.title}`}
        >
          {regenerating ? 'Regenerating...' : 'Regenerate'}
        </Button>

      </div>

      <span className="sr-only" aria-live="polite">
        {status === 'copied' && 'Copied to clipboard'}
        {status === 'failed' && "Couldn't copy to clipboard"}
      </span>
    </Card>
  );
}
