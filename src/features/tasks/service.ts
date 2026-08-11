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
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.generated";

type Client = SupabaseClient<Database>;

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

export async function listTasks(
  client: Client,
  userId: string,
  query: TaskListQuery,
) {
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

export async function createTask(
  client: Client,
  userId: string,
  input: CreateTaskInput,
) {
  return toTask(await createTaskRow(client, userId, input));
}

export async function updateTask(
  client: Client,
  userId: string,
  taskId: string,
  input: UpdateTaskInput,
) {
  return toTask(await updateTaskRow(client, userId, taskId, input));
}

export async function deleteTask(
  client: Client,
  userId: string,
  taskId: string,
) {
  await deleteTaskRow(client, userId, taskId);
}

export async function getTaskMetrics(client: Client, today: string) {
  return getTaskMetricCounts(client, today);
}
