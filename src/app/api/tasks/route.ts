import { type NextRequest } from "next/server";

import { requireApiUser } from "@/features/auth/api";
import { TaskError, validationTaskError } from "@/features/tasks/errors";
import { successResponse, taskErrorResponse } from "@/features/tasks/http";
import {
  createTaskSchema,
  taskListQuerySchema,
} from "@/features/tasks/schemas";
import { createTask, listTasks } from "@/features/tasks/service";

export async function GET(request: NextRequest) {
  const auth = await requireApiUser();
  if (!auth.ok) return auth.response;

  const query = taskListQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  if (!query.success)
    return taskErrorResponse(validationTaskError(query.error));

  try {
    const result = await listTasks(auth.client, auth.userId, query.data);
    return successResponse(result.tasks, { meta: result.meta });
  } catch (error) {
    return taskErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireApiUser();
  if (!auth.ok) return auth.response;

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return taskErrorResponse(
      new TaskError("INVALID_JSON", "Request body must be valid JSON.", 400),
    );
  }

  const parsed = createTaskSchema.safeParse(input);
  if (!parsed.success)
    return taskErrorResponse(validationTaskError(parsed.error));

  try {
    return successResponse(
      await createTask(auth.client, auth.userId, parsed.data),
      { status: 201 },
    );
  } catch (error) {
    return taskErrorResponse(error);
  }
}
