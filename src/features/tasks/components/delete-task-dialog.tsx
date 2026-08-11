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
  const confirm = () => {
    if (!task) return;
    mutation.mutate(task);
    onClose();
  };

  return (
    <AlertDialog.Root
      open={Boolean(task)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm" />
        <AlertDialog.Content className="border-border bg-card fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[1.75rem] border p-6 shadow-2xl sm:p-8">
          <div className="grid size-12 place-items-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-300">
            <Trash2 className="size-6" aria-hidden="true" />
          </div>
          <AlertDialog.Title className="mt-5 text-xl font-black">
            Delete this task?
          </AlertDialog.Title>
          <AlertDialog.Description className="text-muted-foreground mt-2 leading-7">
            “{task?.title}” will be permanently removed. This action cannot be
            undone.
          </AlertDialog.Description>
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                className="border-border hover:bg-muted rounded-xl border px-4 py-2.5 font-bold"
              >
                Keep task
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                type="button"
                onClick={confirm}
                className="rounded-xl bg-rose-600 px-4 py-2.5 font-bold text-white hover:bg-rose-700"
              >
                Delete task
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
