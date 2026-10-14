# AI Product Card Generator

A small web app that writes product card content with Google Gemini. You type in a product name, a few features, pick a tone, and it gives you back a title, a short description, some tags and (if you want one) a tagline. Each result shows up as a card you can copy, regenerate or remove.

The repo is split into two projects that don't share any code:

- `client/` - the React frontend (TypeScript, Tailwind, Vite)
- `server/` - an Express API in TypeScript that talks to Gemini

Each one has its own `package.json`, dependencies and `.env`. They only talk to each other over HTTP.

## Features

- Title, description, 3-8 tags and an optional tagline for each product
- Four tones: Professional, Friendly, Premium and Persuasive
- Optional category and target audience, to give the model a bit more context
- You can generate as many cards as you like. Newest goes on top.
- Copy, regenerate and remove on every card. Regenerating only touches that one card.
- Proper loading, empty and error states, including errors on a single card
- Form and results sit side by side on desktop and stack on mobile
- No product images. Each card gets a colour gradient based on its category instead.

## Tech stack

- **Client:** React 19, TypeScript, Vite, Tailwind CSS v4, Zod
- **Server:** Node.js, Express 5, TypeScript, the official `@google/genai` SDK, Zod, Helmet, express-rate-limit

## Design choices

A few decisions that shaped the project, and why I made them.

**Gemini only gets called from the server.** The obvious reason is the API key. Anything in the frontend ends up in the browser, including `VITE_` env variables, so the key has to stay on the server. Having my own API in the middle also means I can validate input, rate limit, and control exactly what goes back to the browser. In development Vite proxies `/api` to the Express server, so the client doesn't need to know where the API lives.

**Client and server are completely separate.** I thought about a shared package for the types and Zod schemas, but it adds build setup for not much gain on a project this size. So each side has its own copy of the field limits and the category/tone lists. The downside is that if you change one, you have to remember to change the other. There's a comment in both files pointing at the other one.

**Atomic Design for the components.** The assignment asked for it, and it does keep things tidy. Atoms are plain styled elements (`Button`, `Input`, `Badge`...), molecules combine a few of them (`FormField`, `TagList`, `ToneSelector`...), organisms are whole sections of the page, then one template and one page. Each level only imports from the levels below it. Honestly a couple of the molecules are very thin, `GenerateButton` is basically a `Button` with fixed props, but I kept them so the hierarchy matches what was asked.

`FormField` is the one I'd point to as actually useful. It takes care of the label, hint, error message and the aria attributes for whatever input you put inside it, so every field in the form is accessible without repeating that wiring.

**All the state lives in one custom hook.** `useProductGenerator` holds the form, the cards, the loading and error state, and the generate/regenerate logic. The components just get props and call callbacks. I didn't use Redux or context, since everything lives on one page and a hook was plenty.

Two details in the hook that are easy to miss:
- A double click on Generate could fire two requests, because `loading` doesn't update until the next render. There's a ref that blocks a second request straight away.
- Each card keeps the form values it was made from. That's what lets Regenerate redo just that card, in the same position with the same id, even after you've changed the form for something else.

**I don't trust the model's output.** I use Gemini's JSON mode (`responseMimeType` plus `responseJsonSchema`) so the reply should come back in the right shape, but the server still checks it with Zod before passing it on. If the JSON is broken or missing fields, it retries once and then gives up with an error. The client checks the response shape again too.

**User input is treated as data, not instructions.** The product details go into the prompt as JSON inside `<product_data>` tags, and the system prompt tells the model to ignore anything in there that looks like an instruction. The prompt also says not to invent specs, certifications, warranties, prices or discounts. I can't guarantee the model always listens, but it helps a lot.

