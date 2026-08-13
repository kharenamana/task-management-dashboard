"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { getTaskSuggestions } from "@/features/tasks/api-client";
import { taskKeys } from "@/features/tasks/query-keys";
import type { TaskSuggestionQuery } from "@/features/tasks/schemas";
import type { TaskPriority, TaskStatus } from "@/features/tasks/types";

type SuggestionFilters = {
  q: string;
  status?: TaskStatus | undefined;
  priority?: TaskPriority | undefined;
};

export function useTaskSuggestions(filters: SuggestionFilters) {
  const normalizedSearch = filters.q.trim();
  const [debouncedSearch, setDebouncedSearch] = useState(normalizedSearch);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedSearch(normalizedSearch),
      250,
    );
    return () => window.clearTimeout(timeout);
  }, [normalizedSearch]);

  const query = useMemo<TaskSuggestionQuery>(
    () => ({
      q: debouncedSearch,
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.priority ? { priority: filters.priority } : {}),
      limit: 6,
    }),
    [debouncedSearch, filters.priority, filters.status],
  );
  const enabled = debouncedSearch.length >= 2;
  const result = useQuery({
    queryKey: taskKeys.suggestions(query),
    queryFn: ({ signal }) => getTaskSuggestions(query, signal),
    enabled,
    staleTime: 30_000,
    retry: 1,
  });
  const isCurrent = debouncedSearch === normalizedSearch;

  return {
    suggestions: isCurrent ? (result.data?.data ?? []) : [],
    state:
      normalizedSearch.length < 2
        ? ("idle" as const)
        : !isCurrent || result.isPending || result.isFetching
          ? ("loading" as const)
          : result.isError
            ? ("error" as const)
            : ("success" as const),
  };
}
