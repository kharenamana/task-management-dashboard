# TaskFlow

TaskFlow is a secure, multi-user task dashboard built as a production-minded private beta with Next.js 16, React 19, strict TypeScript, Tailwind CSS, Supabase, and TanStack Query.

**Live demo:** [task-management-dashboard-tau-fawn.vercel.app](https://task-management-dashboard-tau-fawn.vercel.app)

## What is included

- Email/password signup, verification, login, logout, and password recovery
- Server-protected dashboard routes and SSR-compatible Supabase cookie sessions
- Owner-isolated task CRUD with status, priority, due dates, search, filters, sorting, and pagination
- Total, completed, pending, and overdue metrics
- Responsive table/card layouts, accessible dialogs, theme switching, and URL-synced filters
- Zod validation at browser and HTTP boundaries, PostgreSQL constraints, and RLS on all user-facing tables
- Vitest/React Testing Library coverage, a focused Playwright lifecycle smoke test, and GitHub Actions CI

## Architecture at a glance

Next.js Server Components authenticate and prepare the initial dashboard query. Client Components use TanStack Query for interactive server state and optimistic mutations. Same-origin Route Handlers validate requests and use the caller's Supabase cookie session; explicit owner predicates and PostgreSQL RLS independently enforce isolation.

```text
Browser -> Next.js proxy/layouts -> Route Handlers -> Supabase Auth/Postgres
                  validation           owner scope          RLS
```

See [architecture](docs/architecture.md), [database schema](docs/database.md), [Task API](docs/api.md), and [security decisions](docs/security.md).

## Local setup

Requirements: Node.js 24.x, pnpm 11.16.0, and a Supabase project. Docker is needed only for the optional local Supabase stack.

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

On Windows PowerShell, use `Copy-Item .env.example .env.local`. Replace only the placeholders in the ignored `.env.local` file:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL` (`http://localhost:3000` locally)

In Supabase Auth URL Configuration, allow `http://localhost:3000/**`. Apply the committed migrations before signing up; the profile trigger and RLS policies are database-backed and no mock authentication is available.

```bash
pnpm supabase:start
pnpm supabase:reset
pnpm supabase:test-rls
```

The seed is deterministic and local-only. Never apply `supabase/seed.sql` to a hosted project. Never commit environment files or add a service-role key to this application.

## Verification

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm verify` runs the complete default pipeline. The focused Playwright flow requires a deployed URL and a dedicated confirmed test account; see [testing](docs/testing.md) for the exact setup.

## Deployment and operations

Use the [deployment runbook](docs/deployment.md) for Vercel environments, Supabase redirects, migrations, preview promotion, rollback, and troubleshooting. Release history is recorded in [CHANGELOG.md](CHANGELOG.md).

## Troubleshooting

- **Environment validation fails:** confirm all three public variables are present and URLs include `https://` or `http://`.
- **Confirmation/recovery links fail:** check the Supabase Site URL and redirect allowlist for the exact environment.
- **Dashboard redirects to login:** confirm the browser accepts cookies and the Vercel deployment uses the same Supabase project as the publishable key.
- **Tasks return 404:** non-owned and missing task IDs intentionally share the same response.
- **Local database commands fail:** start Docker, then rerun `pnpm supabase:start` and `pnpm supabase:reset`.

## License

This repository is a portfolio demonstration project. No commercial license is granted by default.
