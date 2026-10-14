import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { rateLimiter, timeout } from './middleware/limits.js';
import { productRoutes } from './routes/productRoutes.js';
import type { Generator } from './services/geminiService.js';

interface Options {
  generator: Generator;
  corsOrigins: string[];
  maxRequestsPerMinute: number;
}

export function createApp({ generator, corsOrigins, maxRequestsPerMinute }: Options) {
  const app = express();

  // behind a host's proxy/load balancer in production, so the rate limiter sees the real ip
  app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : 0);
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: corsOrigins, methods: ['GET', 'POST'] }));
  app.use(express.json({ limit: '10kb' }));

  app.get('/', (_req, res) => {
    res.json({
      success: true,
      data: {
        name: 'Product Card API',
        status: 'running',
        message: 'This is just the API. Open the client (http://localhost:5173 in dev) to use the app.',
        endpoints: { health: 'GET /api/health', generate: 'POST /api/products/generate' },
      },
    });
  });

  app.get('/api/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok' } });
  });

  app.use('/api/products', rateLimiter(maxRequestsPerMinute), timeout(65_000), productRoutes(generator));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
