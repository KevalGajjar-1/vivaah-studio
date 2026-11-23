import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog/posts";
import { fileTemplates } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/templates`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/create`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tools/messages`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tools/hashtags`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/tools/guest-list`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.6 },
    ...blogPosts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    { url: `${base}/editor`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/legal/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/legal/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/legal/refund`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/legal/credits`, changeFrequency: "yearly", priority: 0.3 },
    ...fileTemplates.map((t) => ({
      url: `${base}/templates/${t.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
