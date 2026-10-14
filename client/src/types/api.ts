import type { Category, Tone } from './product';

export interface ProductPayload {
  productName: string;
  features: string;
  category?: Category;
  targetAudience?: string;
  tone: Tone;
  includeTagline: boolean;
}

export interface ProductResult {
  title: string;
  description: string;
  tags: string[];
  tagline?: string;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: { code: string; message: string; details?: FieldError[] };
}
