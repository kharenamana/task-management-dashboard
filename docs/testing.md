# Testing

The default CI workflow uses one worker and runs formatting, ESLint, strict TypeScript, Vitest, and the production build. The focused Playwright workflow is manual because it needs a deployed URL and a dedicated confirmed account.

## Dedicated E2E account

1. In Supabase, open **Authentication → Users → Add user → Create new user**.
2. Use a dedicated non-personal email address and a unique password of at least 16 characters. Enable **Auto Confirm User**; do not assign roles or privileged metadata.
3. In GitHub, open **Settings → Secrets and variables → Actions** and add repository secrets named `E2E_BASE_URL`, `E2E_USER_EMAIL`, and `E2E_USER_PASSWORD`.
4. Set `E2E_BASE_URL` to the verified preview origin without a trailing slash. Use production only after that exact commit has passed the preview run.
5. Run **Actions → E2E smoke → Run workflow**. The test creates a uniquely named task and removes it before finishing.

Never use a personal or administrator account. Never commit these values or place them in `.env.example` beyond placeholders.

## Local E2E run

Create an ignored `.env.test.local` file with the same three variable names, ensure the app is available at `E2E_BASE_URL`, then run:

```bash
pnpm test:e2e
```

Playwright uses one Chromium worker and retains traces, screenshots, and video only when a test fails. If credentials are absent, the authenticated lifecycle test is reported as skipped instead of attempting a fake login.

`e2e/accessibility.spec.ts` runs axe WCAG A/AA checks against representative public and authentication routes without credentials. With the dedicated account configured, it also checks the authenticated dashboard. Serious and critical findings fail the run; keyboard and visual review remain required because automated rules do not cover every accessibility requirement. The same file verifies that reduced-motion preferences disable marketing entrance animation.

## Performance and provider boundaries

Run `pnpm analyze` after a production build review. It uses `next experimental-analyze --output`, writes only ignored `.next` artifacts, and adds no analyzer package. Review the route/client-reference output to confirm public and authentication routes do not include TanStack Query, Sonner, or task-dialog modules; those dependencies belong to the dashboard route group. The Playwright accessibility suite also fails if the landing page contacts a Supabase runtime origin.

For release previews, review one desktop and one mobile viewport for overflow, readable hierarchy, stable layout, and visible focus. Lighthouse targets are Performance 90+, Accessibility 95+, Best Practices 95+, and SEO 95+. Treat performance variance caused by free-tier cold starts as diagnostic, while functional, metadata, bundle-boundary, and accessibility failures remain release blockers.

The repository does not install a browser during normal development. On Windows, Playwright reuses an existing Edge or Chrome executable when available and skips video capture because that would require a separate FFmpeg download; failure traces and screenshots remain enabled. The manually dispatched CI workflow installs its pinned Chromium bundle and retains failure video. Until the three E2E secrets and dedicated confirmed user exist, the public/auth accessibility checks can run locally but the live authenticated lifecycle remains an explicit external prerequisite.
