import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

type AuthShellProps = {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
};

const benefits = [
  "Private tasks protected by database policies",
  "A focused workspace on every screen size",
  "Simple priorities that keep work moving",
];

export function AuthShell({
  children,
  eyebrow,
  title,
  description,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden lg:grid lg:grid-cols-[0.95fr_1.05fr]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_15%,rgba(124,58,237,0.18),transparent_32%),radial-gradient(circle_at_90%_85%,rgba(249,115,22,0.18),transparent_30%)]" />
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-violet-700 via-fuchsia-600 to-orange-500 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -top-32 -right-24 size-96 rounded-full bg-white/15 blur-3xl" />
        <Link
          href="/"
          className="relative flex w-fit items-center gap-2 text-xl font-black"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-white/20 shadow-lg backdrop-blur">
            T
          </span>
          TaskFlow
        </Link>
        <div className="relative max-w-lg">
          <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Sparkles className="size-7" aria-hidden="true" />
          </div>
          <p className="text-4xl leading-tight font-black tracking-tight text-balance">
            Turn a busy day into visible progress.
          </p>
          <ul className="mt-9 space-y-4">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-3 font-medium text-white/90"
              >
                <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative flex items-center gap-2 text-sm text-white/75">
          <ShieldCheck className="size-4" aria-hidden="true" />
          Secure multi-user private beta
        </p>
      </aside>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm font-semibold transition"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to TaskFlow
          </Link>
          <div className="border-border bg-card/90 rounded-[2rem] border p-6 shadow-2xl shadow-violet-950/10 backdrop-blur sm:p-8">
            <p className="text-sm font-bold tracking-wide text-violet-600 uppercase dark:text-violet-300">
              {eyebrow}
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">{title}</h1>
            <p className="text-muted-foreground mt-3 leading-7">
              {description}
            </p>
            <div className="mt-7">{children}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
