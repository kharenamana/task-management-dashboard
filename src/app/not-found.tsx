import Link from "next/link";
import { ArrowLeft, MapPinOff } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-16">
      <div className="max-w-lg text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-xl shadow-violet-500/20">
          <MapPinOff className="size-8" aria-hidden="true" />
        </div>
        <p className="mt-6 text-sm font-bold tracking-widest text-violet-600 uppercase dark:text-violet-300">
          404 · Not found
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">
          This task wandered off.
        </h1>
        <p className="text-muted-foreground mt-4 leading-7">
          The page may have moved, or the address may be incorrect.
        </p>
        <Link
          href="/"
          className="bg-foreground text-background mt-7 inline-flex items-center gap-2 rounded-xl px-5 py-3 font-bold"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> Back to TaskFlow
        </Link>
      </div>
    </main>
  );
}
