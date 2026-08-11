"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { LoaderCircle, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import {
  FieldError,
  inputClassName,
} from "@/features/auth/components/form-controls";
import {
  useCreateTask,
  useUpdateTask,
} from "@/features/tasks/hooks/use-task-mutations";
import { createTaskSchema } from "@/features/tasks/schemas";
import type { CreateTaskInput, Task } from "@/features/tasks/types";

type TaskFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
};

type TaskFormInput = z.input<typeof createTaskSchema>;

const defaultValues: CreateTaskInput = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  dueDate: null,
};

export function TaskFormDialog({
  open,
  onOpenChange,
  task,
}: TaskFormDialogProps) {
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const [submitError, setSubmitError] = useState<string>();
  const initialValues: CreateTaskInput = task
    ? {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
      }
    : defaultValues;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormInput, unknown, CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: initialValues,
  });

  const pending = createMutation.isPending || updateMutation.isPending;
  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(undefined);
    try {
      if (task) {
        await updateMutation.mutateAsync({ taskId: task.id, input: values });
      } else {
        await createMutation.mutateAsync(values);
      }
      onOpenChange(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to save task.",
      );
    }
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm" />
        <Dialog.Content className="border-border bg-card fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[1.75rem] border p-6 shadow-2xl sm:p-8">
          <div className="pr-10">
            <Dialog.Title className="text-2xl font-black">
              {task ? "Edit task" : "Create a task"}
            </Dialog.Title>
            <Dialog.Description className="text-muted-foreground mt-2">
              {task
                ? "Update the details and keep your plan accurate."
                : "Capture the outcome, priority, and timing in one place."}
            </Dialog.Description>
          </div>
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close task form"
              className="hover:bg-muted absolute top-5 right-5 grid size-9 place-items-center rounded-xl transition"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </Dialog.Close>

          <form onSubmit={onSubmit} noValidate className="mt-7 space-y-5">
            {submitError ? (
              <p
                role="alert"
                className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-3.5 py-3 text-sm font-semibold text-rose-700 dark:text-rose-300"
              >
                {submitError}
              </p>
            ) : null}
            <div>
              <label htmlFor="task-title" className="text-sm font-bold">
                Title
              </label>
              <input
                id="task-title"
                autoFocus
                maxLength={160}
                className={inputClassName}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "task-title-error" : undefined}
                {...register("title")}
              />
              <FieldError
                id="task-title-error"
                message={errors.title?.message}
              />
            </div>
            <div>
              <label htmlFor="task-description" className="text-sm font-bold">
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <textarea
                id="task-description"
                rows={4}
                maxLength={5000}
                className={`${inputClassName} resize-y`}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={
                  errors.description ? "task-description-error" : undefined
                }
                {...register("description")}
              />
              <FieldError
                id="task-description-error"
                message={errors.description?.message}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="task-status" className="text-sm font-bold">
                  Status
                </label>
                <select
                  id="task-status"
                  className={inputClassName}
                  {...register("status")}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label htmlFor="task-priority" className="text-sm font-bold">
                  Priority
                </label>
                <select
                  id="task-priority"
                  className={inputClassName}
                  {...register("priority")}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="task-due-date" className="text-sm font-bold">
                Due date{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <input
                id="task-due-date"
                type="date"
                className={inputClassName}
                aria-invalid={Boolean(errors.dueDate)}
                aria-describedby={
                  errors.dueDate ? "task-due-date-error" : undefined
                }
                {...register("dueDate", {
                  setValueAs: (value: string) => value || null,
                })}
              />
              <FieldError
                id="task-due-date-error"
                message={errors.dueDate?.message}
              />
            </div>
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={pending}
                  className="border-border hover:bg-muted rounded-xl border px-4 py-2.5 font-bold"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2.5 font-bold text-white disabled:cursor-not-allowed disabled:opacity-65"
              >
                {pending ? (
                  <LoaderCircle
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : null}
                {pending ? "Saving…" : task ? "Save changes" : "Create task"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
