import type { ErrorRequestHandler, RequestHandler } from 'express';
import { HttpError } from '../utils/HttpError.js';

export const notFound: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`));
};

// express.json() throws these when the body is too big or isn't valid json
function fromBodyParser(err: { type?: string }) {
  if (err.type === 'entity.too.large') return new HttpError(413, 'BAD_REQUEST', 'Request body is too large');
  if (err.type === 'entity.parse.failed') return new HttpError(400, 'BAD_REQUEST', 'Request body must be valid JSON');
}

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const error =
    err instanceof HttpError
      ? err
      : (fromBodyParser(err) ?? new HttpError(500, 'SERVER_ERROR', 'Something went wrong on our side.', { cause: err }));

  // full details stay in the server logs, the client only gets the safe message
  if (process.env.NODE_ENV !== 'test') {
    const cause = error.cause instanceof Error ? error.cause.message : error.cause;
    console.error(`${error.status} ${error.code} - ${req.method} ${req.originalUrl}`, cause ?? '');
    if (error.status === 500 && err instanceof Error) console.error(err.stack);
  }

  if (res.headersSent) return;

  res.status(error.status).json({
    success: false,
    error: { code: error.code, message: error.message, ...(error.details && { details: error.details }) },
  });
};
