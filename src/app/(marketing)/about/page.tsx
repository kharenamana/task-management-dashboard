import Link from "next/link";
import { ArrowRight, Braces, Compass, Gauge, UsersRound } from "lucide-react";

import { createPageMetadata, siteConfig } from "@/config/site";
import { PageIntro } from "@/features/marketing/components/page-intro";

const description =
  "Read the TaskFlow engineering case study: the product problem, architecture decisions, implementation trade-offs, quality process, and production scaling path.";

export const metadata = createPageMetadata({
  title: "Engineering case study",
  description,
  path: "/about",
});

const decisions = [
  [
    Compass,
    "Start with user isolation",
    "The beta defines multi-user as private accounts with personal tasks, avoiding pretend collaboration features without a complete authorization model.",
  ],
  [
    Braces,
    "Share contracts, not trust",
    "Zod schemas and generated database types reduce drift, while the client, server, and database still validate their own boundaries.",
  ],
  [
    Gauge,
    "Optimize measured paths",
    "Pagination, one-query metrics, route-scoped providers, dynamic dialogs, and narrow proxy coverage address concrete cost centers.",
  ],
  [
    UsersRound,
    "Design for real interaction",
    "Keyboard access, failure recovery, responsive task views, and explicit empty states are treated as product behavior—not polish afterthoughts.",
  ],
] as const;

export default function AboutPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageIntro
        eyebrow="Portfolio narrative"
        title="Engineering case study"
        description={description}
        path="/about"
      />
      <section className="marketing-section pt-14">
        <div className="marketing-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="marketing-eyebrow">The problem</p>
            <h2 className="section-title mt-3">
              A credible demo must survive real users.
            </h2>
          </div>
          <div className="prose-copy">
            <p>
              A task dashboard is familiar enough to make product decisions easy
              to evaluate, but deep enough to expose engineering quality.
              Authentication, ownership, optimistic state, calendar dates, URL
              filters, responsive interaction, accessibility, and deployment all
              have failure modes that a static mock cannot demonstrate.
            </p>
            <p>
              TaskFlow therefore treats the portfolio as a small production
              system. Every visible capability maps to a documented
              implementation boundary, verification step, and known limitation.
            </p>
          </div>
        </div>
      </section>
      <section className="marketing-section border-border bg-card/45 border-y">
        <div className="marketing-container">
          <p className="marketing-eyebrow">Key decisions</p>
          <h2 className="section-title mt-3">What shaped the build</h2>
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {decisions.map(([Icon, title, text]) => (
              <article key={title} className="marketing-card">
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
        <div className="marketing-container grid gap-8 md:grid-cols-3">
          {[
            [
              "Foundation",
              "Strict tooling, documented boundaries, environment validation, and CI before feature work.",
            ],
            [
              "Secure product",
              "Hosted migrations, RLS verification, SSR Auth, validated CRUD, and responsive task interaction.",
            ],
            [
              "Release discipline",
              "Focused commits, pre-push review, preview verification, and explicit commercial-launch gaps.",
            ],
          ].map(([title, text], index) => (
            <article key={title} className="relative pl-12">
              <span className="step-number absolute top-0 left-0">
                {index + 1}
              </span>
              <h2 className="font-extrabold">{title}</h2>
              <p className="text-muted-foreground mt-2 leading-7">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="marketing-container pb-20">
        <div className="cta-panel">
          <div>
            <p className="text-sm font-bold text-violet-200">
              Review the implementation
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">
              The repository is part of the case study.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="button-light justify-center"
            >
              View source
            </a>
            <Link
              href="/features"
              className="button-dark-outline justify-center"
            >
              Explore features{" "}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
