import { productResponseSchema } from '../schemas/productSchema';
import type { ErrorResponse, FieldError, ProductPayload, ProductResult } from '../types/api';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

// a bit longer than the server's own limit (~65s), so normally the server times out first
const TIMEOUT = 90_000;

export class RequestError extends Error {
  status: number;
  details?: FieldError[];

  constructor(message: string, status = 0, details?: FieldError[]) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const isErrorResponse = (body: unknown): body is ErrorResponse =>
  typeof (body as ErrorResponse)?.error?.message === 'string';

export async function generateProduct(payload: ProductPayload, signal?: AbortSignal): Promise<ProductResult> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT);
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort, { once: true });

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/products/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err) {
    if (timedOut) throw new RequestError('This is taking too long. Try again.');
    if (signal?.aborted) throw err; // we cancelled it ourselves
    throw new RequestError("Can't reach the server. Is the API running?");
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }

  const body: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    if (isErrorResponse(body)) throw new RequestError(body.error.message, res.status, body.error.details);
    throw new RequestError(`Server error (${res.status}). Try again.`, res.status);
  }

  const parsed = productResponseSchema.safeParse((body as { data?: unknown })?.data);
  if (!parsed.success) throw new RequestError('Got an unexpected response from the server.', res.status);
  return parsed.data;
}
