"use client";

import { useQuery } from "@tanstack/react-query";

import { getTaskMetrics, getTasks } from "@/features/tasks/api-client";
import { taskKeys } from "@/features/tasks/query-keys";
import type { TaskListQuery } from "@/features/tasks/schemas";

export function useTasks(query: TaskListQuery) {
  return useQuery({
    queryKey: taskKeys.list(query),
    queryFn: ({ signal }) => getTasks(query, signal),
  });
}

export function useTaskMetrics(today: string) {
  return useQuery({
    queryKey: taskKeys.metrics(today),
    queryFn: () => getTaskMetrics(today),
  });
}
