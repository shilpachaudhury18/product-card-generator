import type { RequestHandler } from 'express';
import type { ProductInput } from '../schemas/productSchema.js';
import type { Generator } from '../services/geminiService.js';

export const generateProduct =
  (generator: Generator): RequestHandler =>
  async (req, res) => {
    // if the browser disconnects, cancel the gemini call too
    const controller = new AbortController();
    res.on('close', () => {
      if (!res.writableFinished) controller.abort();
    });

    const data = await generator.generate(req.body as ProductInput, controller.signal);

    // the timeout middleware may have already answered
    if (!res.headersSent) res.json({ success: true, data });
  };
