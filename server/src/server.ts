import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { makeGenerator } from './services/geminiService.js';

if (!env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is missing - generate requests will fail until you add it to server/.env');
}

const models = [env.GEMINI_MODEL, ...env.GEMINI_FALLBACK_MODELS];

// in production the api also serves the built client, if it's been built
const clientDir = fileURLToPath(new URL('../../client/dist', import.meta.url));
const serveClient = env.NODE_ENV === 'production' && existsSync(clientDir);

const app = createApp({
  generator: makeGenerator(env.GEMINI_API_KEY, models),
  corsOrigins: env.CORS_ORIGIN,
  maxRequestsPerMinute: env.RATE_LIMIT_MAX,
  clientDir: serveClient ? clientDir : undefined,
});

const server = app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT} (models: ${models.join(', ')})`);
});

const shutdown = () => server.close(() => process.exit(0));
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
