# Agent evaluations

A small TypeScript project that evaluates sample AI agents with `@anvia/core/evals` and sends results to Anvia Lens. The examples cover a support answer, a structured incident classification, faithfulness to supplied context, and abstaining when the context lacks an answer.

## Requirements

- Node.js and pnpm 12.5.1 (the version pinned in `package.json`)
- An API key for an OpenAI-compatible model endpoint that serves the model configured in `src/models.ts` (`gpt-6-luna` by default)
- An Anvia Lens instance and its public and secret ingestion keys
- Docker with Compose only if you want to run Lens locally

## Set up

1. Install dependencies:

   ```sh
   pnpm install --frozen-lockfile
   ```

2. Copy the root environment template and fill in the API and Lens credentials:

   ```sh
   cp .env.example .env
   ```

   `OPENAI_API_KEY` is required. Set `OPENAI_BASE_URL` if you use a compatible gateway instead of the client's default endpoint. The configured endpoint must serve `gpt-6-luna`, or you can change the model ID in `src/models.ts`. Set `ANVIA_LENS_BASE_URL`, `ANVIA_LENS_PUBLIC_KEY`, and `ANVIA_LENS_SECRET_KEY` for the Lens instance that should receive results. Keep the real `.env` private.

3. If you do not already have a Lens instance, start the bundled local stack:

   ```sh
   cp lens/.env.example lens/.env
   ```

   Replace each secret in `lens/.env` with a different random value (for example, generate each with `openssl rand -hex 32`), then run:

   ```sh
   docker compose --env-file lens/.env -f lens/docker-compose.yml up -d
   ```

   The web UI is at `http://localhost` with the example settings. Create or obtain Lens ingestion keys there and put them in the root `.env`. If you change `WEB_PORT`, include that port in `PUBLIC_APP_URL`, `WEB_ORIGIN`, and `ANVIA_LENS_BASE_URL`. The Compose stack persists PostgreSQL, Redis, and ClickHouse data in Docker volumes.

## Run evaluations

```sh
pnpm eval:run          # alias for eval:contain
pnpm eval:contain      # checks whether the answer contains "30 minutes"
pnpm eval:exact-match  # checks structured incident ID and priority output
pnpm eval:faithfulness # model-graded check against the supplied policy
pnpm eval:abstention   # model-graded check for answering vs. abstaining
```

Each command prints results, exits unsuccessfully when an evaluation fails, and sends the run (including case payloads) to Lens. The agent calls and model-graded metrics use the configured model endpoint, so running them may incur API usage. `eval:contain` also records the current Git commit as `ANVIA_LENS_RELEASE`.

Run `pnpm typecheck` to check the TypeScript source without calling the model or Lens.

## Project layout

- `src/agents.ts` and `src/models.ts`: example agent and model configuration
- `src/cases.ts`: shared support-policy test case
- `src/evals/`: the four evaluation entry points
- `src/lens.ts`: Lens reporter configuration
- `lens/docker-compose.yml`: optional local Lens stack
