"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { patchTask, postTask, removeTask } from "@/features/tasks/api-client";
import {
  optimisticallyDeleteTask,
  optimisticallyToggleTask,
  type TaskListCache,
} from "@/features/tasks/optimistic-cache";
import { taskKeys } from "@/features/tasks/query-keys";
import type { TaskListQuery } from "@/features/tasks/schemas";
import type {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from "@/features/tasks/types";

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
        queryClient.setQueryData<TaskListCache>(
          key,
          optimisticallyToggleTask(current, cachedQuery, task, optimisticTask),
        );
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
      snapshots.forEach(([key, current]) => {
        if (!current) return;
        const cachedQuery = key[2] as TaskListQuery | undefined;
        queryClient.setQueryData<TaskListCache>(
          key,
          optimisticallyDeleteTask(current, cachedQuery, task),
        );
      });
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
