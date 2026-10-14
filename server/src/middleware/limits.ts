import type { RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import { HttpError } from '../utils/HttpError.js';

export const rateLimiter = (max: number) =>
  rateLimit({
    windowMs: 60_000,
    limit: max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (_req, _res, next) =>
      next(new HttpError(429, 'RATE_LIMITED', "You're generating too fast. Wait a minute and try again.")),
  });

// safety net in case something upstream hangs past its own timeouts
export const timeout =
  (ms: number): RequestHandler =>
  (_req, res, next) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) next(new HttpError(504, 'TIMEOUT', 'The request took too long. Try again.'));
    }, ms);
    res.on('close', () => clearTimeout(timer));
    next();
  };
