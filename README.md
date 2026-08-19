# HeangOS

Personal life and productivity operating system.

Phase 1 covers: authentication, a Today dashboard, and task management, on
top of Supabase (auth) and Neon (application data). See
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how the pieces fit together
and [docs/ROADMAP.md](docs/ROADMAP.md) for what's done vs. planned.

## Tech stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS, shadcn/ui-style components
- Supabase Auth (`@supabase/ssr`, `@supabase/supabase-js`) — authentication only
- Neon Postgres (`@neondatabase/serverless`) — application data
- Zod for request validation

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local` and fill in real values. Never commit
`.env.local`.

| Variable | Where it's used | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | browser + server | safe to expose |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | browser + server | safe to expose |
| `DATABASE_URL` | server only | Neon connection string — never prefix with `NEXT_PUBLIC_` |

## Supabase Auth setup

1. Use your existing Supabase project.
2. Copy the project URL and publishable (anon) key from Project Settings →
   API into `.env.local`.
3. Supabase only handles authentication here — no application tables
   (tasks, goals, etc.) are created in Supabase.

## Neon setup

1. Create a Neon project and database.
2. Copy its connection string into `DATABASE_URL` in `.env.local`.
3. Apply the SQL migrations in [db/migrations](db/migrations) — see
   [db/README.md](db/README.md) for exact commands. Nothing runs
   automatically; migrations are applied by hand.

## Future: Spring Boot backend

Phase 4 replaces the Next.js Route Handlers under `app/api/*` with a Spring
Boot REST API in front of the same Neon database. `lib/api/*.ts` is the only
layer components talk to, so that swap changes a base URL and a handful of
server files — not the frontend. Details in
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
