export const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Toys & Games',
  'Books',
  'Health & Wellness',
  'Food & Beverage',
  'Office Supplies',
  'Other',
] as const;

export const TONES = ['Professional', 'Friendly', 'Premium', 'Persuasive'] as const;

export type Category = (typeof CATEGORIES)[number];
export type Tone = (typeof TONES)[number];

// empty string = not filled in
export interface ProductForm {
  productName: string;
  features: string;
  category: Category | '';
  targetAudience: string;
  tone: Tone;
  includeTagline: boolean;
}

export type FormErrors = Partial<Record<keyof ProductForm, string>>;

export interface ProductCard {
  id: string;
  title: string;
  description: string;
  tags: string[];
  tagline?: string;
  category?: Category;
  tone: Tone;
  createdAt: string;
  // the form values that produced this card, so it can be regenerated on its own later
  input: ProductForm;
}
