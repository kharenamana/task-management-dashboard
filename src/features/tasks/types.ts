import type { z } from "zod";

import type {
  createTaskSchema,
  taskPrioritySchema,
  taskSortSchema,
  taskStatusSchema,
  updateTaskSchema,
} from "@/features/tasks/schemas";

export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type TaskPriority = z.infer<typeof taskPrioritySchema>;
export type TaskSort = z.infer<typeof taskSortSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TaskMetrics = {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
};

export type TaskSuggestion = {
  title: string;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string>;
  };
};

export type ApiSuccessBody<T> = {
  data: T;
  meta?: PaginationMeta;
};
