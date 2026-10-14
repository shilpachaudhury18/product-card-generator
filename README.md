# AI Product Card Generator

A web app that writes product card content with Google Gemini. You enter a product name, some features and a tone, and it returns a title, a short description, tags and an optional tagline. Each result is shown as a card you can copy, regenerate or remove.

- `client/` - React, TypeScript, Tailwind CSS, Vite
- `server/` - Express, TypeScript, `@google/genai`

## Getting started

Requires Node 22.22+, 24.15+ or 26+ and a [Gemini API key](https://aistudio.google.com/apikey).

```bash
npm run install:all
cp server/.env.example server/.env   # add your GEMINI_API_KEY
npm run dev
```

The client runs on http://localhost:5173 and the API on http://localhost:5001.

### Environment variables (`server/.env`)

| Variable | Default |
| --- | --- |
| `GEMINI_API_KEY` | required |
| `GEMINI_MODEL` | `gemini-flash-latest` |
| `GEMINI_FALLBACK_MODELS` | none (comma-separated) |
| `PORT` | `5001` |
| `CORS_ORIGIN` | `http://localhost:5173` |
| `RATE_LIMIT_MAX` | `10` requests per minute |

## Design choices

**Gemini is only called from the server.** This keeps the API key out of the browser and lets me validate input, rate limit requests and control what is sent back to the client.

**Client and server are separate projects.** A shared package for types and schemas felt like too much setup for a project this size, so the field limits and category/tone lists exist on both sides.

**Atomic Design.** Components are split into atoms, molecules, organisms, a template and a page, and each level only imports from the levels below it.

**State lives in one hook.** `useProductGenerator` holds the form, the cards and the loading/error state. Each card keeps the input it was generated from, so it can be regenerated in place. A ref stops a double click from sending two requests.

**Model output is validated.** The server asks Gemini for JSON that matches a schema, then checks the reply with Zod and retries once if it is invalid.

**User input is treated as data.** Product details are passed to the prompt inside `<product_data>` tags, and the prompt tells the model not to follow instructions in there or invent specs, prices or warranties.

**Retries and fallback models.** `gemini-2.5-flash` turned out to be retired for new keys, and Gemini often returned 503 errors during testing. The server now uses `gemini-flash-latest`, retries 5xx errors, can fall back to other models and gives up after 60 seconds.

**Safe errors.** The client only receives a short message and an error code. Full details go to the server log.

**No images.** Each card gets a gradient based on its category instead.

## Where AI was used

- **In the app:** Gemini generates the title, description, tags and tagline. Everything else is regular code.
- **During development:** I used an AI coding assistant to help write and debug the code and to draft this README. I defined the requirements and structure, tested the app locally and reviewed the code.

## Deployment

In production the server also serves the built client, so the app runs as a single service. `render.yaml` deploys it to Render: choose New → Blueprint, select this repo and enter `GEMINI_API_KEY`.

## Known limitations

- Cards are kept in memory and are cleared on refresh
- There is no login, so usage is only limited by the rate limiter
- No automated tests
