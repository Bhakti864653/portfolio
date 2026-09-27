import type { MetadataRoute } from "next";
import { PROJECTS, SITE } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-27");
  return [
    { url: SITE.url, lastModified, priority: 1 },
    ...["work", "journey", "about", "contact"].map((page) => ({
      url: `${SITE.url}/${page}`,
      lastModified,
      priority: 0.9,
    })),
    ...PROJECTS.map((p) => ({
      url: `${SITE.url}/work/${p.slug}`,
      lastModified,
      priority: 0.8,
    })),
  ];
}
