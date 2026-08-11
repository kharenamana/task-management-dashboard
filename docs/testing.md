# Testing

The default CI workflow uses one worker and runs formatting, ESLint, strict TypeScript, Vitest, and the production build. The focused Playwright workflow is manual because it needs a deployed URL and a dedicated confirmed account.

## Dedicated E2E account

1. In Supabase, open **Authentication → Users → Add user → Create new user**.
2. Use a dedicated non-personal email address and a unique password of at least 16 characters. Enable **Auto Confirm User**; do not assign roles or privileged metadata.
3. In GitHub, open **Settings → Secrets and variables → Actions** and add repository secrets named `E2E_BASE_URL`, `E2E_USER_EMAIL`, and `E2E_USER_PASSWORD`.
4. Set `E2E_BASE_URL` to the verified preview or production origin without a trailing slash. For the current release use `https://task-management-dashboard-tau-fawn.vercel.app`.
5. Run **Actions → E2E smoke → Run workflow**. The test creates a uniquely named task and removes it before finishing.

Never use a personal or administrator account. Never commit these values or place them in `.env.example` beyond placeholders.

## Local E2E run

Create an ignored `.env.test.local` file with the same three variable names, ensure the app is available at `E2E_BASE_URL`, then run:

```bash
pnpm test:e2e
```

Playwright uses one Chromium worker and retains traces, screenshots, and video only when a test fails. If credentials are absent, the authenticated lifecycle test is reported as skipped instead of attempting a fake login.

The repository does not install a browser during normal development or CI. Chromium is installed only by the manually dispatched E2E workflow. Until the three E2E secrets and dedicated confirmed user exist, test discovery is verified but the live authenticated lifecycle remains an explicit external prerequisite.
