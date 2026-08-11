import { Plus, Search, SlidersHorizontal, X } from "lucide-react";

import {
  taskPriorityOptions,
  taskStatusOptions,
} from "@/features/tasks/presentation";
import type { TaskListQuery } from "@/features/tasks/schemas";

type TaskToolbarProps = {
  query: TaskListQuery;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onQueryChange: (key: "status" | "priority" | "sort", value: string) => void;
  onClear: () => void;
  onCreate: () => void;
};

const selectClassName =
  "border-border bg-background rounded-xl border px-3 py-2.5 text-sm font-semibold shadow-sm";

export function TaskToolbar({
  query,
  searchValue,
  onSearchChange,
  onQueryChange,
  onClear,
  onCreate,
}: TaskToolbarProps) {
  const filtered = Boolean(
    query.q || query.status || query.priority || query.sort !== "due_asc",
  );
  return (
    <section
      aria-label="Task controls"
      className="border-border bg-card rounded-2xl border p-3 shadow-sm sm:p-4"
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <label htmlFor="task-search" className="sr-only">
            Search tasks by title
          </label>
          <input
            id="task-search"
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search tasks…"
            className="border-border bg-background w-full rounded-xl border py-2.5 pr-3 pl-10 text-sm shadow-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <label className="sr-only" htmlFor="status-filter">
            Filter by status
          </label>
          <select
            id="status-filter"
            value={query.status ?? ""}
            onChange={(event) => onQueryChange("status", event.target.value)}
            className={selectClassName}
          >
            <option value="">All statuses</option>
            {taskStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="priority-filter">
            Filter by priority
          </label>
          <select
            id="priority-filter"
            value={query.priority ?? ""}
            onChange={(event) => onQueryChange("priority", event.target.value)}
            className={selectClassName}
          >
            <option value="">All priorities</option>
            {taskPriorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} priority
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="due-sort">
            Sort by due date
          </label>
          <select
            id="due-sort"
            value={query.sort}
            onChange={(event) => onQueryChange("sort", event.target.value)}
            className={selectClassName}
          >
            <option value="due_asc">Due date: earliest</option>
            <option value="due_desc">Due date: latest</option>
          </select>
          {filtered ? (
            <button
              type="button"
              onClick={onClear}
              className="border-border hover:bg-muted inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition"
            >
              <X className="size-4" aria-hidden="true" /> Clear
            </button>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5"
        >
          <Plus className="size-4" aria-hidden="true" /> New task
        </button>
      </div>
      <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-xs">
        <SlidersHorizontal className="size-3.5" aria-hidden="true" /> Search
        updates after a short pause; filters are saved in the URL.
      </p>
    </section>
  );
}
