"use client";

import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application render failed", error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="grid min-h-screen place-items-center px-5 py-16 text-center"
    >
      <div className="max-w-lg">
        <CircleAlert
          className="mx-auto size-12 text-rose-500"
          aria-hidden="true"
        />
        <h1 className="mt-5 text-3xl font-black">Something went wrong</h1>
        <p className="text-muted-foreground mt-3">
          Try again, or return home if the problem continues.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border-border rounded-xl border px-5 py-3 font-bold"
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
