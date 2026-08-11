import Link from "next/link";

import { absoluteUrl, createPageMetadata } from "@/config/site";
import { PageIntro } from "@/features/marketing/components/page-intro";
import { StructuredData } from "@/features/marketing/components/structured-data";

const description =
  "Answers about TaskFlow accounts, task privacy, Supabase security, portfolio goals, technology choices, beta constraints, and local or hosted use.";

export const metadata = createPageMetadata({
  title: "Frequently asked questions",
  description,
  path: "/faq",
});

const questions = [
  {
    question: "Is TaskFlow a working application or a UI concept?",
    answer:
      "It is a working multi-user application. Registration, email verification, password recovery, private persisted tasks, filters, metrics, and mutations use a hosted Supabase project rather than mock data.",
  },
  {
    question: "Can another user read my tasks?",
    answer:
      "Task rows are protected by PostgreSQL row-level security and explicit owner predicates. Transactional two-user checks verify that cross-user select, update, delete, insert, and metric counting are denied.",
  },
  {
    question: "Why use Route Handlers with Supabase?",
    answer:
      "They provide a clear same-origin HTTP contract for TanStack Query, repeat Zod validation, normalize errors, and keep the option of another trusted client. Supabase RLS remains the final authorization boundary.",
  },
  {
    question: "Why is collaboration not included?",
    answer:
      "Shared workspaces require invitations, roles, membership lifecycle rules, auditing, and a different RLS model. The private beta keeps ownership complete instead of shipping partial collaboration security.",
  },
  {
    question: "What are the current beta limitations?",
    answer:
      "The project uses free-tier infrastructure and has no custom API rate limiter, MFA enforcement, audit log, team model, attachments, or realtime collaboration. Email delivery also depends on Supabase Auth configuration.",
  },
  {
    question: "Can the project be run locally?",
    answer:
      "Yes. The repository documents Node and pnpm setup, environment variables, local Supabase migrations, deterministic development-only seed data, tests, and production builds.",
  },
];

export default function FaqPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <StructuredData
        id="faq-structured-data"
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          url: absoluteUrl("/faq"),
          mainEntity: questions.map(({ question, answer }) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        }}
      />
      <PageIntro
        eyebrow="Clear answers"
        title="Frequently asked questions"
        description={description}
        path="/faq"
      />
      <section
        className="marketing-container max-w-4xl py-14 sm:py-18"
        aria-label="TaskFlow questions and answers"
      >
        <div className="space-y-4">
          {questions.map(({ question, answer }) => (
            <details key={question} className="faq-item group">
              <summary className="cursor-pointer list-none pr-10 text-lg font-extrabold marker:hidden">
                {question}
                <span className="faq-marker" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="text-muted-foreground mt-4 max-w-3xl leading-7">
                {answer}
              </p>
            </details>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Looking for implementation detail?
          </p>
          <Link href="/architecture" className="text-link mt-3">
            Read the architecture case study
          </Link>
        </div>
      </section>
    </main>
  );
}
