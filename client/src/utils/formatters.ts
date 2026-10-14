import type { ProductPayload } from '../types/api';
import type { ProductCard, ProductForm } from '../types/product';

export function toPayload(form: ProductForm): ProductPayload {
  const payload: ProductPayload = {
    productName: form.productName.trim(),
    features: form.features.trim(),
    tone: form.tone,
    includeTagline: form.includeTagline,
  };
  if (form.category) payload.category = form.category;
  if (form.targetAudience.trim()) payload.targetAudience = form.targetAudience.trim();
  return payload;
}

export function cardToText(card: Pick<ProductCard, 'title' | 'description' | 'tags' | 'tagline'>) {
  const lines = [card.title];
  if (card.tagline) lines.push(card.tagline);
  lines.push('', card.description);
  if (card.tags.length) lines.push('', `Tags: ${card.tags.join(', ')}`);
  return lines.join('\n');
}

export const newId = () => crypto.randomUUID();

export function initials(text: string) {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}
