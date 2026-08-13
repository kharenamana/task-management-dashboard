import type {
  TaskListQuery,
  TaskSuggestionQuery,
} from "@/features/tasks/schemas";
import type {
  ApiErrorBody,
  ApiSuccessBody,
  CreateTaskInput,
  Task,
  TaskMetrics,
  TaskSuggestion,
  UpdateTaskInput,
} from "@/features/tasks/types";

export class TaskApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "TaskApiError";
  }
}

async function request<T>(url: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(url, {
    ...init,
    headers,
  });

  let body: ApiSuccessBody<T> | ApiErrorBody;
  try {
    body = (await response.json()) as ApiSuccessBody<T> | ApiErrorBody;
  } catch {
    throw new TaskApiError(
      "INVALID_RESPONSE",
      "The server returned an unreadable response.",
    );
  }
  if (!response.ok || "error" in body) {
    const error = "error" in body ? body.error : null;
    throw new TaskApiError(
      error?.code ?? "REQUEST_FAILED",
      error?.message ?? "Request failed.",
      error?.fieldErrors,
    );
  }
  return body;
}

export function getTasks(query: TaskListQuery, signal?: AbortSignal) {
  const parameters = new URLSearchParams({
    sort: query.sort,
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
  if (query.q) parameters.set("q", query.q);
  if (query.status) parameters.set("status", query.status);
  if (query.priority) parameters.set("priority", query.priority);
  return request<Task[]>(
    `/api/tasks?${parameters}`,
    signal ? { signal } : undefined,
  );
}

export function getTaskSuggestions(
  query: TaskSuggestionQuery,
  signal?: AbortSignal,
) {
  const parameters = new URLSearchParams({
    q: query.q,
    limit: String(query.limit),
  });
  if (query.status) parameters.set("status", query.status);
  if (query.priority) parameters.set("priority", query.priority);
  return request<TaskSuggestion[]>(
    `/api/tasks/suggestions?${parameters}`,
    signal ? { signal } : undefined,
  );
}

export function postTask(input: CreateTaskInput) {
  return request<Task>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function patchTask(taskId: string, input: UpdateTaskInput) {
  return request<Task>(`/api/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function removeTask(taskId: string) {
  return request<null>(`/api/tasks/${taskId}`, { method: "DELETE" });
}

export function getTaskMetrics(today: string) {
  const parameters = new URLSearchParams({ today });
  return request<TaskMetrics>(`/api/tasks/metrics?${parameters}`);
}
