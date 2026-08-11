import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { taskDataError, taskNotFoundError } from "@/features/tasks/errors";
import type { TaskListQuery } from "@/features/tasks/schemas";
import type { CreateTaskInput, UpdateTaskInput } from "@/features/tasks/types";
import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.generated";

export type TaskRow = Tables<"tasks">;
type TaskInsert = TablesInsert<"tasks">;
type TaskUpdate = TablesUpdate<"tasks">;
type Client = SupabaseClient<Database>;

function escapeLikePattern(value: string) {
  return value.replace(/[\\%_]/gu, "\\$&");
}

export async function listTaskRows(
  client: Client,
  userId: string,
  query: TaskListQuery,
) {
  const from = (query.page - 1) * query.pageSize;
  const to = from + query.pageSize - 1;
  let request = client
    .from("tasks")
    .select("*", { count: "exact" })
    .eq("user_id", userId);

  if (query.q)
    request = request.ilike("title", `%${escapeLikePattern(query.q)}%`);
  if (query.status) request = request.eq("status", query.status);
  if (query.priority) request = request.eq("priority", query.priority);

  const { data, error, count } = await request
    .order("due_date", {
      ascending: query.sort === "due_asc",
      nullsFirst: false,
    })
    .order("id", { ascending: true })
    .range(from, to);

  if (error) throw taskDataError();
  return { rows: data, total: count ?? 0 };
}

export async function createTaskRow(
  client: Client,
  userId: string,
  input: CreateTaskInput,
) {
  const insert: TaskInsert = {
    user_id: userId,
    title: input.title,
    description: input.description,
    status: input.status,
    priority: input.priority,
    due_date: input.dueDate,
  };
  const { data, error } = await client
    .from("tasks")
    .insert(insert)
    .select("*")
    .single();
  if (error || !data) throw taskDataError();
  return data;
}

export async function updateTaskRow(
  client: Client,
  userId: string,
  taskId: string,
  input: UpdateTaskInput,
) {
  const update: TaskUpdate = {
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.description !== undefined
      ? { description: input.description }
      : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(input.priority !== undefined ? { priority: input.priority } : {}),
    ...(input.dueDate !== undefined ? { due_date: input.dueDate } : {}),
  };
  const { data, error } = await client
    .from("tasks")
    .update(update)
    .eq("id", taskId)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();
  if (error) throw taskDataError();
  if (!data) throw taskNotFoundError();
  return data;
}

export async function deleteTaskRow(
  client: Client,
  userId: string,
  taskId: string,
) {
  const { data, error } = await client
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();
  if (error) throw taskDataError();
  if (!data) throw taskNotFoundError();
}

export async function getTaskMetricCounts(
  client: Client,
  userId: string,
  today: string,
) {
  const results = await Promise.all([
    client
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    client
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "completed"),
    client
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .neq("status", "completed"),
    client
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .neq("status", "completed")
      .lt("due_date", today),
  ]);
  if (results.some((result) => result.error)) throw taskDataError();
  return {
    total: results[0].count ?? 0,
    completed: results[1].count ?? 0,
    pending: results[2].count ?? 0,
    overdue: results[3].count ?? 0,
  };
}