**Retries and fallback models came from a real problem.** My first version used `gemini-2.5-flash`. It turned out Google had retired it for new API keys, so every request failed with a vague error. On top of that, Gemini returned 503 "high demand" errors quite often while I was testing. So now:
- The default model is `gemini-flash-latest`, an alias that always points to Google's current Flash model.
- 5xx errors get retried with a short wait.
- You can list fallback models in `GEMINI_FALLBACK_MODELS`, which get tried when the main one is busy or missing.
- All of it has a 60 second budget, so a request can't hang forever.

**Errors are safe to show.** The server has one error handler. Clients only ever get a short message and a code. The real Gemini error, stack traces and so on go to the server log. That's also how I found the retired model problem in the first place.

**No images.** The brief said not to require image generation, so each card has a gradient picked by category, with the product's initials on it.

## Where AI was used

**In the app itself:** Gemini writes the content: the title, description, tags and tagline. That's the only part that's AI. The validation, retries, error handling and the whole UI are normal code. Everything Gemini returns gets checked against a schema before anyone sees it, and the prompt is set up to stop it making claims about the product that weren't in the input.

**While building it:** I used an AI coding assistant (Claude Code) a lot during development. It wrote most of the first version of both the client and server from my requirements, and it also helped with:
- splitting the frontend into `client/` and `server/`
- tracking down the retired Gemini model and adding the retries and fallbacks
- cleaning up the code
- drafting this README

I set the requirements and the structure, ran and tested the app locally, reported problems as I hit them (like the backend "not found" page and the failing Gemini calls), and made the calls on what to keep or change. That included removing the automated tests the first version had. I went through the code and kept the parts I understood and agreed with.

## Folder structure

```
client/
  src/
    components/
      atoms/  molecules/  organisms/  templates/
    pages/        ProductGeneratorPage
    hooks/        useProductGenerator, useClipboard
    services/     productGeneratorService (the only place that calls fetch)
    schemas/      zod schemas for the form and the api response
    types/        product + api types
    utils/        formatters, colors
  vite.config.ts  (also proxies /api to the server in dev)

server/
  src/
    config/env.ts           env vars, checked with zod on startup
    routes/                 productRoutes
    controllers/            productController
    services/geminiService  prompt, gemini call, retries, output checks
    schemas/productSchema   request + response schemas
    middleware/             validate, limits (rate limit + timeout), errorHandler
    utils/HttpError.ts
    app.ts  server.ts
```

## Getting started

