"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Trash2 } from "lucide-react";

import { useDeleteTask } from "@/features/tasks/hooks/use-task-mutations";
import type { Task } from "@/features/tasks/types";

export function DeleteTaskDialog({
  task,
  onClose,
}: {
  task: Task | null;
  onClose: () => void;
}) {
  const mutation = useDeleteTask();
  const confirm = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!task) return;
    try {
      await mutation.mutateAsync(task);
      onClose();
    } catch {
      // The mutation owns the sanitized error state and toast feedback.
    }
  };

  return (
    <AlertDialog.Root
      open={Boolean(task)}
      onOpenChange={(open) => {
        if (!open && !mutation.isPending) {
          mutation.reset();
          onClose();
        }
      }}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="dialog-overlay fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm" />
        <AlertDialog.Content
          aria-busy={mutation.isPending}
          className="dialog-content border-border bg-card fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[1.75rem] border p-6 shadow-2xl sm:p-8"
        >
          <div className="bg-danger/10 text-danger grid size-12 place-items-center rounded-2xl">
            <Trash2 className="size-6" aria-hidden="true" />
          </div>
          <AlertDialog.Title className="mt-5 text-xl font-black">
            Delete this task?
          </AlertDialog.Title>
          <AlertDialog.Description className="text-muted-foreground mt-2 leading-7">
            “{task?.title}” will be permanently removed. This action cannot be
            undone.
          </AlertDialog.Description>
          {mutation.isError ? (
            <p
              role="alert"
              className="bg-danger/10 text-danger mt-4 rounded-xl px-3 py-2 text-sm font-semibold"
            >
              {mutation.error.message}
            </p>
          ) : null}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                disabled={mutation.isPending}
                className="border-border hover:bg-muted min-h-11 rounded-xl border px-4 font-bold"
              >
                Keep task
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                type="button"
                onClick={confirm}
                disabled={mutation.isPending}
                className="min-h-11 rounded-xl bg-rose-600 px-4 font-bold text-white hover:bg-rose-700 disabled:cursor-wait disabled:opacity-65"
              >
                {mutation.isPending ? "Deleting…" : "Delete task"}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
