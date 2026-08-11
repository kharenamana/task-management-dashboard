import { type NextRequest } from "next/server";

import { requireApiUser } from "@/features/auth/api";
import { TaskError, validationTaskError } from "@/features/tasks/errors";
import { successResponse, taskErrorResponse } from "@/features/tasks/http";
import { taskIdSchema, updateTaskSchema } from "@/features/tasks/schemas";
import { deleteTask, updateTask } from "@/features/tasks/service";

type RouteContext = { params: Promise<{ taskId: string }> };

async function parseTaskId(context: RouteContext) {
  const { taskId } = await context.params;
  return taskIdSchema.safeParse(taskId);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = await requireApiUser();
  if (!auth.ok) return auth.response;

  const taskId = await parseTaskId(context);
  if (!taskId.success)
    return taskErrorResponse(validationTaskError(taskId.error));

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return taskErrorResponse(
      new TaskError("INVALID_JSON", "Request body must be valid JSON.", 400),
    );
  }

  const parsed = updateTaskSchema.safeParse(input);
  if (!parsed.success)
    return taskErrorResponse(validationTaskError(parsed.error));

  try {
    return successResponse(
      await updateTask(auth.userId, taskId.data, parsed.data),
    );
  } catch (error) {
    return taskErrorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const auth = await requireApiUser();
  if (!auth.ok) return auth.response;

  const taskId = await parseTaskId(context);
  if (!taskId.success)
    return taskErrorResponse(validationTaskError(taskId.error));

  try {
    await deleteTask(auth.userId, taskId.data);
    return successResponse(null);
  } catch (error) {
    return taskErrorResponse(error);
  }
}
