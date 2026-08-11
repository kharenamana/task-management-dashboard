import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Layers3,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

import { absoluteUrl, createPageMetadata, siteConfig } from "@/config/site";
import { StructuredData } from "@/features/marketing/components/structured-data";

const description =
  "Explore TaskFlow, a production-minded Next.js and Supabase task dashboard demonstrating secure multi-user architecture, accessible UX, and tested task workflows.";

export const metadata = createPageMetadata({
  title: "TaskFlow — Full-stack task dashboard case study",
  description,
  path: "/",
  absoluteTitle: true,
});

const highlights = [
  {
    icon: Layers3,
    title: "Product thinking",
    text: "A focused workflow with priorities, due dates, metrics, filtering, and responsive task views.",
  },
  {
    icon: LockKeyhole,
    title: "Security by boundary",
    text: "SSR cookie sessions, server authorization, Zod validation, and PostgreSQL row-level security.",
  },
  {
    icon: Code2,
    title: "Engineering depth",
    text: "Strict TypeScript, Server Components, TanStack Query, automated tests, migrations, and CI.",
  },
];

const previewTasks = [
  ["Review accessibility findings", "Today", "High", "bg-rose-500"],
  ["Document request boundaries", "Tomorrow", "Medium", "bg-violet-500"],
  ["Verify release preview", "Friday", "Low", "bg-cyan-500"],
];

export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <StructuredData
        id="website-structured-data"
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteConfig.name,
          url: absoluteUrl("/"),
          description: siteConfig.description,
        }}
      />
      <StructuredData
        id="application-structured-data"
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: siteConfig.name,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description,
          url: absoluteUrl("/"),
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            description: "Free during the private beta.",
          },
        }}
      />

      <section className="marketing-hero relative overflow-hidden">
        <div className="marketing-orb marketing-orb-one" />
        <div className="marketing-orb marketing-orb-two" />
        <div className="marketing-container grid gap-14 py-18 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-24">
          <div className="animate-enter">
            <p className="marketing-eyebrow inline-flex items-center gap-2">
              <Sparkles className="size-4" aria-hidden="true" />{" "}
              Production-minded portfolio build
            </p>
            <h1 className="marketing-title mt-5 max-w-3xl">
              A task dashboard engineered beyond the happy path.
            </h1>
            <p className="text-muted-foreground mt-7 max-w-2xl text-lg leading-8 text-pretty sm:text-xl">
              TaskFlow pairs a calm personal workflow with secure data
              isolation, resilient mutations, accessible interaction, and
              transparent architecture decisions.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="button-primary justify-center">
                Open the working product
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/architecture"
                className="button-secondary justify-center"
              >
                Explore the architecture
              </Link>
            </div>
            <ul className="text-muted-foreground mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
              {[
                "Real Supabase Auth",
                "Owner-isolated RLS",
                "Strict TypeScript",
              ].map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <CheckCircle2
                    className="size-4 text-emerald-600"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <figure
            aria-labelledby="dashboard-preview-caption"
            className="animate-enter-delay relative mx-auto w-full max-w-xl"
          >
            <div className="preview-glow" aria-hidden="true" />
            <div className="border-border bg-card/95 relative rounded-[2rem] border p-4 shadow-2xl shadow-violet-950/10 sm:p-6">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-muted-foreground text-sm font-semibold">
                    Focus workspace
                  </p>
                  <h2 className="mt-1 text-2xl font-black">
                    Make today count.
                  </h2>
                </div>
                <span className="bg-muted rounded-full px-3 py-1 text-xs font-bold">
                  Private
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["12", "Total", "metric-violet"],
                  ["5", "Done", "metric-green"],
                  ["6", "Pending", "metric-amber"],
                  ["1", "Overdue", "metric-rose"],
                ].map(([value, label, className]) => (
                  <div key={label} className={`preview-metric ${className}`}>
                    <p className="text-2xl font-black tabular-nums">{value}</p>
                    <p className="text-xs font-bold">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-3">
                {previewTasks.map(([title, due, priority, color]) => (
                  <div
                    key={title}
                    className="border-border bg-background flex items-center gap-3 rounded-2xl border p-3.5"
                  >
                    <span
                      className={`size-2.5 shrink-0 rounded-full ${color}`}
                      aria-hidden="true"
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
            <figcaption
              id="dashboard-preview-caption"
              className="text-muted-foreground mt-4 text-center text-sm"
            >
              A representative preview using non-personal demonstration data.
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        className="marketing-section border-border/70 border-y"
        aria-labelledby="proof-heading"
      >
        <div className="marketing-container">
          <div className="max-w-2xl">
            <p className="marketing-eyebrow">Built as a system</p>
            <h2 id="proof-heading" className="section-title mt-3">
              Product polish backed by implementation depth.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {highlights.map(({ icon: Icon, title, text }, index) => (
              <article
                key={title}
                className={`marketing-card stagger-${index + 1}`}
              >
                <div className="icon-tile">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
                <p className="text-muted-foreground mt-2 leading-7">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="marketing-container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="marketing-eyebrow">Transparent decisions</p>
            <h2 className="section-title mt-3">
              See how every boundary earns its place.
            </h2>
            <p className="text-muted-foreground mt-5 max-w-xl leading-8">
              The case study explains rendering choices, validation boundaries,
              optimistic updates, database ownership, testing strategy, and the
              compromises appropriate for a private beta.
            </p>
            <Link href="/about" className="text-link mt-6">
              Read the engineering case study
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="border-border bg-card grid gap-px overflow-hidden rounded-3xl border sm:grid-cols-2">
            {[
              [
                "Server first",
                "Server Components prepare secure page shells and initial data.",
              ],
              [
                "Client when needed",
                "TanStack Query owns interactive task state and rollback.",
              ],
              [
                "Validated twice",
                "Shared Zod schemas protect browser and HTTP boundaries.",
              ],
              [
                "Database enforced",
                "RLS remains authoritative even if application checks regress.",
              ],
            ].map(([title, text]) => (
              <article key={title} className="bg-background p-6 sm:p-7">
                <h3 className="font-extrabold">{title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-6">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-container pb-20 sm:pb-24">
        <div className="cta-panel">
          <div>
            <p className="text-sm font-bold text-violet-200">
              Explore it two ways
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
              Use the product. Then inspect the decisions.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className="button-light justify-center">
              Create an account
            </Link>
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="button-dark-outline justify-center"
            >
              View source
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
