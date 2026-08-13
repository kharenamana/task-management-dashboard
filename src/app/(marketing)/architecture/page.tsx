import Link from "next/link";
import {
  ArrowRight,
  Database,
  LayoutTemplate,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { absoluteUrl, createPageMetadata } from "@/config/site";
import { PageIntro } from "@/features/marketing/components/page-intro";
import { StructuredData } from "@/features/marketing/components/structured-data";

const description =
  "A transparent technical walkthrough of TaskFlow's Next.js App Router, Supabase SSR Auth, PostgreSQL RLS, validated Route Handlers, and TanStack Query data flow.";

export const metadata = createPageMetadata({
  title: "Full-stack architecture",
  description,
  path: "/architecture",
});

const boundaries = [
  [
    LayoutTemplate,
    "Next.js server boundary",
    "Server Components protect the dashboard and hydrate the selected initial query without exposing credentials.",
  ],
  [
    Workflow,
    "HTTP and domain boundary",
    "Route Handlers authenticate first, parse Zod contracts, and pass one request client through services and repositories.",
  ],
  [
    Database,
    "PostgreSQL boundary",
    "Constraints, triggers, explicit ownership predicates, grants, and RLS independently protect task records.",
  ],
  [
    ShieldCheck,
    "Client interaction boundary",
    "TanStack Query handles server state, optimistic rollback, and authoritative reconciliation while local state stays temporary.",
  ],
] as const;

export default function ArchitecturePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <StructuredData
        id="architecture-article"
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "TaskFlow full-stack architecture",
          description,
          url: absoluteUrl("/architecture"),
          datePublished: "2026-08-11",
          dateModified: "2026-08-11",
          author: { "@type": "Person", name: "Namana Khare" },
        }}
      />
      <PageIntro
        eyebrow="Engineering walkthrough"
        title="Full-stack architecture"
        description={description}
        path="/architecture"
      />
      <article className="marketing-container py-14 sm:py-18">
        <section aria-labelledby="request-flow-heading">
          <p className="marketing-eyebrow">Request flow</p>
          <h2 id="request-flow-heading" className="section-title mt-3">
            One identity, independently enforced.
          </h2>
          <div
            className="architecture-flow mt-9"
            role="img"
            aria-label="Browser to Next.js server to authenticated Supabase client to PostgreSQL row-level security"
          >
            {[
              ["Browser", "Forms and task interactions"],
              ["Next.js", "SSR claims and Zod validation"],
              ["Supabase client", "Cookie-backed user context"],
              ["PostgreSQL", "Constraints, grants, and RLS"],
            ].map(([title, text], index) => (
              <div key={title} className="contents">
                <div className="flow-node">
                  <strong>{title}</strong>
                  <span>{text}</span>
                </div>
                {index < 3 ? (
                  <ArrowRight className="flow-arrow" aria-hidden="true" />
                ) : null}
              </div>
            ))}
          </div>
        </section>
        <section className="mt-18" aria-labelledby="boundaries-heading">
          <h2 id="boundaries-heading" className="section-title">
            Boundaries with specific responsibilities
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {boundaries.map(([Icon, title, text]) => (
              <section key={title} className="marketing-card">
                <div className="icon-tile">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
                <p className="text-muted-foreground mt-2 leading-7">{text}</p>
              </section>
            ))}
          </div>
        </section>
        <section
          className="prose-panel mt-18"
          aria-labelledby="tradeoffs-heading"
        >
          <h2 id="tradeoffs-heading" className="section-title">
            Deliberate beta trade-offs
          </h2>
          <div className="mt-7 grid gap-7 md:grid-cols-2">
            <div>
              <h3>Kept intentionally simple</h3>
              <p>
                Private per-user tasks avoid premature workspace roles,
                invitation flows, comments, attachments, and realtime
                collaboration.
              </p>
            </div>
            <div>
              <h3>Prepared to scale</h3>
              <p>
                Pagination, indexed filters, migration history, narrow client
                boundaries, typed contracts, and RLS create a stable path to
                teams and observability.
              </p>
            </div>
            <div>
              <h3>REST retained for clarity</h3>
              <p>
                Same-origin Route Handlers keep client reads and mutations
                observable and preserve an API surface that could support
                another trusted client.
              </p>
            </div>
            <div>
              <h3>Exact counts retained for beta</h3>
              <p>
                Page-number navigation is appropriate at current scale; cursor
                pagination and approximate counts become worthwhile only with
                measured volume.
              </p>
            </div>
          </div>
        </section>
      </article>
      <section className="marketing-container pb-20 text-center">
        <Link href="/security" className="text-link">
          Continue to the security model{" "}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
