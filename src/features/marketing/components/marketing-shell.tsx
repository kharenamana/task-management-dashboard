import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";

import { siteConfig } from "@/config/site";
import { BrandMark } from "@/features/marketing/components/brand-mark";

export function MarketingHeader() {
  return (
    <header className="border-border/70 bg-background/90 sticky top-0 z-40 border-b backdrop-blur-lg">
      <div className="marketing-container flex h-18 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="TaskFlow home"
          className="flex items-center gap-2.5 text-lg font-black tracking-tight"
        >
          <BrandMark />
          TaskFlow
        </Link>
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href="/login"
            className="hover:bg-muted rounded-xl px-4 py-2 text-sm font-bold transition-colors"
          >
            Log in
          </Link>
          <Link href="/signup" className="button-primary text-sm">
            Try the dashboard
          </Link>
        </div>
        <details className="relative sm:hidden">
          <summary className="border-border bg-card grid size-11 cursor-pointer list-none place-items-center rounded-xl border [&::-webkit-details-marker]:hidden">
            <Menu className="size-5" aria-hidden="true" />
            <span className="sr-only">Open navigation</span>
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="border-border bg-card absolute top-13 right-0 w-64 rounded-2xl border p-3 shadow-2xl"
          >
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:bg-muted block rounded-xl px-3 py-2.5 font-semibold"
              >
                {item.label}
              </Link>
            ))}
            <div className="border-border mt-2 grid gap-2 border-t pt-3">
              <Link href="/login" className="button-secondary text-center">
                Log in
              </Link>
              <Link href="/signup" className="button-primary text-center">
                Try the dashboard
              </Link>
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-border bg-card/45 border-t">
      <div className="marketing-container grid gap-10 py-12 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 font-black"
          >
            <BrandMark /> TaskFlow
          </Link>
          <p className="text-muted-foreground mt-4 max-w-lg leading-7">
            A working private task dashboard and transparent full-stack
            engineering case study built for a production-minded portfolio.
          </p>
        </div>
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold"
        >
          <Link href="/about">About</Link>
          <Link href="/architecture">Architecture</Link>
          <Link href="/security">Security</Link>
          <Link href="/privacy">Privacy</Link>
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1"
          >
            GitHub <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </nav>
      </div>
      <div className="border-border border-t">
        <div className="marketing-container text-muted-foreground flex flex-col gap-2 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 TaskFlow portfolio project.</p>
          <p>Private beta · No fabricated metrics or endorsements.</p>
        </div>
      </div>
    </footer>
  );
}