You'll need **Node 22.22+, 24.15+ or 26+** (there's an `.nvmrc`), npm, and a Gemini API key. You can get a free one from [Google AI Studio](https://aistudio.google.com/apikey).

### Server

```bash
cd server
npm install
cp .env.example .env
```

Open `server/.env` and put your key in `GEMINI_API_KEY`. Only put it here, never in the client.

```bash
npm run dev
```

The API runs on http://localhost:5001. If there's no key it'll still start, but generate requests will return a config error until you add one.

### Client

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Then open http://localhost:5173. The client doesn't need a `.env` for local development.

If you'd rather use one terminal, run `npm run install:all` once from the repo root, then `npm run dev` from the root starts both.

## Environment variables

**server/.env**

| Variable | Default | Notes |
| --- | --- | --- |
| `GEMINI_API_KEY` | - | Needed to generate anything |
| `GEMINI_MODEL` | `gemini-flash-latest` | Needs to support JSON output |
| `GEMINI_FALLBACK_MODELS` | - | Comma-separated. Tried when the main model is busy or unavailable. |
| `PORT` | `5001` | |
| `CORS_ORIGIN` | `http://localhost:5173` | Comma-separated list of frontend URLs allowed to call the API |
| `RATE_LIMIT_MAX` | `10` | Generate requests per minute, per IP |
| `NODE_ENV` | `development` | |

**client/.env** (optional)

| Variable | Notes |
| --- | --- |
| `VITE_API_BASE_URL` | The API's URL in production. Leave it empty in dev. |
| `API_PROXY_TARGET` | Where the dev server sends `/api` (default `http://localhost:5001`). Change it if you change the server port. |

## API

### `POST /api/products/generate`

```bash
curl -X POST http://localhost:5001/api/products/generate \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Wireless Headphones",
    "features": "Noise cancellation, Bluetooth connectivity, long battery life",
    "category": "Electronics",
    "targetAudience": "Professionals and commuters",
    "tone": "Professional"
  }'
```

`productName` (2-100 characters) and `features` (10-1000 characters) are required. Everything else is optional: `category`, `targetAudience` (up to 150 characters), `tone` (defaults to Professional) and `includeTagline` (defaults to true). Any field the API doesn't know about gets rejected.

A successful response looks like this:

```json
{
  "success": true,
  "data": {
    "title": "Wireless Headphones with Advanced Noise Cancellation",
    "description": "Enjoy clear audio and comfortable listening with wireless headphones designed for everyday productivity and travel.",
    "tags": ["Wireless Audio", "Noise Cancellation", "Bluetooth", "Travel Essentials"],
    "tagline": "Focus on What Matters."
  }
}
```

And an error looks like this. `details` only shows up for validation errors.

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Some fields are missing or invalid",
    "details": [{ "field": "productName", "message": "Product name is too short" }]
  }
}
```

The error codes:
- `VALIDATION_ERROR` and `BAD_REQUEST` (400, 413)
- `RATE_LIMITED` (429)
- `AI_ERROR` (422, 502, 503)
- `CONFIG_ERROR` (503, meaning the key or model is missing or wrong)
- `TIMEOUT` (504)
- `NOT_FOUND` (404)
- `SERVER_ERROR` (500)

There's also `GET /api/health`, which just returns `{ "status": "ok" }`.

## Building for production

```bash
cd client && npm run build   # type-checks, then builds to client/dist
cd server && npm run build   # compiles to server/dist
cd server && npm start       # runs the compiled server
```

Running `npm run preview` in `client/` serves the built frontend locally, using the same `/api` proxy as dev.

## Deployment

The app deploys as a single service. In production (`NODE_ENV=production`) the API also serves the built client from `client/dist`. Everything is on one domain, so you don't need `VITE_API_BASE_URL` or CORS.

`render.yaml` is a Render Blueprint for this setup. On Render, choose **New → Blueprint**, pick this repo and enter `GEMINI_API_KEY` when asked. Every push to `main` redeploys automatically.

To run the same thing on another host:

- Build: `npm ci --prefix client --include=dev && npm ci --prefix server --include=dev && npm run build`
- Start: `npm --prefix server start`
- Env: `NODE_ENV=production`, `GEMINI_API_KEY` and, optionally, the model variables

## Screenshots

_To do: add screenshots to `docs/screenshots/` and link them here._

- Empty state
- Validation errors
- Generated cards
- Error state
- Mobile layout

## Security

- The Gemini key only lives in `server/.env`, which is git-ignored
- Every request is checked with Zod (lengths, allowed values, no unknown fields) and the body is capped at 10kb
- Model output is checked before it reaches the browser
- Helmet headers, CORS locked to the frontend's origin, rate limiting, and timeouts on the Gemini calls
- Errors sent to the browser never include stack traces, keys or raw Gemini errors. Those only go to the server log.

## Known limitations

- Cards live in memory only, so refreshing the page clears them
- The rate limiter is in memory too, so the limit applies per server instance
- There's no login, so anyone who can reach the API can use your Gemini quota (up to the rate limit)
- The field limits and category/tone lists are duplicated between client and server (see design choices above)
- Gemini still gets busy sometimes. The retries and fallbacks help, but now and then you'll have to hit "Try again".
- `gemini-flash-latest` changes when Google updates its Flash model, so the writing style might shift over time. Pin a specific model in `GEMINI_MODEL` if that matters to you.
- Copy to clipboard only works on HTTPS or localhost
- No automated tests at the moment
