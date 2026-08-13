import { Plus, SlidersHorizontal, X } from "lucide-react";

import {
  TaskSearch,
  type SuggestionState,
} from "@/features/tasks/components/task-search";

import {
  taskPriorityLabels,
  taskPriorityOptions,
  taskSortLabels,
  taskStatusLabels,
  taskStatusOptions,
} from "@/features/tasks/presentation";
import type { TaskListQuery } from "@/features/tasks/schemas";
import type { TaskSuggestion } from "@/features/tasks/types";

type TaskToolbarProps = {
  query: TaskListQuery;
  searchValue: string;
  suggestions: TaskSuggestion[];
  suggestionState: SuggestionState;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (value: string) => void;
  onSearchClear: () => void;
  onQueryChange: (key: "status" | "priority" | "sort", value: string) => void;
  onFilterRemove: (key: "status" | "priority" | "sort") => void;
  onClear: () => void;
  onCreate: () => void;
};

const selectClassName =
  "border-border bg-background h-11 min-w-0 w-full rounded-xl border px-3 text-sm font-semibold shadow-sm sm:w-auto";

export function TaskToolbar({
  query,
  searchValue,
  suggestions,
  suggestionState,
  onSearchChange,
  onSearchSubmit,
  onSearchClear,
  onQueryChange,
  onFilterRemove,
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
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
        <TaskSearch
          value={searchValue}
          hasCommittedSearch={Boolean(query.q)}
          suggestions={suggestions}
          suggestionState={suggestionState}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
          onClear={onSearchClear}
        />
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 text-sm font-bold text-white shadow-lg shadow-violet-500/15 transition hover:-translate-y-0.5"
        >
          <Plus className="size-4" aria-hidden="true" /> New task
        </button>
      </div>

      <div className="border-border mt-3 flex flex-col gap-3 border-t pt-3 lg:flex-row lg:items-center lg:justify-between">
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
            <option value="due_asc">{taskSortLabels.due_asc}</option>
            <option value="due_desc">{taskSortLabels.due_desc}</option>
          </select>
          {filtered ? (
            <button
              type="button"
              onClick={onClear}
              className="border-border hover:bg-muted inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-bold transition"
            >
              <X className="size-4" aria-hidden="true" /> Clear all
            </button>
          ) : null}
        </div>
        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <SlidersHorizontal className="size-3.5" aria-hidden="true" /> Filters
          are reflected in the URL.
        </p>
      </div>

      {filtered ? (
        <div
          className="mt-3 flex flex-wrap items-center gap-2"
          aria-label="Active filters"
        >
          <span className="text-muted-foreground text-xs font-semibold">
            Active:
          </span>
          {query.q ? (
            <FilterChip label={`Search: ${query.q}`} onRemove={onSearchClear} />
          ) : null}
          {query.status ? (
            <FilterChip
              label={`Status: ${taskStatusLabels[query.status]}`}
              onRemove={() => onFilterRemove("status")}
            />
          ) : null}
          {query.priority ? (
            <FilterChip
              label={`Priority: ${taskPriorityLabels[query.priority]}`}
              onRemove={() => onFilterRemove("priority")}
            />
          ) : null}
          {query.sort !== "due_asc" ? (
            <FilterChip
              label={taskSortLabels[query.sort]}
              onRemove={() => onFilterRemove("sort")}
            />
          ) : null}
        </div>
      ) : (
        <p className="text-muted-foreground mt-3 text-xs">
          Type two or more characters for suggestions, then submit to search.
        </p>
      )}
    </section>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${label} filter`}
      className="bg-accent-soft text-accent inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-full px-3 text-xs font-bold transition hover:-translate-y-0.5"
    >
      <span className="max-w-64 truncate">{label}</span>
      <X className="size-3.5 shrink-0" aria-hidden="true" />
    </button>
  );
}
