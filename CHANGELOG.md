# Changelog

## Unreleased

### Fixed

- Corrected optimistic task totals across cached filters and pages, retained deletion context on recoverable failures, sanitized URL filters independently, and refreshed date-sensitive dashboard state after midnight or window focus

### Changed

- Scoped task-query providers and dialogs to the dashboard, narrowed session proxy coverage, reused authenticated Supabase request clients, and consolidated dashboard metrics into one RLS-protected aggregate function

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
