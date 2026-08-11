# Database and local Supabase

TaskFlow uses Supabase Postgres 17. The committed migration is the source of truth for the `public.profiles` and `public.tasks` schema. Production identifiers and credentials are never stored in the repository.

## Data model

| Table      | Primary/owner key                   | Main fields                                                                                          |
| ---------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `profiles` | `id` → `auth.users.id`              | `display_name`, `created_at`, `updated_at`                                                           |
| `tasks`    | UUID `id`, `user_id` → `auth.users` | `title`, `description`, `status`, `priority`, `due_date`, `completed_at`, `created_at`, `updated_at` |

`profiles.id` is both the primary key and a cascading foreign key to `auth.users.id`. An `AFTER INSERT` trigger on `auth.users` creates one profile and copies a bounded `full_name` value from user metadata.

`tasks` uses UUID primary keys and an indexed `user_id` foreign key. Status is one of `pending`, `in_progress`, or `completed`; priority is one of `low`, `medium`, or `high`. Due dates are nullable calendar dates. Completion and update timestamps are maintained by database triggers.

Title and description lengths are enforced in Postgres in addition to application Zod validation. Composite indexes support common owner/status/priority/due-date access paths. A follow-up migration aligns the raw-title trigram GIN index with the API's case-insensitive `ILIKE` search expression.

Dashboard totals are returned by `public.get_task_metrics(date)` in one aggregate query. The function is `SECURITY INVOKER`, has an empty search path, filters by `auth.uid()`, revokes `PUBLIC` and `anon` execution, and grants execution only to `authenticated`; table RLS therefore remains authoritative.

## Access model

Only `authenticated` users receive task CRUD privileges. RLS then restricts every task operation to `user_id = auth.uid()`. Profiles can only be selected or updated by their owner; direct profile insert/delete is not granted. Anonymous users receive no table privileges.

The migration explicitly grants current objects and revokes automatic grants for future public tables, sequences, and functions. Trigger helpers live in the non-exposed `private` schema. The signup function is `SECURITY DEFINER`, has an empty search path, uses fully qualified names, and cannot be called by anonymous or authenticated roles.

## Local workflow

Requirements: Docker Desktop (or another Docker-compatible runtime), Node 24, and pnpm.

```bash
pnpm supabase:start
pnpm supabase:reset
pnpm supabase:status
```

`supabase db reset` recreates the local database from migrations and then applies `supabase/seed.sql`. The seed contains two non-login placeholder users and deterministic sample tasks. It is local-only and must never be pushed to a hosted project.

Create a login-capable local user through local Studio at `http://127.0.0.1:54323`; outbound development email is captured by Mailpit at `http://127.0.0.1:54324`.

## Ownership verification

Run the transactional RLS check against a local database:

```bash
pnpm supabase:test-rls
```

The script creates two temporary users, impersonates user A through JWT claims, verifies that user B's task is invisible and cannot be updated, deleted, targeted by insert, or counted by the metrics function, verifies owned update succeeds, and rolls everything back.

For the hosted project, the same SQL can be run through the authenticated Supabase management connection. The six ownership and metrics-isolation assertions passed transactionally on 2026-08-11. Never run them through a client-visible key.

The hosted Supabase security advisor reported no findings on 2026-08-11. The performance advisor reported only unused-index informational notices, which are expected before meaningful beta traffic; retain the ownership/filter/due-date/search indexes and reassess them using production query statistics.

## Migration workflow

Create every schema change as a new migration:

```bash
pnpm supabase migration new descriptive_name
pnpm supabase:reset
```

Review generated SQL before applying it. Hosted changes are applied through the Supabase migration API and checked with the security and performance advisors. Do not edit an already-applied migration; add a new one.
