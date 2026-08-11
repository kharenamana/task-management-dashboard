# Task API

All task endpoints are same-origin Next.js Route Handlers. They require a valid Supabase cookie session, validate every HTTP boundary with Zod, execute through the user's Supabase client, and remain subject to task Row Level Security.

## Response shape

Successful responses use `{ "data": ... }`. List responses also include `meta` with `page`, `pageSize`, `total`, and `totalPages`. Errors expose only a stable `code`, a safe `message`, and optional `fieldErrors`; raw Supabase or PostgreSQL errors are never returned.

Authenticated task responses send `Cache-Control: private, no-store`.

## Endpoints

### `GET /api/tasks`

Query parameters:

- `q`: optional case-insensitive title substring, maximum 100 characters
- `status`: `pending`, `in_progress`, or `completed`
- `priority`: `low`, `medium`, or `high`
- `sort`: `due_asc` or `due_desc`; null due dates always sort last
- `page`: positive integer, default `1`
- `pageSize`: integer from 1–100, default `20`

### `POST /api/tasks`

Creates an owned task. Body fields are `title`, `description`, `status`, `priority`, and nullable `dueDate`. The server supplies `user_id`; clients cannot choose task ownership.

### `PATCH /api/tasks/:taskId`

Updates one or more task fields. Setting `status` to `completed` lets the database trigger set `completed_at`; moving away from completed clears it. Missing and non-owned IDs both return `404 TASK_NOT_FOUND`.

### `DELETE /api/tasks/:taskId`

Deletes an owned task. Missing and non-owned IDs return the same safe `404`.

### `GET /api/tasks/metrics?today=YYYY-MM-DD`

Returns `total`, `completed`, `pending`, and `overdue`. Pending includes every non-completed task. Overdue includes non-completed tasks with a due date before the supplied user-local calendar date. The dashboard must send its local date so timezone boundaries are predictable.

## Status codes

- `200`: successful read, update, or delete
- `201`: task created
- `400`: invalid query, JSON, ID, or task fields
- `401`: no valid authenticated session
- `404`: task absent or not owned by the authenticated user
- `500`: sanitized unexpected data-layer failure
