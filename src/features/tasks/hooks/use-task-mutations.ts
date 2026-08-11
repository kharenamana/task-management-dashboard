"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { patchTask, postTask, removeTask } from "@/features/tasks/api-client";
import { taskKeys } from "@/features/tasks/query-keys";
import type { TaskListQuery } from "@/features/tasks/schemas";
import type {
  ApiSuccessBody,
  CreateTaskInput,
  PaginationMeta,
  Task,
  UpdateTaskInput,
} from "@/features/tasks/types";

type TaskListCache = ApiSuccessBody<Task[]>;

function decrementTotal(meta: PaginationMeta | undefined) {
  if (!meta) return undefined;
  const total = Math.max(0, meta.total - 1);
  return {
    ...meta,
    total,
    totalPages: Math.ceil(total / meta.pageSize),
  };
}

function matchesQuery(task: Task, query: TaskListQuery) {
  if (query.status && task.status !== query.status) return false;
  if (query.priority && task.priority !== query.priority) return false;
  if (query.q && !task.title.toLowerCase().includes(query.q.toLowerCase())) {
    return false;
  }
  return true;
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTaskInput) => postTask(input),
    onSuccess: async () => {
      toast.success("Task created");
      await queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      input,
    }: {
      taskId: string;
      input: UpdateTaskInput;
    }) => patchTask(taskId, input),
    onSuccess: async () => {
      toast.success("Task updated");
      await queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useToggleTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (task: Task) =>
      patchTask(task.id, {
        status: task.status === "completed" ? "pending" : "completed",
      }),
    onMutate: async (task) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const snapshots = queryClient.getQueriesData<TaskListCache>({
        queryKey: taskKeys.lists(),
      });
      const completed = task.status !== "completed";
      const optimisticTask: Task = {
        ...task,
        status: completed ? "completed" : "pending",
        completedAt: completed ? new Date().toISOString() : null,
      };
      snapshots.forEach(([key, current]) => {
        if (!current) return;
        const cachedQuery = key[2] as TaskListQuery | undefined;
        const containedTask = current.data.some((item) => item.id === task.id);
        const keepTask =
          !cachedQuery || matchesQuery(optimisticTask, cachedQuery);
        const data = current.data
          .map((item) => (item.id === task.id ? optimisticTask : item))
          .filter((item) => item.id !== task.id || keepTask);
        const meta =
          containedTask && !keepTask
            ? decrementTotal(current.meta)
            : current.meta;
        queryClient.setQueryData<TaskListCache>(key, {
          ...current,
          data,
          ...(meta ? { meta } : {}),
        });
      });
      return { snapshots };
    },
    onError: (error: Error, _task, context) => {
      context?.snapshots.forEach(([key, value]) =>
        queryClient.setQueryData(key, value),
      );
      toast.error(error.message);
    },
    onSuccess: (_data, task) =>
      toast.success(
        task.status === "completed" ? "Task reopened" : "Task completed",
      ),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (task: Task) => removeTask(task.id),
    onMutate: async (task) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const snapshots = queryClient.getQueriesData<TaskListCache>({
        queryKey: taskKeys.lists(),
      });
      queryClient.setQueriesData<TaskListCache>(
        { queryKey: taskKeys.lists() },
        (current) =>
          current
            ? {
                ...current,
                data: current.data.filter((item) => item.id !== task.id),
                ...(current.meta
                  ? { meta: decrementTotal(current.meta)! }
                  : {}),
              }
            : current,
      );
      return { snapshots };
    },
    onError: (error: Error, _task, context) => {
      context?.snapshots.forEach(([key, value]) =>
        queryClient.setQueryData(key, value),
      );
      toast.error(error.message);
    },
    onSuccess: () => toast.success("Task deleted"),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}
