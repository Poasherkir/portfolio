import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/portfolio";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: "/", priority: 1 },
    { path: "/projects", priority: 0.9 },
    { path: "/stack", priority: 0.8 },
    { path: "/about", priority: 0.8 },
    { path: "/contact", priority: 0.8 },
    { path: "/cv", priority: 0.6 },
    // Low priority but present: search engines treat a site with reachable,
    // indexed legal pages as more legitimate than one without them.
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: absoluteUrl(r.path),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: r.priority,
    })),
    ...caseStudies.map((p) => ({
      url: absoluteUrl(`/projects/${p.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
