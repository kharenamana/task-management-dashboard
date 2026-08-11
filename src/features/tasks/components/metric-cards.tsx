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
    className:
      "from-violet-500/15 to-fuchsia-500/5 text-violet-700 dark:text-violet-300",
  },
  {
    key: "completed",
    label: "Completed",
    icon: CheckCircle2,
    className:
      "from-emerald-500/15 to-teal-500/5 text-emerald-700 dark:text-emerald-300",
  },
  {
    key: "pending",
    label: "Pending",
    icon: CircleDashed,
    className:
      "from-amber-500/15 to-orange-500/5 text-amber-700 dark:text-amber-300",
  },
  {
    key: "overdue",
    label: "Overdue",
    icon: AlertTriangle,
    className:
      "from-rose-500/15 to-pink-500/5 text-rose-700 dark:text-rose-300",
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
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
    >
      {cards.map(({ key, label, icon: Icon, className }) => (
        <article
          key={key}
          className={`border-border bg-card rounded-2xl border bg-gradient-to-br p-4 shadow-sm sm:p-5 ${className}`}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold">{label}</p>
            <Icon className="size-5" aria-hidden="true" />
          </div>
          {loading ? (
            <div className="bg-foreground/10 mt-4 h-9 w-14 animate-pulse rounded-lg" />
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
