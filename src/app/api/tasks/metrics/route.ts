import { type NextRequest } from "next/server";

import { requireApiUser } from "@/features/auth/api";
import { validationTaskError } from "@/features/tasks/errors";
import { successResponse, taskErrorResponse } from "@/features/tasks/http";
import { metricsQuerySchema } from "@/features/tasks/schemas";
import { getTaskMetrics } from "@/features/tasks/service";

export async function GET(request: NextRequest) {
  const auth = await requireApiUser();
  if (!auth.ok) return auth.response;

  const query = metricsQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  if (!query.success)
    return taskErrorResponse(validationTaskError(query.error));

  try {
    return successResponse(await getTaskMetrics(auth.client, query.data.today));
  } catch (error) {
    return taskErrorResponse(error);
  }
}
