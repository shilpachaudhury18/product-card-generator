import type { ProductCard } from '../../types/product';
import { ProductPreviewCard } from './ProductPreviewCard';

interface Props {
  cards: ProductCard[];
  regeneratingId: string | null;
  cardErrors: Record<string, string>;
  busy: boolean;
  onRegenerate: (id: string) => void;
  onRemove: (id: string) => void;
}

export function ProductCardGrid({ cards, regeneratingId, cardErrors, busy, onRegenerate, onRemove }: Props) {
  return (
    <ul aria-label="Generated cards" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {cards.map((card) => (
        <li key={card.id}>
          <ProductPreviewCard
            card={card}
            regenerating={regeneratingId === card.id}
            error={cardErrors[card.id]}
            disabled={busy}
            onRegenerate={onRegenerate}
            onRemove={onRemove}
          />
        </li>
      ))}
    </ul>
  );
}
