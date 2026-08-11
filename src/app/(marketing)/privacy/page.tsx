import Link from "next/link";

import { createPageMetadata } from "@/config/site";
import { PageIntro } from "@/features/marketing/components/page-intro";

const description =
  "A concise private-beta privacy explanation covering TaskFlow account data, private task records, infrastructure providers, retention, and current user controls.";

export const metadata = createPageMetadata({
  title: "Privacy",
  description,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageIntro
        eyebrow="Private beta"
        title="Privacy"
        description={description}
        path="/privacy"
      />
      <article className="marketing-container max-w-4xl py-14 sm:py-18">
        <div className="prose-panel space-y-9">
          <section>
            <h2>What TaskFlow stores</h2>
            <p>
              TaskFlow stores the email address required for Supabase
              authentication, a profile row linked to that account, and task
              data you choose to enter: title, description, status, priority,
              due date, and timestamps.
            </p>
          </section>
          <section>
            <h2>How task data is isolated</h2>
            <p>
              Tasks are associated with the authenticated account ID. PostgreSQL
              row-level security limits reads and mutations to that owner.
              Application checks and validated API routes provide additional
              boundaries, but RLS remains authoritative.
            </p>
          </section>
          <section>
            <h2>Infrastructure</h2>
            <p>
              Supabase provides authentication and PostgreSQL hosting. Vercel
              hosts the Next.js application and processes application requests.
              Their platform policies and configured regional infrastructure
              also govern operational data.
            </p>
          </section>
          <section>
            <h2>Analytics and advertising</h2>
            <p>
              The current beta does not add advertising trackers, behavioral
              profiling, or a third-party analytics SDK. Standard infrastructure
              logs may still record technical request information for
              reliability and security.
            </p>
          </section>
          <section>
            <h2>Retention and account controls</h2>
            <p>
              The beta supports task deletion but does not yet expose
              self-service account deletion or data export. Those controls,
              documented retention periods, and a formal privacy contact are
              required before commercial launch.
            </p>
          </section>
          <section>
            <h2>Do not store sensitive information</h2>
            <p>
              This portfolio beta is not designed for medical, financial, legal,
              credential, or other highly sensitive records. Use demonstration
              or ordinary personal planning content only.
            </p>
          </section>
        </div>
        <p className="text-muted-foreground mt-10 text-sm">
          Last updated: August 11, 2026. See the{" "}
          <Link
            href="/security"
            className="font-bold underline underline-offset-4"
          >
            security model
          </Link>{" "}
          for implementation details.
        </p>
      </article>
    </main>
  );
}
