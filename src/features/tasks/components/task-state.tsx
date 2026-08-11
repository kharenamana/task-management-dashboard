import { CircleAlert, ListChecks, SearchX } from "lucide-react";

export function TaskLoading() {
  return (
    <div className="space-y-3" aria-label="Loading tasks" role="status">
      <span className="sr-only">Loading tasks…</span>
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="border-border bg-card h-20 animate-pulse rounded-2xl border"
        />
      ))}
    </div>
  );
}

export function TaskErrorState({ retry }: { retry: () => void }) {
  return (
    <div
      className="border-border bg-card rounded-2xl border p-10 text-center"
      role="alert"
    >
      <CircleAlert
        className="mx-auto size-10 text-rose-500"
        aria-hidden="true"
      />
      <h2 className="mt-4 text-xl font-black">Tasks could not be loaded</h2>
      <p className="text-muted-foreground mt-2">
        Check your connection and try again.
      </p>
      <button
        type="button"
        onClick={retry}
        className="mt-5 rounded-xl bg-violet-600 px-4 py-2.5 font-bold text-white"
      >
        Try again
      </button>
    </div>
  );
}

export function TaskEmptyState({
  filtered,
  create,
}: {
  filtered: boolean;
  create: () => void;
}) {
  const Icon = filtered ? SearchX : ListChecks;
  return (
    <div className="border-border bg-card rounded-2xl border border-dashed p-10 text-center sm:p-14">
      <Icon className="mx-auto size-11 text-violet-500" aria-hidden="true" />
      <h2 className="mt-4 text-xl font-black">
        {filtered ? "No matching tasks" : "Your workspace is ready"}
      </h2>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md leading-7">
        {filtered
          ? "Try a different search or clear one of the filters."
          : "Create your first task and turn today’s plan into visible progress."}
      </p>
      {!filtered ? (
        <button
          type="button"
          onClick={create}
          className="mt-5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2.5 font-bold text-white"
        >
          Create first task
        </button>
      ) : null}
    </div>
  );
}
