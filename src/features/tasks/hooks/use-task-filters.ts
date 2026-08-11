"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import { taskQueryFromRecord } from "@/features/tasks/filters";
import type { TaskListQuery } from "@/features/tasks/schemas";

export function useTaskFilters(initialQuery: TaskListQuery) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const [isNavigating, startTransition] = useTransition();
  const query = useMemo(
    () =>
      taskQueryFromRecord(Object.fromEntries(new URLSearchParams(searchKey))),
    [searchKey],
  );
  const [searchDraft, setSearchDraft] = useState({
    source: initialQuery.q ?? "",
    value: initialQuery.q ?? "",
  });
  const currentSearch = query.q ?? "";
  const searchValue =
    searchDraft.source === currentSearch ? searchDraft.value : currentSearch;

  const replace = useCallback(
    (parameters: URLSearchParams) => {
      const next = parameters.toString();
      startTransition(() => {
        router.replace(next ? `${pathname}?${next}` : pathname, {
          scroll: false,
        });
      });
    },
    [pathname, router],
  );

  useEffect(() => {
    if (searchValue.trim() === currentSearch) return;
    const timeout = window.setTimeout(() => {
      const parameters = new URLSearchParams(searchKey);
      const normalized = searchValue.trim();
      if (normalized) parameters.set("q", normalized);
      else parameters.delete("q");
      parameters.delete("page");
      replace(parameters);
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [currentSearch, replace, searchKey, searchValue]);

  const updateQuery = useCallback(
    (changes: Record<string, string | undefined>, resetPage = true) => {
      const parameters = new URLSearchParams(searchKey);
      for (const [key, value] of Object.entries(changes)) {
        if (!value || (key === "sort" && value === "due_asc")) {
          parameters.delete(key);
        } else {
          parameters.set(key, value);
        }
      }
      if (resetPage) parameters.delete("page");
      replace(parameters);
    },
    [replace, searchKey],
  );

  const clear = useCallback(() => {
    setSearchDraft({ source: currentSearch, value: "" });
    replace(new URLSearchParams());
  }, [currentSearch, replace]);

  return {
    clear,
    isNavigating,
    query,
    searchKey,
    searchValue,
    setSearchValue: (value: string) =>
      setSearchDraft({ source: currentSearch, value }),
    updateQuery,
  };
}
