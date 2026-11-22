import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { templates } from "@/lib/templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/templates`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/create`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/editor`, changeFrequency: "monthly", priority: 0.5 },
    ...templates.map((t) => ({
      url: `${base}/templates/${t.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
