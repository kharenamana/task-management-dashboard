import Link from "next/link";
import {
  ArrowRight,
  Cookie,
  KeyRound,
  LockKeyhole,
  ScanSearch,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import { createPageMetadata } from "@/config/site";
import { PageIntro } from "@/features/marketing/components/page-intro";

const description =
  "Understand TaskFlow's defense-in-depth security model across Supabase Auth, SSR cookies, server validation, PostgreSQL row-level security, and response headers.";

export const metadata = createPageMetadata({
  title: "Security model",
  description,
  path: "/security",
});

const controls = [
  [
    Cookie,
    "SSR-compatible sessions",
    "Supabase session tokens use secure cookie handling and proxy-based refresh; private routes repeat authorization on the server.",
  ],
  [
    KeyRound,
    "Publishable key only",
    "The browser receives only the project URL and publishable key. No service-role credential exists in client code or CI.",
  ],
  [
    ShieldCheck,
    "Owner-scoped RLS",
    "Every task operation requires auth.uid() to equal user_id, including both USING and WITH CHECK for updates.",
  ],
  [
    ScanSearch,
    "Validation at boundaries",
    "Shared Zod contracts validate forms and HTTP input independently; PostgreSQL adds constraints beneath both.",
  ],
  [
    LockKeyhole,
    "Conservative responses",
    "Missing and non-owned IDs share the same 404 response, while API errors are normalized and sanitized.",
  ],
] as const;

export default function SecurityPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageIntro
        eyebrow="Defense in depth"
        title="Security model"
        description={description}
        path="/security"
      />
      <section className="marketing-section pt-14">
        <div className="marketing-container grid gap-5 md:grid-cols-2">
          {controls.map(([Icon, title, text]) => (
            <article key={title} className="marketing-card">
              <div className="icon-tile">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-xl font-extrabold">{title}</h2>
              <p className="text-muted-foreground mt-2 leading-7">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="marketing-section border-border bg-card/45 border-y">
        <div className="marketing-container grid gap-9 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="marketing-eyebrow">Responsible claims</p>
            <h2 className="section-title mt-3">
              What this beta does not promise.
            </h2>
          </div>
          <div className="border-border bg-background rounded-3xl border p-6 sm:p-8">
            <div className="flex gap-4">
              <TriangleAlert
                className="mt-1 size-6 shrink-0 text-amber-600"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-extrabold">Known launch work remains</h3>
                <p className="text-muted-foreground mt-2 leading-7">
                  The beta has no custom API rate limiter, MFA enforcement,
                  audit log, enterprise backup process, team roles, or formal
                  incident-response program. Transactional email reliability and
                  free-tier quotas also depend on external services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="marketing-container py-18 text-center">
        <h2 className="section-title">
          Security is documented, tested, and still treated as ongoing work.
        </h2>
        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl leading-7">
          The repository includes migrations, ownership checks, security
          decisions, and a commercial-launch checklist.
        </p>
        <Link href="/architecture" className="text-link mt-6">
          See how the boundaries connect{" "}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
