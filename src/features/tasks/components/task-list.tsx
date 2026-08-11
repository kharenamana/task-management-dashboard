import { CalendarDays, Check, Pencil, RotateCcw, Trash2 } from "lucide-react";

import { formatDueDate } from "@/features/tasks/date";
import {
  taskPriorityLabels,
  taskPriorityStyles,
  taskStatusLabels,
  taskStatusStyles,
} from "@/features/tasks/presentation";
import type { Task } from "@/features/tasks/types";

type TaskListProps = {
  tasks: Task[];
  today: string;
  togglingId?: string | undefined;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

function DueDate({ task, today }: { task: Task; today: string }) {
  const overdue = Boolean(
    task.dueDate && task.dueDate < today && task.status !== "completed",
  );
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm ${overdue ? "text-danger font-bold" : "text-muted-foreground"}`}
    >
      <CalendarDays className="size-4" aria-hidden="true" />
      {formatDueDate(task.dueDate)}
      {overdue ? " · Overdue" : ""}
    </span>
  );
}

type TaskActionsProps = {
  task: Task;
  togglingId?: string | undefined;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

function TaskActions({
  task,
  togglingId,
  onToggle,
  onEdit,
  onDelete,
}: TaskActionsProps) {
  const completed = task.status === "completed";
  return (
    <div
      role="group"
      aria-label={`Actions for ${task.title}`}
      className="flex items-center justify-end gap-1"
    >
      <button
        type="button"
        disabled={togglingId === task.id}
        onClick={() => onToggle(task)}
        aria-label={
          completed ? `Reopen ${task.title}` : `Complete ${task.title}`
        }
        className="hover:bg-muted grid size-11 place-items-center rounded-xl transition disabled:opacity-50"
      >
        {completed ? (
          <RotateCcw className="size-4" aria-hidden="true" />
        ) : (
          <Check className="size-4" aria-hidden="true" />
        )}
      </button>
      <button
        type="button"
        onClick={() => onEdit(task)}
        aria-label={`Edit ${task.title}`}
        className="hover:bg-muted grid size-11 place-items-center rounded-xl transition"
      >
        <Pencil className="size-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(task)}
        aria-label={`Delete ${task.title}`}
        className="text-danger hover:bg-danger/10 grid size-11 place-items-center rounded-xl transition"
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function TaskList(props: TaskListProps) {
  const { tasks, today, togglingId, onToggle, onEdit, onDelete } = props;
  const actionProps = { togglingId, onToggle, onEdit, onDelete };
  return (
    <div>
      <div className="border-border bg-card hidden overflow-hidden rounded-2xl border shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <caption className="sr-only">
              Tasks with status, priority, due date, and available actions
            </caption>
            <thead className="bg-muted/70 text-muted-foreground text-xs tracking-wide uppercase">
              <tr>
                <th scope="col" className="px-5 py-3">
                  Task
                </th>
                <th scope="col" className="px-4 py-3">
                  Status
                </th>
                <th scope="col" className="px-4 py-3">
                  Priority
                </th>
                <th scope="col" className="px-4 py-3">
                  Due
                </th>
                <th scope="col" className="px-5 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-muted/35 transition-colors"
                >
                  <td className="max-w-md px-5 py-4">
                    <p
                      className={`font-bold ${task.status === "completed" ? "text-muted-foreground line-through" : ""}`}
                    >
                      {task.title}
                    </p>
                    {task.description ? (
                      <p className="text-muted-foreground mt-1 line-clamp-1 text-sm">
                        {task.description}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${taskStatusStyles[task.status]}`}
                    >
                      {taskStatusLabels[task.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${taskPriorityStyles[task.priority]}`}
                    >
                      {taskPriorityLabels[task.priority]}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <DueDate task={task} today={today} />
                  </td>
                  <td className="px-5 py-4">
                    <TaskActions task={task} {...actionProps} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {tasks.map((task) => (
          <article
            key={task.id}
            className="border-border bg-card rounded-2xl border p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3
                  className={`font-extrabold break-words ${task.status === "completed" ? "text-muted-foreground line-through" : ""}`}
                >
                  {task.title}
                </h3>
                {task.description ? (
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-6">
                    {task.description}
                  </p>
                ) : null}
              </div>
              <div className="shrink-0">
                <TaskActions task={task} {...actionProps} />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${taskStatusStyles[task.status]}`}
              >
                {taskStatusLabels[task.status]}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${taskPriorityStyles[task.priority]}`}
              >
                {taskPriorityLabels[task.priority]}
              </span>
            </div>
            <div className="border-border mt-4 border-t pt-3">
              <DueDate task={task} today={today} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
