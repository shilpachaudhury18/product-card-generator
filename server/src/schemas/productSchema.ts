import { z } from 'zod';

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

// keep these in sync with client/src/schemas/productSchema.ts
export const LIMITS = { name: 100, features: 1000, audience: 150 };

export const AI_LIMITS = { title: 120, description: 700, minTags: 3, maxTags: 8, tag: 40, tagline: 100 };

export const productInput = z
  .object({
    productName: z
      .string({ error: 'Product name is required' })
      .trim()
      .min(2, 'Product name is too short')
      .max(LIMITS.name, `Product name can't be longer than ${LIMITS.name} characters`),
    features: z
      .string({ error: 'Add a description or a few key features' })
      .trim()
      .min(10, 'Add a bit more detail about the product (10+ characters)')
      .max(LIMITS.features, `Features can't be longer than ${LIMITS.features} characters`),
    category: z
      .enum(CATEGORIES, { error: 'Unknown category' })
      .optional()
      .or(z.literal('').transform(() => undefined)),
    targetAudience: z
      .string()
      .trim()
      .max(LIMITS.audience, `Target audience can't be longer than ${LIMITS.audience} characters`)
      .optional()
      .transform((value) => value || undefined),
    tone: z.enum(TONES, { error: `Tone has to be one of: ${TONES.join(', ')}` }).default('Professional'),
    includeTagline: z.boolean().default(true),
  })
  .strict();

export type ProductInput = z.infer<typeof productInput>;

// what we accept back from gemini
export const productContent = z.object({
  title: z.string().trim().min(3).max(AI_LIMITS.title),
  description: z.string().trim().min(20).max(AI_LIMITS.description),
  tags: z
    .array(z.string().trim().min(1).max(AI_LIMITS.tag))
    .min(AI_LIMITS.minTags)
    .max(AI_LIMITS.maxTags)
    .transform((tags) => tags.filter((tag, i) => tags.findIndex((t) => t.toLowerCase() === tag.toLowerCase()) === i)),
  tagline: z
    .string()
    .trim()
    .max(AI_LIMITS.tagline)
    .optional()
    .transform((value) => value || undefined),
});

export type ProductContent = z.infer<typeof productContent>;

// passed to gemini as responseJsonSchema so it replies in this exact shape
export const responseSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' }, minItems: AI_LIMITS.minTags, maxItems: AI_LIMITS.maxTags },
    tagline: { type: 'string' },
  },
  required: ['title', 'description', 'tags', 'tagline'],
};
