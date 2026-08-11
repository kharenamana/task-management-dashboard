import type { Metadata } from "next";
import { CircleDashed, LayoutDashboard, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false },
};

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-violet-600 dark:text-violet-300">
            <Sparkles className="size-4" aria-hidden="true" /> Your private
            workspace
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Good things are taking shape.
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl leading-7">
            Authentication is ready. Secure task management arrives in the next
            build phase.
          </p>
        </div>
      </div>
      <section
        aria-labelledby="workspace-status"
        className="border-border bg-card/85 mt-10 rounded-[2rem] border p-7 shadow-xl shadow-violet-950/5 backdrop-blur sm:p-10"
      >
        <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20">
          <LayoutDashboard className="size-7" aria-hidden="true" />
        </div>
        <h2 id="workspace-status" className="mt-6 text-2xl font-black">
          Your dashboard is secured
        </h2>
        <p className="text-muted-foreground mt-2 max-w-xl leading-7">
          This route is checked on the server and backed by Supabase cookie
          sessions. Your future tasks will also be isolated with Row Level
          Security.
        </p>
        <div className="bg-muted mt-7 flex items-center gap-3 rounded-2xl p-4 text-sm font-semibold">
          <CircleDashed
            className="size-5 text-violet-600 dark:text-violet-300"
            aria-hidden="true"
          />{" "}
          Task workspace coming in Phase 3 and Phase 4.
        </div>
      </section>
    </main>
  );
}
