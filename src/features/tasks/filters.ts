import {
  taskListQuerySchema,
  type TaskListQuery,
} from "@/features/tasks/schemas";

export const defaultTaskQuery = taskListQuerySchema.parse({});

export function taskQueryFromRecord(
  values: Record<string, string | string[] | undefined>,
): TaskListQuery {
  const normalized = Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ]),
  );
  const sanitized: Record<string, unknown> = {};
  for (const key of [
    "q",
    "status",
    "priority",
    "sort",
    "page",
    "pageSize",
  ] as const) {
    const parsed = taskListQuerySchema.shape[key].safeParse(normalized[key]);
    if (parsed.success) sanitized[key] = parsed.data;
  }

  return taskListQuerySchema.parse(sanitized);
}
