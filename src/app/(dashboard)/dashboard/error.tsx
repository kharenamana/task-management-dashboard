"use client";

import { CircleAlert } from "lucide-react";
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard render failed", error);
  }, [error]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-2xl px-5 py-20 text-center"
    >
      <CircleAlert
        className="mx-auto size-12 text-rose-500"
        aria-hidden="true"
      />
      <h1 className="mt-5 text-3xl font-black">The dashboard hit a snag</h1>
      <p className="text-muted-foreground mt-3">
        Your tasks are safe. Try rendering the dashboard again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-xl bg-violet-600 px-5 py-3 font-bold text-white"
      >
        Try again
      </button>
    </main>
  );
}
