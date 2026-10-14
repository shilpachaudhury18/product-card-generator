import { useEffect, useRef, useState } from 'react';
import { validateForm } from '../schemas/productSchema';
import { RequestError, generateProduct } from '../services/productGeneratorService';
import type { ProductResult } from '../types/api';
import type { FormErrors, ProductCard, ProductForm } from '../types/product';
import { newId, toPayload } from '../utils/formatters';

export const emptyForm: ProductForm = {
  productName: '',
  features: '',
  category: '',
  targetAudience: '',
  tone: 'Professional',
  includeTagline: true,
};

const errorMessage = (err: unknown) =>
  err instanceof RequestError ? err.message : 'Something went wrong. Try again.';

const isCancelled = (err: unknown) => err instanceof DOMException && err.name === 'AbortError';

// server-side validation errors that match a form field get shown next to that field
function fieldErrors(err: unknown): FormErrors {
  const errors: FormErrors = {};
  if (!(err instanceof RequestError)) return errors;
  for (const { field, message } of err.details ?? []) {
    if (field in emptyForm) errors[field as keyof ProductForm] ??= message;
  }
  return errors;
}

function toCard(id: string, result: ProductResult, input: ProductForm): ProductCard {
  return {
    id,
    ...result,
    tagline: result.tagline || undefined,
    category: input.category || undefined,
    tone: input.tone,
    createdAt: new Date().toISOString(),
    input,
  };
}

function without<T>(record: Record<string, T>, key: string) {
  const { [key]: _removed, ...rest } = record;
  return rest;
}

export function useProductGenerator() {
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [cards, setCards] = useState<ProductCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  // state updates aren't instant, so a fast double click could slip past `loading` - the ref can't
  const busy = useRef(false);
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => request.current?.abort(), []);

  function start() {
    busy.current = true;
    request.current = new AbortController();
    return request.current.signal;
  }

  function done() {
    busy.current = false;
    request.current = null;
  }

  function updateField<K extends keyof ProductForm>(field: K, value: ProductForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? without(prev, field) : prev));
  }

  async function submit() {
    if (busy.current) return;

    const { data, errors: formErrors } = validateForm(form);
    if (!data) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setError(null);
    setLoading(true);
    const signal = start();

    try {
      const result = await generateProduct(toPayload(data), signal);
      setCards((prev) => [toCard(newId(), result, data), ...prev]);
    } catch (err) {
      if (isCancelled(err)) return;
      setErrors(fieldErrors(err));
      setError(errorMessage(err));
    } finally {
      done();
      setLoading(false);
    }
  }

  async function regenerate(id: string) {
    const card = cards.find((c) => c.id === id);
    if (busy.current || !card) return;

    setRegeneratingId(id);
    setCardErrors((prev) => without(prev, id));
    const signal = start();

    try {
      const result = await generateProduct(toPayload(card.input), signal);
      // swap the content in place, keep the same id and position
      setCards((prev) => prev.map((c) => (c.id === id ? toCard(id, result, c.input) : c)));
    } catch (err) {
      if (isCancelled(err)) return;
      setCardErrors((prev) => ({ ...prev, [id]: errorMessage(err) }));
    } finally {
      done();
      setRegeneratingId(null);
    }
  }

  function removeCard(id: string) {
    setCards((prev) => prev.filter((c) => c.id !== id));
    setCardErrors((prev) => without(prev, id));
  }

  function clearCards() {
    setCards([]);
    setCardErrors({});
    setError(null);
  }

  function resetForm() {
    setForm(emptyForm);
    setErrors({});
    setError(null);
  }

  return {
    form,
    errors,
    cards,
    loading,
    regeneratingId,
    error,
    cardErrors,
    updateField,
    submit,
    regenerate,
    removeCard,
    clearCards,
    resetForm,
    dismissError: () => setError(null),
  };
}
