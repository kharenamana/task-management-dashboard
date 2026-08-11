import Link from "next/link";
import { LogOut } from "lucide-react";

import { logoutAction } from "@/features/auth/actions";
import { requirePageUser } from "@/features/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requirePageUser();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.10),transparent_28%)]">
      <header className="border-border/75 bg-background/80 sticky top-0 z-30 border-b backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-black"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400 text-white">
              T
            </span>
            TaskFlow
          </Link>
          <div className="flex min-w-0 items-center gap-3">
            <span className="text-muted-foreground hidden max-w-56 truncate text-sm sm:block">
              {user.email}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="border-border bg-card hover:bg-muted inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition"
              >
                <LogOut className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Sign out</span>
                <span className="sr-only sm:hidden">Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
