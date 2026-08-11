import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Filter,
  Gauge,
  MoonStar,
  Search,
} from "lucide-react";

import { createPageMetadata } from "@/config/site";
import { PageIntro } from "@/features/marketing/components/page-intro";

const description =
  "Review TaskFlow's complete task workflow: validated CRUD, priority and due-date planning, responsive views, URL filters, metrics, themes, and resilient feedback.";

export const metadata = createPageMetadata({
  title: "Task dashboard features",
  description,
  path: "/features",
});

const features = [
  {
    icon: CheckCircle2,
    title: "Complete task lifecycle",
    text: "Create, edit, complete, reopen, and delete tasks with validated forms and recoverable errors.",
  },
  {
    icon: Search,
    title: "Focused discovery",
    text: "Debounced title search keeps typing responsive while the URL remains a shareable source of truth.",
  },
  {
    icon: Filter,
    title: "Useful filters",
    text: "Combine status and priority filters, sort nullable due dates, and paginate without unbounded reads.",
  },
  {
    icon: Gauge,
    title: "Accurate summary",
    text: "Total, completed, pending, and local-date overdue metrics arrive from one owner-scoped aggregate.",
  },
  {
    icon: CalendarClock,
    title: "Calendar-aware planning",
    text: "Nullable calendar dates avoid timezone drift and refresh overdue state when the local day changes.",
  },
  {
    icon: MoonStar,
    title: "Responsive themes",
    text: "Light, dark, and system choices support desktop, tablet, and mobile layouts without hiding content.",
  },
];

export default function FeaturesPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageIntro
        eyebrow="Working product"
        title="Task dashboard features"
        description={description}
        path="/features"
      />
      <section
        className="marketing-section pt-14"
        aria-labelledby="feature-grid-heading"
      >
        <div className="marketing-container">
          <h2 id="feature-grid-heading" className="sr-only">
            Product capabilities
          </h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
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
      <section className="marketing-section border-border bg-card/45 border-y">
        <div className="marketing-container grid gap-10 lg:grid-cols-2">
          <div>
            <p className="marketing-eyebrow">Interaction model</p>
            <h2 className="section-title mt-3">
              Fast when successful. Clear when not.
            </h2>
          </div>
          <ol className="space-y-5">
            {[
              [
                "1",
                "Validate early",
                "React Hook Form and Zod provide immediate, labeled feedback without replacing server validation.",
              ],
              [
                "2",
                "Update confidently",
                "Completion and deletion use optimistic cache updates with complete rollback snapshots.",
              ],
              [
                "3",
                "Reconcile authoritatively",
                "Queries and metrics refresh from the user-scoped API after every mutation settles.",
              ],
            ].map(([number, title, text]) => (
              <li key={number} className="flex gap-4">
                <span className="step-number">{number}</span>
                <div>
                  <h3 className="font-extrabold">{title}</h3>
                  <p className="text-muted-foreground mt-1 leading-7">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="marketing-container py-18 text-center">
        <h2 className="section-title">
          The feature list is backed by a live implementation.
        </h2>
        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl leading-7">
          Create a private-beta account to exercise the complete workflow, or
          inspect how the boundaries are designed.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/signup" className="button-primary justify-center">
            Try TaskFlow <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/architecture"
            className="button-secondary justify-center"
          >
            Read the architecture
          </Link>
        </div>
      </section>
    </main>
  );
}
