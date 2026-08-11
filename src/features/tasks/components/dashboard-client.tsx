"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { DeleteTaskDialog } from "@/features/tasks/components/delete-task-dialog";
import { MetricCards } from "@/features/tasks/components/metric-cards";
import { TaskFormDialog } from "@/features/tasks/components/task-form-dialog";
import { TaskList } from "@/features/tasks/components/task-list";
import {
  TaskEmptyState,
  TaskErrorState,
  TaskLoading,
} from "@/features/tasks/components/task-state";
import { TaskToolbar } from "@/features/tasks/components/task-toolbar";
import { taskQueryFromRecord } from "@/features/tasks/filters";
import { useLocalToday } from "@/features/tasks/hooks/use-local-today";
import { useToggleTask } from "@/features/tasks/hooks/use-task-mutations";
import { useTaskMetrics, useTasks } from "@/features/tasks/hooks/use-tasks";
import type { TaskListQuery } from "@/features/tasks/schemas";
import type { Task } from "@/features/tasks/types";

export function DashboardClient({
  initialQuery,
}: {
  initialQuery: TaskListQuery;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const query = useMemo(
    () =>
      taskQueryFromRecord(Object.fromEntries(new URLSearchParams(searchKey))),
    [searchKey],
  );
  const [searchDraft, setSearchDraft] = useState({
    source: initialQuery.q ?? "",
    value: initialQuery.q ?? "",
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const today = useLocalToday();
  const tasksQuery = useTasks(query);
  const metricsQuery = useTaskMetrics(today);
  const toggleMutation = useToggleTask();

  const currentQuerySearch = query.q ?? "";
  const searchValue =
    searchDraft.source === currentQuerySearch
      ? searchDraft.value
      : currentQuerySearch;

  useEffect(() => {
    if (searchValue.trim() === (query.q ?? "")) return;
    const timeout = window.setTimeout(() => {
      const parameters = new URLSearchParams(searchKey);
      const normalized = searchValue.trim();
      if (normalized) parameters.set("q", normalized);
      else parameters.delete("q");
      parameters.delete("page");
      const next = parameters.toString();
      router.replace(next ? `${pathname}?${next}` : pathname, {
        scroll: false,
      });
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [pathname, query.q, router, searchKey, searchValue]);

  const updateQuery = (
    changes: Record<string, string | undefined>,
    resetPage = true,
  ) => {
    const parameters = new URLSearchParams(searchKey);
    for (const [key, value] of Object.entries(changes)) {
      if (!value || (key === "sort" && value === "due_asc")) {
        parameters.delete(key);
      } else {
        parameters.set(key, value);
      }
    }
    if (resetPage) parameters.delete("page");
    const next = parameters.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  const openCreate = () => {
    setEditingTask(null);
    setFormOpen(true);
  };
  const openEdit = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };
  const clear = () => {
    setSearchDraft({ source: currentQuerySearch, value: "" });
    router.replace(pathname, { scroll: false });
  };

  const tasks = tasksQuery.data?.data ?? [];
  const meta = tasksQuery.data?.meta;
  const filtered = Boolean(query.q || query.status || query.priority);

  useEffect(() => {
    if (!tasksQuery.isSuccess || !meta) return;
    const lastPage = Math.max(1, meta.totalPages);
    if (query.page <= lastPage) return;

    const parameters = new URLSearchParams(searchKey);
    if (lastPage === 1) parameters.delete("page");
    else parameters.set("page", String(lastPage));
    const next = parameters.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [meta, pathname, query.page, router, searchKey, tasksQuery.isSuccess]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-violet-600 dark:text-violet-300">
            Your private workspace
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
            Make today count.
          </h1>
          <p className="text-muted-foreground mt-2">
            Plan clearly, focus deliberately, and finish meaningful work.
          </p>
        </div>
        <p className="text-muted-foreground text-sm" aria-live="polite">
          {tasksQuery.isFetching
            ? "Refreshing tasks…"
            : meta
              ? `${meta.total} task${meta.total === 1 ? "" : "s"}`
              : ""}
        </p>
      </div>

      <MetricCards
        metrics={metricsQuery.data?.data}
        loading={metricsQuery.isPending}
      />
      {metricsQuery.isError ? (
        <p
          role="alert"
          className="mt-3 text-sm font-semibold text-rose-600 dark:text-rose-300"
        >
          Summary metrics could not be refreshed.
        </p>
      ) : null}

      <div className="mt-7">
        <TaskToolbar
          query={query}
          searchValue={searchValue}
          onSearchChange={(value) =>
            setSearchDraft({ source: currentQuerySearch, value })
          }
          onQueryChange={(key, value) =>
            updateQuery({ [key]: value || undefined })
          }
          onClear={clear}
          onCreate={openCreate}
        />
      </div>

      <div className="mt-5">
        {tasksQuery.isPending ? <TaskLoading /> : null}
        {tasksQuery.isError ? (
          <TaskErrorState retry={() => void tasksQuery.refetch()} />
        ) : null}
        {tasksQuery.isSuccess && tasks.length === 0 ? (
          <TaskEmptyState filtered={filtered} create={openCreate} />
        ) : null}
        {tasks.length > 0 ? (
          <TaskList
            tasks={tasks}
            today={today}
            togglingId={
              toggleMutation.isPending
                ? toggleMutation.variables?.id
                : undefined
            }
            onToggle={(task) => toggleMutation.mutate(task)}
            onEdit={openEdit}
            onDelete={setDeletingTask}
          />
        ) : null}
      </div>

      {meta && meta.totalPages > 1 ? (
        <nav
          aria-label="Task pagination"
          className="mt-6 flex items-center justify-between gap-4"
        >
          <button
            type="button"
            disabled={meta.page <= 1}
            onClick={() => updateQuery({ page: String(meta.page - 1) }, false)}
            className="border-border bg-card hover:bg-muted rounded-xl border px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <p className="text-muted-foreground text-sm font-semibold">
            Page {meta.page} of {meta.totalPages}
          </p>
          <button
            type="button"
            disabled={meta.page >= meta.totalPages}
            onClick={() => updateQuery({ page: String(meta.page + 1) }, false)}
            className="border-border bg-card hover:bg-muted rounded-xl border px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      ) : null}

      {formOpen ? (
        <TaskFormDialog
          key={editingTask?.id ?? "new-task"}
          open
          onOpenChange={setFormOpen}
          task={editingTask}
        />
      ) : null}
      <DeleteTaskDialog
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
      />
    </main>
  );
}
