import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  ListTodo,
} from "lucide-react";

import type { TaskMetrics } from "@/features/tasks/types";

const cards = [
  {
    key: "total",
    label: "Total tasks",
    icon: ListTodo,
    iconClassName: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
  {
    key: "completed",
    label: "Completed",
    icon: CheckCircle2,
    iconClassName: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  {
    key: "pending",
    label: "Pending",
    icon: CircleDashed,
    iconClassName: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  {
    key: "overdue",
    label: "Overdue",
    icon: AlertTriangle,
    iconClassName: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
] as const;

export function MetricCards({
  metrics,
  loading,
}: {
  metrics?: TaskMetrics | undefined;
  loading: boolean;
}) {
  return (
    <section
      aria-label="Task summary"
      aria-busy={loading}
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
    >
      {loading ? (
        <span role="status" className="sr-only">
          Loading task summary…
        </span>
      ) : null}
      {cards.map(({ key, label, icon: Icon, iconClassName }) => (
        <article
          key={key}
          className="border-border bg-card rounded-2xl border p-4 shadow-sm sm:p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-muted-foreground text-sm font-bold">{label}</p>
            <span
              className={`grid size-9 place-items-center rounded-xl ${iconClassName}`}
            >
              <Icon className="size-4" aria-hidden="true" />
            </span>
          </div>
          {loading ? (
            <div
              aria-hidden="true"
              className="bg-foreground/10 mt-4 h-9 w-14 animate-pulse rounded-lg"
            />
          ) : (
            <p className="mt-3 text-3xl font-black tabular-nums">
              {metrics?.[key] ?? 0}
            </p>
          )}
        </article>
      ))}
    </section>
  );
}
