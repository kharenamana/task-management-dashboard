import { type NextRequest } from "next/server";

import { requireApiUser } from "@/features/auth/api";
import { validationTaskError } from "@/features/tasks/errors";
import { successResponse, taskErrorResponse } from "@/features/tasks/http";
import { taskSuggestionQuerySchema } from "@/features/tasks/schemas";
import { listTaskSuggestions } from "@/features/tasks/service";

export async function GET(request: NextRequest) {
  const auth = await requireApiUser();
  if (!auth.ok) return auth.response;

  const query = taskSuggestionQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  if (!query.success)
    return taskErrorResponse(validationTaskError(query.error));

  try {
    return successResponse(
      await listTaskSuggestions(auth.client, auth.userId, query.data),
    );
  } catch (error) {
    return taskErrorResponse(error);
  }
}
