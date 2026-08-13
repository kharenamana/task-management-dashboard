"use client";

import { LoaderCircle, Search, X } from "lucide-react";
import { useId, useState, type FormEvent, type KeyboardEvent } from "react";

import type { TaskSuggestion } from "@/features/tasks/types";

export type SuggestionState = "idle" | "loading" | "success" | "error";

type TaskSearchProps = {
  value: string;
  hasCommittedSearch: boolean;
  suggestions: TaskSuggestion[];
  suggestionState: SuggestionState;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onClear: () => void;
};

export function TaskSearch({
  value,
  hasCommittedSearch,
  suggestions,
  suggestionState,
  onChange,
  onSubmit,
  onClear,
}: TaskSearchProps) {
  const suggestionListId = useId();
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const normalizedSearch = value.trim();
  const showSuggestions = suggestionsOpen && normalizedSearch.length >= 2;

  const closeSuggestions = () => {
    setSuggestionsOpen(false);
    setActiveSuggestion(-1);
  };
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    closeSuggestions();
    onSubmit(value);
  };
  const selectSuggestion = (title: string) => {
    onChange(title);
    onSubmit(title);
    closeSuggestions();
  };
  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape" && showSuggestions) {
      event.preventDefault();
      closeSuggestions();
      return;
    }
    if (suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSuggestionsOpen(true);
      setActiveSuggestion((current) =>
        current >= suggestions.length - 1 ? 0 : current + 1,
      );
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSuggestionsOpen(true);
      setActiveSuggestion((current) =>
        current <= 0 ? suggestions.length - 1 : current - 1,
      );
      return;
    }
    const selectedSuggestion = suggestions[activeSuggestion];
    if (event.key === "Enter" && showSuggestions && selectedSuggestion) {
      event.preventDefault();
      selectSuggestion(selectedSuggestion.title);
    }
  };

  return (
    <form
      role="search"
      aria-label="Search tasks"
      onSubmit={submitSearch}
      className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row lg:max-w-3xl"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          closeSuggestions();
        }
      }}
    >
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
          role="combobox"
          aria-autocomplete="list"
          aria-controls={suggestionListId}
          aria-expanded={showSuggestions}
          aria-activedescendant={
            showSuggestions && activeSuggestion >= 0
              ? `${suggestionListId}-${activeSuggestion}`
              : undefined
          }
          autoComplete="off"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setSuggestionsOpen(event.target.value.trim().length >= 2);
            setActiveSuggestion(-1);
          }}
          onFocus={() => setSuggestionsOpen(normalizedSearch.length >= 2)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search tasks by title…"
          className="border-border bg-background h-11 w-full rounded-xl border pr-3 pl-10 text-sm shadow-sm"
        />
        {showSuggestions ? (
          <SuggestionList
            id={suggestionListId}
            suggestions={suggestions}
            state={suggestionState}
            activeIndex={activeSuggestion}
            select={selectSuggestion}
          />
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:flex">
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white transition hover:bg-violet-700"
        >
          <Search className="size-4" aria-hidden="true" /> Search
        </button>
        <button
          type="button"
          disabled={!value && !hasCommittedSearch}
          onClick={(event) => {
            onClear();
            closeSuggestions();
            const form = event.currentTarget.form;
            window.requestAnimationFrame(() =>
              form?.querySelector<HTMLInputElement>("#task-search")?.focus(),
            );
          }}
          className="border-border hover:bg-muted inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="size-4" aria-hidden="true" /> Clear
        </button>
      </div>
    </form>
  );
}

function SuggestionList({
  id,
  suggestions,
  state,
  activeIndex,
  select,
}: {
  id: string;
  suggestions: TaskSuggestion[];
  state: SuggestionState;
  activeIndex: number;
  select: (title: string) => void;
}) {
  return (
    <div
      id={id}
      role="listbox"
      aria-label="Task title suggestions"
      aria-live="polite"
      className="border-border bg-card absolute top-[calc(100%+0.4rem)] right-0 left-0 z-30 max-h-64 overflow-y-auto rounded-xl border p-1.5 shadow-xl"
    >
      {state === "loading" ? (
        <SuggestionMessage className="text-muted-foreground flex items-center gap-2">
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          Finding matching titles…
        </SuggestionMessage>
      ) : null}
      {state === "error" ? (
        <SuggestionMessage className="text-danger">
          Suggestions are unavailable. You can still submit a search.
        </SuggestionMessage>
      ) : null}
      {state === "success" && suggestions.length === 0 ? (
        <SuggestionMessage className="text-muted-foreground">
          No matching task titles.
        </SuggestionMessage>
      ) : null}
      {state === "success"
        ? suggestions.map((suggestion, index) => (
            <div
              key={suggestion.title}
              id={`${id}-${index}`}
              role="option"
              aria-selected={activeIndex === index}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => select(suggestion.title)}
              className={`cursor-pointer rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                activeIndex === index
                  ? "bg-accent-soft text-accent"
                  : "hover:bg-muted"
              }`}
            >
              {suggestion.title}
            </div>
          ))
        : null}
    </div>
  );
}

function SuggestionMessage({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <div
      role="option"
      aria-disabled="true"
      aria-selected="false"
      className={`${className} px-3 py-2.5 text-sm`}
    >
      {children}
    </div>
  );
}
