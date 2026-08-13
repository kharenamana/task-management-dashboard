"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { MetricCards } from "@/features/tasks/components/metric-cards";
import { TaskList } from "@/features/tasks/components/task-list";
import { TaskPagination } from "@/features/tasks/components/task-pagination";
import {
  TaskEmptyState,
  TaskErrorState,
  TaskLoading,
} from "@/features/tasks/components/task-state";
import { TaskToolbar } from "@/features/tasks/components/task-toolbar";
import { useLocalToday } from "@/features/tasks/hooks/use-local-today";
import { useTaskFilters } from "@/features/tasks/hooks/use-task-filters";
import { useToggleTask } from "@/features/tasks/hooks/use-task-mutations";
import { useTaskSuggestions } from "@/features/tasks/hooks/use-task-suggestions";
import { useTaskMetrics, useTasks } from "@/features/tasks/hooks/use-tasks";
import type { TaskListQuery } from "@/features/tasks/schemas";
import type { Task } from "@/features/tasks/types";

const DeleteTaskDialog = dynamic(() =>
  import("@/features/tasks/components/delete-task-dialog").then(
    (module) => module.DeleteTaskDialog,
  ),
);
const TaskFormDialog = dynamic(() =>
  import("@/features/tasks/components/task-form-dialog").then(
    (module) => module.TaskFormDialog,
  ),
);

export function DashboardClient({
  initialQuery,
}: {
  initialQuery: TaskListQuery;
}) {
  const {
    clear,
    clearSearch,
    isNavigating,
    query,
    searchValue,
    setSearchValue,
    submitSearch,
    updateQuery,
  } = useTaskFilters(initialQuery);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const focusPageRef = useRef<number | null>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const today = useLocalToday();
  const tasksQuery = useTasks(query);
  const metricsQuery = useTaskMetrics(today);
  const suggestionQuery = useTaskSuggestions({
    q: searchValue,
    status: query.status,
    priority: query.priority,
  });
  const toggleMutation = useToggleTask();

  const openCreate = () => {
    setEditingTask(null);
    setFormOpen(true);
  };
  const openEdit = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };
  const tasks = tasksQuery.data?.data ?? [];
  const meta = tasksQuery.data?.meta;
  const filtered = Boolean(query.q || query.status || query.priority);

  useEffect(() => {
    if (!tasksQuery.isSuccess || !meta) return;
    const lastPage = Math.max(1, meta.totalPages);
    if (query.page <= lastPage) return;

    updateQuery({ page: lastPage === 1 ? undefined : String(lastPage) }, false);
  }, [meta, query.page, tasksQuery.isSuccess, updateQuery]);

  useEffect(() => {
    if (
      focusPageRef.current !== query.page ||
      isNavigating ||
      tasksQuery.isFetching ||
      !tasksQuery.isSuccess
    ) {
      return;
    }
    resultsHeadingRef.current?.focus();
    focusPageRef.current = null;
  }, [isNavigating, query.page, tasksQuery.isFetching, tasksQuery.isSuccess]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10"
    >
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-accent text-sm font-bold">
            Your private workspace
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
            Make today count.
          </h1>
          <p className="text-muted-foreground mt-2">
            Plan clearly, focus deliberately, and finish meaningful work.
          </p>
        </div>
        <p
          className="text-muted-foreground text-sm"
          aria-live="polite"
          aria-atomic="true"
        >
          {tasksQuery.isFetching || isNavigating
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
        <p role="alert" className="text-danger mt-3 text-sm font-semibold">
          Summary metrics could not be refreshed.
        </p>
      ) : null}

      <div className="mt-7">
        <TaskToolbar
          query={query}
          searchValue={searchValue}
          suggestions={suggestionQuery.suggestions}
          suggestionState={suggestionQuery.state}
          onSearchChange={setSearchValue}
          onSearchSubmit={submitSearch}
          onSearchClear={clearSearch}
          onQueryChange={(key, value) =>
            updateQuery({ [key]: value || undefined })
          }
          onFilterRemove={(key) => updateQuery({ [key]: undefined })}
          onClear={clear}
          onCreate={openCreate}
        />
      </div>

      <section
        className="mt-6"
        aria-labelledby="task-results-heading"
        aria-busy={tasksQuery.isFetching || isNavigating}
      >
        <div className="mb-3 flex min-h-8 items-center justify-between gap-4">
          <h2
            id="task-results-heading"
            ref={resultsHeadingRef}
            tabIndex={-1}
            className="text-xl font-black tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-4"
          >
            Tasks
          </h2>
          {tasksQuery.isFetching && !tasksQuery.isPending ? (
            <span className="text-muted-foreground text-xs font-semibold">
              Updating…
            </span>
          ) : null}
        </div>
        {tasksQuery.isPending ? <TaskLoading /> : null}
        {tasksQuery.isError ? (
          <TaskErrorState retry={() => void tasksQuery.refetch()} />
        ) : null}
        {tasksQuery.isSuccess && tasks.length === 0 ? (
          <TaskEmptyState
            filtered={filtered}
            create={openCreate}
            clearFilters={clear}
          />
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
      </section>

      {meta ? (
        <TaskPagination
          meta={meta}
          onPageChange={(page) => {
            focusPageRef.current = page;
            updateQuery({ page: String(page) }, false);
          }}
        />
      ) : null}

      {formOpen ? (
        <TaskFormDialog
          key={editingTask?.id ?? "new-task"}
          open
          onOpenChange={setFormOpen}
          task={editingTask}
        />
      ) : null}
      {deletingTask ? (
        <DeleteTaskDialog
          task={deletingTask}
          onClose={() => setDeletingTask(null)}
        />
      ) : null}
    </main>
  );
}
