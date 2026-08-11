# Changelog

## Unreleased

### Fixed

- Corrected optimistic task totals across cached filters and pages, retained deletion context on recoverable failures, sanitized URL filters independently, and refreshed date-sensitive dashboard state after midnight or window focus

### Changed

- Scoped task-query providers and dialogs to the dashboard, narrowed session proxy coverage, reused authenticated Supabase request clients, and consolidated dashboard metrics into one RLS-protected aggregate function
- Refined dashboard hierarchy with search-first controls, removable filter chips, neutral metrics, larger action targets, focused pagination, and protected dirty forms

### Added

- Added seven static public case-study routes with unique canonical, Open Graph, and Twitter metadata
- Added sitemap, robots policy, web manifest, generated icons/social image, crawlable navigation, and content-matched structured data
- Added named forms, consistent skip targets, semantic table/action labels, reduced-motion behavior, and focused axe Playwright checks
- Added a dependency-free bundle-analysis command and a browser assertion that the landing page makes no Supabase runtime request

### Verification

- Re-ran the hosted six-assertion RLS test, Supabase advisors, formatting, lint, strict typecheck, 69 unit/component tests, the production build, and the credential-free Playwright release checks
- Authenticated dashboard accessibility and task-lifecycle checks remain gated on the documented dedicated confirmed E2E account

## 0.1.0 - 2026-08-11

### Added

- Colorful public landing page and responsive authenticated task dashboard
- Supabase email/password authentication, verification, logout, and recovery flows
- Validated owner-scoped task CRUD, completion, search, filters, due-date sorting, pagination, and metrics
- Light/dark/system themes, accessible dialogs and forms, loading/error/empty/404 states, and URL-synced controls
- Vitest/React Testing Library coverage, focused Playwright lifecycle smoke test, and GitHub Actions workflows
- Architecture, API, database, security, testing, deployment, and troubleshooting documentation

### Security

- SSR-compatible cookie sessions with independent server checks and PostgreSQL RLS
- Explicit ownership policies, database constraints, sanitized API errors, safe redirect handling, and security headers
- Transactional two-user ownership verification passed against the hosted database

### Operations

- Vercel-ready configuration and Git-linked preview workflow
- Production Supabase Auth URLs and Vercel environment names documented
- Canonical production deployment at `task-management-dashboard-tau-fawn.vercel.app`
