# Deployment

TaskFlow is deployed through the Vercel Git integration. The canonical production URL is [taskflow-management-dashboard.vercel.app](https://taskflow-management-dashboard.vercel.app). The Vercel-managed hostname avoids a separate registrar DNS dependency during private beta.

## Environment variables

Configure these names in Vercel for Production, Preview, and Development. Values belong in Vercel/Supabase settings or ignored local files, never Git:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

Production and Preview `NEXT_PUBLIC_SITE_URL` are `https://taskflow-management-dashboard.vercel.app` without a trailing slash. Preview deployments intentionally use the canonical production site URL for metadata and safe auth redirects.

Test credentials are separate GitHub Actions repository secrets:

- `E2E_BASE_URL`
- `E2E_USER_EMAIL`
- `E2E_USER_PASSWORD`

No Supabase service-role key or Vercel token is required by the application or the Git-linked deployment workflow.

## Supabase Auth URLs

Set the hosted Auth Site URL to the canonical production origin and allow:

```text
http://localhost:3000/**
https://taskflow-management-dashboard.vercel.app/auth/callback
https://taskflow-management-dashboard.vercel.app/**
https://*-namanas-projects.vercel.app/**
```

The last pattern supports Vercel branch previews in this team. Review Supabase's [redirect URL guidance](https://supabase.com/docs/guides/auth/redirect-urls) before changing domains, and prefer exact production paths.

## Deploy a change

1. Create or use a `codex/*` feature branch and run `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.
2. Review the complete diff for security, accessibility, correctness, and unnecessary client-side work.
3. Push the focused conventional commit. GitHub Actions verifies the same default checks, and Vercel creates a branch preview.
4. Smoke-test the preview landing page, auth form, unauthenticated dashboard redirect, and any changed authenticated flow.
5. Promote only the verified deployment to Production from the Vercel deployment menu. Do not force-push or use a stale deployment.
6. Confirm the canonical URL resolves to the expected commit and inspect build/runtime logs for errors.

The repository's production branch is `main`; work currently remains on `codex/task-management-dashboard` in pull request #1. Until that PR is merged, feature pushes create previews and a verified deployment must be promoted explicitly.

## Database changes

Treat `supabase/migrations` as the schema source of truth. Add a forward migration, test a local reset and RLS checks, review SQL, then apply it to the hosted project through an authenticated management connection. Never edit an applied migration. `supabase/seed.sql` is local-only.

Application rollback uses Vercel's previous known-good deployment. Database rollback is not automatic: prefer a corrective forward migration, and take/verify backups before destructive production changes. Practice point-in-time or backup restoration before commercial launch.

## CI and E2E

`.github/workflows/ci.yml` runs on `main`, `codex/**`, and pull requests. `.github/workflows/e2e.yml` is manual because it needs a deployed URL and dedicated account; see [testing](testing.md). GitHub/Vercel integration handles deployments, so repository secrets should not contain a deployment token.

## Demo and screenshots

Use a dedicated confirmed demo account with non-sensitive sample tasks. Capture the landing page and authenticated dashboard at desktop, tablet, and mobile widths from the canonical production URL. Redact account email addresses and never commit cookies, storage snapshots, `.env` files, or browser traces containing credentials.

## Free-tier constraints

- Supabase/Vercel quotas and cold starts can affect latency or availability.
- Default Supabase email delivery is suitable for testing, not reliable branded production mail; configure custom SMTP before launch.
- There is no custom task-API rate limiter, MFA, audit log, realtime collaboration, or team authorization.
- Preview wildcard redirects and public production access are private-beta tradeoffs that need tighter controls for an open contribution model.

## Troubleshooting

- **Stale production:** compare the displayed Vercel commit with the branch HEAD and promote the verified current preview.
- **Build-time environment failure:** add all three public variables to the affected Vercel environment and redeploy.
- **Auth link returns to localhost:** correct the Supabase Site URL and redirect allowlist, then request a new email link.
- **Preview callback rejected:** confirm the preview host matches the team wildcard and the callback path is `/auth/callback`.
- **Database/API failure after deploy:** inspect the Vercel runtime log, verify hosted migrations, then run the transactional RLS check through the management connection.
