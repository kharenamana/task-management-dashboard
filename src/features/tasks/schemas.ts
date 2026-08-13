import { z } from "zod";

export const taskStatuses = ["pending", "in_progress", "completed"] as const;
export const taskPriorities = ["low", "medium", "high"] as const;
export const taskSorts = ["due_asc", "due_desc"] as const;

export const taskStatusSchema = z.enum(taskStatuses);
export const taskPrioritySchema = z.enum(taskPriorities);
export const taskSortSchema = z.enum(taskSorts);

function isCalendarDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(value);
  if (!match) return false;
  const [, year, month, day] = match;
  const candidate = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  );
  return (
    candidate.getUTCFullYear() === Number(year) &&
    candidate.getUTCMonth() + 1 === Number(month) &&
    candidate.getUTCDate() === Number(day)
  );
}

export const calendarDateSchema = z
  .string()
  .refine(isCalendarDate, "Enter a valid calendar date.");

const titleSchema = z
  .string()
  .trim()
  .min(1, "Enter a task title.")
  .max(160, "Keep the title under 160 characters.");

const descriptionSchema = z
  .string()
  .trim()
  .max(5000, "Keep the description under 5,000 characters.");

export const createTaskSchema = z
  .object({
    title: titleSchema,
    description: descriptionSchema.default(""),
    status: taskStatusSchema.default("pending"),
    priority: taskPrioritySchema.default("medium"),
    dueDate: z.union([calendarDateSchema, z.null()]).default(null),
  })
  .strict();

export const updateTaskSchema = z
  .strictObject({
    title: titleSchema.optional(),
    description: descriptionSchema.optional(),
    status: taskStatusSchema.optional(),
    priority: taskPrioritySchema.optional(),
    dueDate: z.union([calendarDateSchema, z.null()]).optional(),
  })
  .refine(
    (values) => Object.values(values).some((value) => value !== undefined),
    {
      message: "Provide at least one task field to update.",
    },
  );

export const taskIdSchema = z.uuid("Task ID must be a valid UUID.");

const optionalFilter = <T extends readonly [string, ...string[]]>(values: T) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(values).optional(),
  );

export const taskListQuerySchema = z.object({
  q: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().max(100, "Keep search under 100 characters.").optional(),
  ),
  status: optionalFilter(taskStatuses),
  priority: optionalFilter(taskPriorities),
  sort: taskSortSchema.default("due_asc"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const taskSuggestionQuerySchema = z.object({
  q: z
    .string()
    .trim()
    .min(2, "Enter at least 2 characters for suggestions.")
    .max(100, "Keep search under 100 characters."),
  status: optionalFilter(taskStatuses),
  priority: optionalFilter(taskPriorities),
  limit: z.coerce.number().int().min(1).max(6).default(6),
});

export const metricsQuerySchema = z.object({
  today: calendarDateSchema,
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskListQuery = z.infer<typeof taskListQuerySchema>;
export type TaskSuggestionQuery = z.infer<typeof taskSuggestionQuerySchema>;
