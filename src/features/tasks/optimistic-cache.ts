import type { TaskListQuery } from "@/features/tasks/schemas";
import type {
  ApiSuccessBody,
  PaginationMeta,
  Task,
} from "@/features/tasks/types";

export type TaskListCache = ApiSuccessBody<Task[]>;

function adjustTotal(meta: PaginationMeta | undefined, delta: number) {
  if (!meta || delta === 0) return meta;
  const total = Math.max(0, meta.total + delta);
  return {
    ...meta,
    total,
    totalPages: Math.ceil(total / meta.pageSize),
  };
}

export function taskMatchesQuery(task: Task, query?: TaskListQuery) {
  if (!query) return true;
  if (query.status && task.status !== query.status) return false;
  if (query.priority && task.priority !== query.priority) return false;
  if (query.q && !task.title.toLowerCase().includes(query.q.toLowerCase())) {
    return false;
  }
  return true;
}

export function optimisticallyToggleTask(
  current: TaskListCache,
  query: TaskListQuery | undefined,
  previousTask: Task,
  nextTask: Task,
): TaskListCache {
  const matchedBefore = taskMatchesQuery(previousTask, query);
  const matchesAfter = taskMatchesQuery(nextTask, query);
  const containsTask = current.data.some((item) => item.id === previousTask.id);
  const data = containsTask
    ? current.data
        .map((item) => (item.id === previousTask.id ? nextTask : item))
        .filter((item) => item.id !== previousTask.id || matchesAfter)
    : current.data;
  const delta = Number(matchesAfter) - Number(matchedBefore);
  const meta = adjustTotal(current.meta, delta);

  return {
    ...current,
    data,
    ...(meta ? { meta } : {}),
  };
}

export function optimisticallyDeleteTask(
  current: TaskListCache,
  query: TaskListQuery | undefined,
  task: Task,
): TaskListCache {
  const meta = adjustTotal(
    current.meta,
    taskMatchesQuery(task, query) ? -1 : 0,
  );

  return {
    ...current,
    data: current.data.filter((item) => item.id !== task.id),
    ...(meta ? { meta } : {}),
  };
}
