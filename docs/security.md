# Security

TaskFlow uses defense in depth. Authentication, server authorization, HTTP validation, database grants, and Row Level Security are independent controls; none is treated as a substitute for another.

## Current controls

- Supabase Auth is the only identity source. No mock or in-memory authentication is used.
- The browser receives only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. A service-role key is not required and must never be added to client code, Vercel, CI, or repository history.
- Every user-facing table has RLS enabled. Task policies compare the indexed `user_id` column to `(select auth.uid())` for select, insert, update, and delete. Updates and inserts include `WITH CHECK` ownership enforcement.
- Anonymous users have no privileges on profiles or tasks. Authenticated users receive only the table operations required by the product.
- Signup and timestamp trigger helpers live in a non-exposed `private` schema. The signup `SECURITY DEFINER` function has an empty search path, fully qualified object names, bounded metadata, and revoked client execution.
- Database constraints enforce field lengths and enum values even if application validation is bypassed.
- Local seed identities contain no passwords and the seed is never applied to hosted environments.
- Local secrets belong in ignored `.env.local` files. `.env.example` contains names and placeholders only.
- Next.js emits content-type, frame, referrer, permissions, CSP, and production HSTS headers. The CSP will be reviewed as authenticated routes and Supabase calls are introduced.

## Verification

`supabase/tests/rls_ownership.sql` performs a transactional two-user test. User A cannot select, update, delete, or insert for user B, while owned mutation succeeds. The same script passed against the hosted project and rolled back all temporary data. Supabase's security advisor currently reports no findings.

## Known beta limitations

- No application-level task API rate limiter yet.
- No MFA, audit log, shared workspaces, roles, invitations, or organization policy controls.
- Supabase and Vercel free-tier quotas, cold starts, and transactional email limits apply.
- Vercel Deployment Protection currently guards generated deployment URLs. Public production access requires an explicit project-level policy decision or a custom domain.
- Abuse monitoring, incident alerting, backup-restore drills, dependency scanning, and penetration testing are commercial-launch work.

Report suspected vulnerabilities privately to the repository owner; do not open a public issue containing exploit details or credentials.
