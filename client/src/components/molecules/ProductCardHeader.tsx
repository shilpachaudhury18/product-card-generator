import { Badge } from '../atoms/Badge';
import { Typography } from '../atoms/Typography';
import type { Category, Tone } from '../../types/product';
import { categoryGradient } from '../../utils/colors';
import { initials } from '../../utils/formatters';

interface Props {
  title: string;
  tagline?: string;
  category?: Category;
  tone: Tone;
}

export function ProductCardHeader({ title, tagline, category, tone }: Props) {
  return (
    <header className="space-y-4">
      <div
        aria-hidden="true"
        className={`flex h-28 items-center justify-center rounded-xl bg-linear-to-br ${categoryGradient(category)}`}
      >
        <span className="text-3xl font-bold tracking-wide text-white/90 drop-shadow-sm">{initials(title)}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {category && <Badge>{category}</Badge>}
        <Badge>{tone}</Badge>
      </div>

      <div className="space-y-1">
        <Typography variant="subheading">{title}</Typography>
        {tagline && <p className="text-sm font-medium italic text-brand-700">{tagline}</p>}
      </div>
    </header>
  );
}
