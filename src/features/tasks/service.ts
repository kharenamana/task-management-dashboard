import "server-only";

import {
  createTaskRow,
  deleteTaskRow,
  getTaskMetricCounts,
  listTaskRows,
  type TaskRow,
  updateTaskRow,
} from "@/features/tasks/repository";
import type { TaskListQuery } from "@/features/tasks/schemas";
import type {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from "@/features/tasks/types";
import { createClient } from "@/lib/supabase/server";

function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    dueDate: row.due_date,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listTasks(userId: string, query: TaskListQuery) {
  const client = await createClient();
  const { rows, total } = await listTaskRows(client, userId, query);
  return {
    tasks: rows.map(toTask),
    meta: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.ceil(total / query.pageSize),
    },
  };
}

export async function createTask(userId: string, input: CreateTaskInput) {
  const client = await createClient();
  return toTask(await createTaskRow(client, userId, input));
}

export async function updateTask(
  userId: string,
  taskId: string,
  input: UpdateTaskInput,
) {
  const client = await createClient();
  return toTask(await updateTaskRow(client, userId, taskId, input));
}

export async function deleteTask(userId: string, taskId: string) {
  const client = await createClient();
  await deleteTaskRow(client, userId, taskId);
}

export async function getTaskMetrics(userId: string, today: string) {
  const client = await createClient();
  return getTaskMetricCounts(client, userId, today);
}
