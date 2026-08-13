import type { MetadataRoute } from "next";

import { absoluteUrl, siteConfig } from "@/config/site";

const lastModified = new Date("2026-08-11T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return siteConfig.publicPaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/privacy" ? 0.4 : 0.7,
  }));
}
