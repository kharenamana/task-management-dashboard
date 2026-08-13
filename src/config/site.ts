import type { Metadata } from "next";

import { siteUrl } from "@/lib/env";

export const siteConfig = {
  name: "TaskFlow",
  url: siteUrl,
  description:
    "A production-minded task management dashboard and full-stack engineering case study built with Next.js, Supabase, and strict TypeScript.",
  githubUrl: "https://github.com/kharenamana/task-management-dashboard",
  navigation: [
    { href: "/features", label: "Features" },
    { href: "/architecture", label: "Architecture" },
    { href: "/security", label: "Security" },
    { href: "/about", label: "Case study" },
    { href: "/faq", label: "FAQ" },
  ],
  publicPaths: [
    "/",
    "/features",
    "/architecture",
    "/security",
    "/about",
    "/faq",
    "/privacy",
  ],
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.url}/`).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
