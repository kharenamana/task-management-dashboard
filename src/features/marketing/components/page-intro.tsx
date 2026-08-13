import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { absoluteUrl, siteConfig } from "@/config/site";
import { StructuredData } from "@/features/marketing/components/structured-data";

export function PageIntro({
  eyebrow,
  title,
  description,
  path,
}: {
  eyebrow: string;
  title: string;
  description: string;
  path: string;
}) {
  return (
    <>
      <StructuredData
        id="breadcrumb-structured-data"
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: siteConfig.name,
              item: absoluteUrl("/"),
            },
            {
              "@type": "ListItem",
              position: 2,
              name: title,
              item: absoluteUrl(path),
            },
          ],
        }}
      />
      <div className="marketing-container pt-12 sm:pt-16">
        <nav aria-label="Breadcrumb" className="text-muted-foreground text-sm">
          <ol className="flex items-center gap-2">
            <li>
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-4" />
            </li>
            <li aria-current="page" className="text-foreground font-semibold">
              {title}
            </li>
          </ol>
        </nav>
        <div className="mt-10 max-w-3xl">
          <p className="marketing-eyebrow">{eyebrow}</p>
          <h1 className="marketing-title mt-4">{title}</h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8 text-pretty">
            {description}
          </p>
        </div>
      </div>
    </>
  );
}
