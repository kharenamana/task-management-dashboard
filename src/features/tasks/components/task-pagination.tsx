import type { PaginationMeta } from "@/features/tasks/types";

export function TaskPagination({
  meta,
  onPageChange,
}: {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}) {
  if (meta.totalPages <= 1) return null;

  return (
    <nav
      aria-label="Task pagination"
      className="mt-6 flex items-center justify-between gap-4"
    >
      <button
        type="button"
        disabled={meta.page <= 1}
        onClick={() => onPageChange(meta.page - 1)}
        className="border-border bg-card hover:bg-muted min-h-11 rounded-xl border px-4 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>
      <p className="text-muted-foreground text-sm font-semibold">
        Page {meta.page} of {meta.totalPages}
      </p>
      <button
        type="button"
        disabled={meta.page >= meta.totalPages}
        onClick={() => onPageChange(meta.page + 1)}
        className="border-border bg-card hover:bg-muted min-h-11 rounded-xl border px-4 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
}
