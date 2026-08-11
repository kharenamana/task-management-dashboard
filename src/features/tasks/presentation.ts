import { taskPriorities, taskStatuses } from "@/features/tasks/schemas";
import type { TaskPriority, TaskStatus } from "@/features/tasks/types";

export const taskStatusLabels = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
} satisfies Record<TaskStatus, string>;

export const taskPriorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
} satisfies Record<TaskPriority, string>;

export const taskStatusStyles = {
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  in_progress: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
} satisfies Record<TaskStatus, string>;

export const taskPriorityStyles = {
  low: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  medium: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  high: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
} satisfies Record<TaskPriority, string>;

export const taskStatusOptions = taskStatuses.map((value) => ({
  value,
  label: taskStatusLabels[value],
}));

export const taskPriorityOptions = taskPriorities.map((value) => ({
  value,
  label: taskPriorityLabels[value],
}));
