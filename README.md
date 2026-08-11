# TaskFlow

TaskFlow is a secure, multi-user task management dashboard built with Next.js, TypeScript, Tailwind CSS, Supabase, and TanStack Query. It is designed for a free-tier private beta while keeping a clean path toward production scaling.

## Current status

The project is being delivered in verified phases. Phase 0 establishes the application, quality tooling, CI, and deployment foundation. Database, authentication, task APIs, dashboard interactions, end-to-end tests, and release documentation follow in focused commits.

## Prerequisites

- Node.js 24.x
- pnpm 11.16.0
- A Supabase project
- A Vercel account for deployment

## Local setup

1. Install dependencies with `pnpm install --frozen-lockfile`.
2. Copy `.env.example` to `.env.local` and replace placeholders.
3. Run `pnpm dev` and open `http://localhost:3000`.

Never commit `.env.local` or any credential. `NEXT_PUBLIC_` variables are intentionally browser-visible and must never contain a Supabase secret or service-role key.

## Quality commands

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm verify
```

## Documentation

- [Architecture](docs/architecture.md)
- Database, security, and deployment guides are added in their corresponding delivery phases.

## License

This repository is provided as a portfolio demonstration project. No commercial license is granted by default.
