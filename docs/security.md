# Security

TaskFlow uses defense in depth. Authentication, server authorization, HTTP validation, database grants, and Row Level Security are independent controls; none is treated as a substitute for another.

## Current controls

- Supabase Auth is the only identity source. No mock or in-memory authentication is used.
- `@supabase/ssr` stores sessions in secure cookies. `proxy.ts` refreshes tokens and provides an early navigation redirect, while protected layouts, API boundaries, and RLS independently enforce authorization.
- Server authorization reads cryptographically verified claims with `auth.getClaims()` rather than trusting local session storage.
- Authentication redirects pass through a same-origin path allowlist to prevent open redirects. Callback failures are reduced to a generic public message.
- Signup, login, and recovery inputs are independently validated at the browser form and server-action boundaries with shared Zod schemas. Authentication provider errors are mapped to a small sanitized message set.
- Task Route Handlers authenticate before parsing request bodies, reject unexpected mutation fields, and validate IDs, queries, dates, pagination, and JSON independently of database constraints.
- Task repositories add explicit authenticated `user_id` predicates to every operation while RLS remains the final ownership boundary. Missing and non-owned IDs produce the same sanitized `404` response.
- Authenticated API responses are private and non-cacheable. Public errors never include raw Supabase or PostgreSQL details, and public task objects omit `user_id`.
- The browser receives only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. A service-role key is not required and must never be added to client code, Vercel, CI, or repository history.
- Every user-facing table has RLS enabled. Task policies compare the indexed `user_id` column to `(select auth.uid())` for select, insert, update, and delete. Updates and inserts include `WITH CHECK` ownership enforcement.
- Anonymous users have no privileges on profiles or tasks. Authenticated users receive only the table operations required by the product.
- Signup and timestamp trigger helpers live in a non-exposed `private` schema. The signup `SECURITY DEFINER` function has an empty search path, fully qualified object names, bounded metadata, and revoked client execution.
- Database constraints enforce field lengths and enum values even if application validation is bypassed.
- Local seed identities contain no passwords and the seed is never applied to hosted environments.
- Local secrets belong in ignored `.env.local` files. `.env.example` contains names and placeholders only.
- Next.js emits content-type, frame, referrer, permissions, CSP, and production HSTS headers. The reviewed CSP restricts connections to the same origin and Supabase; inline scripts/styles remain allowed where the Next.js runtime and styling stack require them.

## Hosted authentication configuration

The production Supabase Auth Site URL is `https://taskflow-management-dashboard.app`. The allowlist contains:

- `http://localhost:3000/**`
- `https://taskflow-management-dashboard.app/auth/callback`
- `https://taskflow-management-dashboard.app/**`
- `https://*-namanas-projects.vercel.app/**` for Git-linked preview deployments

Keep the production callback exact. The preview wildcard is a beta convenience and should be narrowed or protected when untrusted contributors can create previews.

## Verification

`supabase/tests/rls_ownership.sql` performs a transactional six-assertion, two-user test. User A cannot select, update, delete, insert for, or count user B's tasks, while an owned mutation succeeds. The script passed against the hosted project on 2026-08-11 and rolled back all temporary data. The current security advisor reports no database-function or RLS issue; Supabase Auth's optional leaked-password protection remains disabled and should be enabled before a broader public launch.

## Known beta limitations

- No application-level task API rate limiter yet.
- The beta relies on Supabase Auth's platform protections; there is no additional application-level login rate limiter or CAPTCHA yet.
- No MFA, audit log, shared workspaces, roles, invitations, or organization policy controls.
- Supabase and Vercel free-tier quotas, cold starts, and transactional email limits apply.
- Public production is intentionally available for portfolio review; Git-linked previews should remain access-controlled where the plan supports it.
- Abuse monitoring, incident alerting, backup-restore drills, dependency scanning, and penetration testing are commercial-launch work.

Before a commercial launch, add task-API rate limiting, CAPTCHA or bot protection for exposed auth flows, MFA, an immutable audit trail, custom SMTP with a verified domain, centralized error/latency monitoring, backup-restore drills, and a formal vulnerability-reporting channel.

Report suspected vulnerabilities privately to the repository owner; do not open a public issue containing exploit details or credentials.
