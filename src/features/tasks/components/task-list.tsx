import { CalendarDays, Check, Pencil, RotateCcw, Trash2 } from "lucide-react";

import { formatDueDate } from "@/features/tasks/date";
import type { Task } from "@/features/tasks/types";

type TaskListProps = {
  tasks: Task[];
  today: string;
  togglingId?: string | undefined;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

const statusStyles = {
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  in_progress: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};
const priorityStyles = {
  low: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  medium: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  high: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

function label(value: string) {
  return value
    .replace("_", " ")
    .replace(/^./u, (character) => character.toUpperCase());
}

function DueDate({ task, today }: { task: Task; today: string }) {
  const overdue = Boolean(
    task.dueDate && task.dueDate < today && task.status !== "completed",
  );
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm ${overdue ? "font-bold text-rose-600 dark:text-rose-300" : "text-muted-foreground"}`}
    >
      <CalendarDays className="size-4" aria-hidden="true" />
      {formatDueDate(task.dueDate)}
      {overdue ? " · Overdue" : ""}
    </span>
  );
}

function TaskActions({
  task,
  togglingId,
  onToggle,
  onEdit,
  onDelete,
}: Omit<TaskListProps, "tasks" | "today"> & { task: Task }) {
  const completed = task.status === "completed";
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        disabled={togglingId === task.id}
        onClick={() => onToggle(task)}
        aria-label={
          completed ? `Reopen ${task.title}` : `Complete ${task.title}`
        }
        className="hover:bg-muted grid size-9 place-items-center rounded-lg transition disabled:opacity-50"
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
        className="hover:bg-muted grid size-9 place-items-center rounded-lg transition"
      >
        <Pencil className="size-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(task)}
        aria-label={`Delete ${task.title}`}
        className="grid size-9 place-items-center rounded-lg text-rose-600 transition hover:bg-rose-500/10 dark:text-rose-300"
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
    <section aria-label="Tasks">
      <div className="border-border bg-card hidden overflow-hidden rounded-2xl border shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
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
                <tr key={task.id} className="hover:bg-muted/35 transition">
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
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[task.status]}`}
                    >
                      {label(task.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${priorityStyles[task.priority]}`}
                    >
                      {label(task.priority)}
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
                <h2
                  className={`font-extrabold break-words ${task.status === "completed" ? "text-muted-foreground line-through" : ""}`}
                >
                  {task.title}
                </h2>
                {task.description ? (
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-6">
                    {task.description}
                  </p>
                ) : null}
              </div>
              <TaskActions task={task} {...actionProps} />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[task.status]}`}
              >
                {label(task.status)}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${priorityStyles[task.priority]}`}
              >
                {label(task.priority)}
              </span>
            </div>
            <div className="border-border mt-4 border-t pt-3">
              <DueDate task={task} today={today} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
