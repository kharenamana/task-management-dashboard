import { NextResponse } from "next/server";

import { TaskError } from "@/features/tasks/errors";
import type {
  ApiErrorBody,
  ApiSuccessBody,
  PaginationMeta,
} from "@/features/tasks/types";

export function successResponse<T>(
  data: T,
  options?: { status?: number; meta?: PaginationMeta },
) {
  const body: ApiSuccessBody<T> = { data };
  if (options?.meta) body.meta = options.meta;
  return NextResponse.json(body, {
    status: options?.status ?? 200,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export function taskErrorResponse(error: unknown) {
  const safeError =
    error instanceof TaskError
      ? error
      : new TaskError("INTERNAL_ERROR", "An unexpected error occurred.", 500);
  const body: ApiErrorBody = {
    error: {
      code: safeError.code,
      message: safeError.message,
      ...(safeError.fieldErrors ? { fieldErrors: safeError.fieldErrors } : {}),
    },
  };
  return NextResponse.json(body, {
    status: safeError.status,
    headers: { "Cache-Control": "private, no-store" },
  });
}
