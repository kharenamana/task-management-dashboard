import type { ZodError } from "zod";

export class TaskError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "TaskError";
  }
}

export function validationTaskError(error: ZodError) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path.join(".") || "root";
    fieldErrors[field] ??= issue.message;
  }
  return new TaskError(
    "VALIDATION_ERROR",
    "Check the submitted values and try again.",
    400,
    fieldErrors,
  );
}

export const taskNotFoundError = () =>
  new TaskError("TASK_NOT_FOUND", "Task not found.", 404);

export const taskDataError = () =>
  new TaskError(
    "TASK_DATA_ERROR",
    "Task data is temporarily unavailable.",
    500,
  );
