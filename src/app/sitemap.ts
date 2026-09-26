import type { MetadataRoute } from "next";
import { PROJECTS, SITE } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url, lastModified: new Date("2026-09-26"), priority: 1 },
    ...PROJECTS.map((p) => ({
      url: `${SITE.url}/work/${p.slug}`,
      lastModified: new Date("2026-09-26"),
      priority: 0.8,
    })),
  ];
}
