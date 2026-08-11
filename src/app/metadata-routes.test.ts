import manifest from "@/app/manifest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { createPageMetadata, siteConfig } from "@/config/site";

describe("public metadata routes", () => {
  it("publishes every canonical public page once", () => {
    const entries = sitemap();
    expect(entries).toHaveLength(siteConfig.publicPaths.length);
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(
      siteConfig.publicPaths.length,
    );
    expect(entries.every((entry) => entry.url.startsWith(siteConfig.url))).toBe(
      true,
    );
  });

  it("keeps private, API, and authentication surfaces out of crawling", () => {
    const route = robots();
    const rules = Array.isArray(route.rules) ? route.rules[0] : route.rules;
    expect(rules?.disallow).toEqual(
      expect.arrayContaining(["/dashboard", "/api/", "/login", "/signup"]),
    );
    expect(route.sitemap).toBe(`${siteConfig.url}/sitemap.xml`);
  });

  it("provides install and canonical metadata without duplicate URL logic", () => {
    const appManifest = manifest();
    const metadata = createPageMetadata({
      title: "Architecture",
      description: "Architecture description",
      path: "/architecture",
    });
    expect(appManifest.start_url).toBe("/");
    expect(appManifest.icons).toHaveLength(2);
    expect(metadata.alternates?.canonical).toBe(
      `${siteConfig.url}/architecture`,
    );
  });
});
