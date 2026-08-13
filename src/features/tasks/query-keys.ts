import type {
  TaskListQuery,
  TaskSuggestionQuery,
} from "@/features/tasks/schemas";

export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (query: TaskListQuery) => [...taskKeys.lists(), query] as const,
  suggestions: (query: TaskSuggestionQuery) =>
    [...taskKeys.all, "suggestions", query] as const,
  metrics: (today: string) => [...taskKeys.all, "metrics", today] as const,
};
