import { createApp } from './app.js';
import { env } from './config/env.js';
import { makeGenerator } from './services/geminiService.js';

if (!env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is missing - generate requests will fail until you add it to server/.env');
}

const models = [env.GEMINI_MODEL, ...env.GEMINI_FALLBACK_MODELS];

const app = createApp({
  generator: makeGenerator(env.GEMINI_API_KEY, models),
  corsOrigins: env.CORS_ORIGIN,
  maxRequestsPerMinute: env.RATE_LIMIT_MAX,
});

const server = app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT} (models: ${models.join(', ')})`);
});

const shutdown = () => server.close(() => process.exit(0));
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
