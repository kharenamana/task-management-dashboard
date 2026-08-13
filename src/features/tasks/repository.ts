import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { taskDataError, taskNotFoundError } from "@/features/tasks/errors";
import type {
  TaskListQuery,
  TaskSuggestionQuery,
} from "@/features/tasks/schemas";
import type { CreateTaskInput, UpdateTaskInput } from "@/features/tasks/types";
import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.generated";

export type TaskRow = Omit<Tables<"tasks">, "user_id">;
export type TaskTitleRow = Pick<Tables<"tasks">, "title">;
type TaskInsert = TablesInsert<"tasks">;
type TaskUpdate = TablesUpdate<"tasks">;
type Client = SupabaseClient<Database>;

const taskColumns =
  "id,title,description,status,priority,due_date,completed_at,created_at,updated_at";

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
    .select(taskColumns, { count: "exact" })
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

export async function listTaskTitleRows(
  client: Client,
  userId: string,
  query: TaskSuggestionQuery,
) {
  let request = client
    .from("tasks")
    .select("title")
    .eq("user_id", userId)
    .ilike("title", `%${escapeLikePattern(query.q)}%`);

  if (query.status) request = request.eq("status", query.status);
  if (query.priority) request = request.eq("priority", query.priority);

  const { data, error } = await request
    .order("title", { ascending: true })
    .limit(query.limit * 3);
  if (error) throw taskDataError();
  return (data ?? []) satisfies TaskTitleRow[];
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
    .select(taskColumns)
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
    .select(taskColumns)
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

export async function getTaskMetricCounts(client: Client, today: string) {
  const { data, error } = await client
    .rpc("get_task_metrics", { p_today: today })
    .single();
  if (error || !data) throw taskDataError();
  return data;
}
