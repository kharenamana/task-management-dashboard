import Link from "next/link";
import { ArrowRight, CheckCircle2, Layers3, Sparkles } from "lucide-react";

const highlights = [
  {
    icon: Layers3,
    title: "One calm workspace",
    text: "Tasks, priorities, and deadlines without the clutter.",
  },
  {
    icon: Sparkles,
    title: "Momentum at a glance",
    text: "See what is moving, blocked, and overdue in seconds.",
  },
  {
    icon: CheckCircle2,
    title: "Built for follow-through",
    text: "Fast capture and focused views turn plans into progress.",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(255,113,91,0.2),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(101,82,255,0.22),transparent_32%),radial-gradient(circle_at_65%_85%,rgba(255,196,64,0.2),transparent_30%)]" />
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8"
        aria-label="Primary navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400 text-white shadow-lg shadow-fuchsia-500/20">
            T
          </span>
          TaskFlow
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-foreground/75 hover:bg-foreground/5 hover:text-foreground rounded-xl px-4 py-2 text-sm font-semibold transition"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-foreground text-background rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Start free
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-16 px-6 pt-16 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pt-24 lg:pb-32">
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-sm font-semibold text-violet-700 dark:text-violet-300">
            <Sparkles className="size-4" aria-hidden="true" /> Your day, finally
            in focus
          </div>
          <h1 className="max-w-3xl text-5xl leading-[0.98] font-black tracking-[-0.05em] text-balance sm:text-6xl lg:text-7xl">
            Make progress{" "}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 bg-clip-text text-transparent">
              visible.
            </span>
          </h1>
          <p className="text-muted-foreground mt-7 max-w-xl text-lg leading-8 text-pretty sm:text-xl">
            TaskFlow turns a noisy workload into a clear plan—so you always know
            what matters now and what comes next.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3.5 font-bold text-white shadow-xl shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-2xl"
            >
              Create your workspace{" "}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/login"
              className="border-border bg-card/70 hover:bg-card inline-flex items-center justify-center rounded-2xl border px-6 py-3.5 font-bold backdrop-blur transition"
            >
              I already have an account
            </Link>
          </div>
          <p className="text-muted-foreground mt-4 text-sm">
            Free during private beta · Your tasks stay private
          </p>
        </div>

        <div
          className="relative mx-auto w-full max-w-xl"
          aria-label="TaskFlow dashboard preview"
        >
          <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-orange-400/30 blur-2xl" />
          <div className="bg-card/85 rotate-1 rounded-[2rem] border border-white/50 p-4 shadow-2xl shadow-violet-950/15 backdrop-blur-xl sm:p-6 dark:border-white/10">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">
                  Tuesday, August 11
                </p>
                <h2 className="text-2xl font-extrabold">
                  Good afternoon, Namana
                </h2>
              </div>
              <div className="size-10 rounded-full bg-gradient-to-br from-orange-400 to-fuchsia-500" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                [
                  "12",
                  "Total",
                  "bg-violet-500/10 text-violet-700 dark:text-violet-300",
                ],
                [
                  "5",
                  "Done",
                  "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                ],
                [
                  "6",
                  "Pending",
                  "bg-amber-500/10 text-amber-700 dark:text-amber-300",
                ],
                [
                  "1",
                  "Overdue",
                  "bg-rose-500/10 text-rose-700 dark:text-rose-300",
                ],
              ].map(([value, label, color]) => (
                <div key={label} className={`rounded-2xl p-3 ${color}`}>
                  <p className="text-2xl font-black">{value}</p>
                  <p className="text-xs font-semibold">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              {[
                [
                  "Polish portfolio case study",
                  "Today",
                  "High",
                  "from-orange-400 to-rose-500",
                ],
                [
                  "Review dashboard accessibility",
                  "Tomorrow",
                  "Medium",
                  "from-violet-500 to-fuchsia-500",
                ],
                [
                  "Plan launch announcement",
                  "Friday",
                  "Low",
                  "from-cyan-400 to-blue-500",
                ],
              ].map(([title, due, priority, color]) => (
                <div
                  key={title}
                  className="border-border/80 bg-background/70 flex items-center gap-3 rounded-2xl border p-3.5"
                >
                  <span
                    className={`size-3 shrink-0 rounded-full bg-gradient-to-br ${color}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{title}</p>
                    <p className="text-muted-foreground text-xs">Due {due}</p>
                  </div>
                  <span className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-[11px] font-bold">
                    {priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-border/70 bg-card/50 border-y py-20 backdrop-blur"
        aria-labelledby="why-taskflow"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2
            id="why-taskflow"
            className="text-center text-3xl font-black tracking-tight sm:text-4xl"
          >
            Less managing. More finishing.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {highlights.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="border-border bg-background/80 rounded-3xl border p-7 shadow-sm"
              >
                <div className="mb-5 grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-extrabold">{title}</h3>
                <p className="text-muted-foreground mt-2 leading-7">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
