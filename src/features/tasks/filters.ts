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
  const parsed = taskListQuerySchema.safeParse(normalized);
  return parsed.success ? parsed.data : defaultTaskQuery;
}
