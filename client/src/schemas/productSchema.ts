import { z } from 'zod';
import { CATEGORIES, TONES } from '../types/product';
import type { FormErrors, ProductForm } from '../types/product';

// same limits as server/src/schemas/productSchema.ts
export const LIMITS = { name: 100, features: 1000, audience: 150 };

const formSchema = z.object({
  productName: z
    .string()
    .trim()
    .min(1, 'Product name is required')
    .min(2, 'Product name is too short')
    .max(LIMITS.name, `Keep it under ${LIMITS.name} characters`),
  features: z
    .string()
    .trim()
    .min(1, 'Tell us a bit about the product')
    .min(10, 'Add a bit more detail (10+ characters)')
    .max(LIMITS.features, `Keep it under ${LIMITS.features} characters`),
  category: z.union([z.enum(CATEGORIES), z.literal('')]),
  targetAudience: z.string().trim().max(LIMITS.audience, `Keep it under ${LIMITS.audience} characters`),
  tone: z.enum(TONES),
  includeTagline: z.boolean(),
});

// don't blindly trust what comes back from the api either
export const productResponseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string().min(1)),
  tagline: z.string().optional(),
});

export function validateForm(values: ProductForm) {
  const result = formSchema.safeParse(values);
  if (result.success) return { data: result.data, errors: null };

  const errors: FormErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof ProductForm;
    errors[field] ??= issue.message;
  }
  return { data: null, errors };
}
