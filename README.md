# TaskFlow

TaskFlow is a secure, multi-user task management dashboard built with Next.js, TypeScript, Tailwind CSS, Supabase, and TanStack Query. It is designed for a free-tier private beta while keeping a clean path toward production scaling.

## Current status

The project is being delivered in verified phases. The foundation, Supabase database/RLS layer, secure authentication flow, validated owner-scoped Task API, and responsive dashboard experience are complete. End-to-end tests and release documentation follow in focused commits.

## Prerequisites

- Node.js 24.x
- pnpm 11.16.0
- A Supabase project
- A Vercel account for deployment

## Local setup

1. Install dependencies with `pnpm install --frozen-lockfile`.
2. Copy `.env.example` to `.env.local` and replace placeholders.
3. Run `pnpm dev` and open `http://localhost:3000`.

### Authentication setup

In Supabase Auth URL Configuration, use `http://localhost:3000` as the local Site URL and allow `http://localhost:3000/auth/callback` as a redirect URL. Email/password signup must be enabled. Keep email confirmation enabled for production-like local testing.

Manual auth routes:

- `/signup` — create an account and request verification
- `/login` — authenticate and test protected-route redirects
- `/forgot-password` — request a recovery email
- `/reset-password` — reachable from a valid recovery callback
- `/dashboard` — server-protected authenticated route

Deployment is intentionally deferred until the dashboard experience is complete after Phase 4.

Never commit `.env.local` or any credential. `NEXT_PUBLIC_` variables are intentionally browser-visible and must never contain a Supabase secret or service-role key.

## Quality commands

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm verify
pnpm supabase:start
pnpm supabase:reset
pnpm supabase:test-rls
```

## Documentation

- [Architecture](docs/architecture.md)
- [Database and local Supabase](docs/database.md)
- [Task API](docs/api.md)
- [Security](docs/security.md)
- The deployment guide is added in its corresponding delivery phase.

## License

This repository is provided as a portfolio demonstration project. No commercial license is granted by default.
