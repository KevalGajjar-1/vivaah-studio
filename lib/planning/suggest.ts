import { fileTemplates } from "@/lib/catalog";
import type { CatalogTemplate, TemplateCategory } from "@/lib/catalog/types";
import type { CeremonyStyle } from "@/lib/types";

const STYLE_TAGS: Record<string, string[]> = {
  classic: ["classic", "floral"],
  hindu: ["hindu", "royal", "festive", "floral"],
  christian: ["christian", "classic"],
  muslim: ["muslim"],
  "south-indian": ["south-indian", "hindu"],
  modern: ["modern"],
  boho: ["boho"],
  rustic: ["rustic"],
  "art-deco": ["art-deco"],
};

const VIBE_TAGS: Record<string, string[]> = {
  royal: ["royal", "festive"],
  warm: ["classic", "floral"],
  modern: ["modern"],
  festive: ["festive", "royal"],
  minimal: ["modern"],
  romantic: ["floral", "classic", "boho"],
};

export function suggestCatalogTemplates(input: {
  style?: CeremonyStyle | string;
  vibe?: string;
  category?: TemplateCategory | string;
  kind?: "image" | "video" | "all";
  limit?: number;
}): CatalogTemplate[] {
  const styleTags = STYLE_TAGS[input.style || "classic"] || STYLE_TAGS.classic;
  const vibeKey = (input.vibe || "").toLowerCase();
  const vibeTags = VIBE_TAGS[vibeKey] || [];
  const wanted = new Set([...styleTags, ...vibeTags]);
  const category = input.category && input.category !== "all" ? input.category : undefined;
  const kind = input.kind && input.kind !== "all" ? input.kind : undefined;
  const scored = fileTemplates
    .filter((t) => (kind ? t.kind === kind : true))
    .map((t) => {
      let score = 0;
      if (category && t.category === category) score += 6;
      for (const tag of t.tags) {
        if (wanted.has(tag)) score += 3;
      }
      if (t.kind === "image") score += 0.2;
      return { t, score };
    })
    .sort((a, b) => b.score - a.score);
  const limit = input.limit || 9;
  const unique: CatalogTemplate[] = [];
  for (const row of scored) {
    if (!unique.some((item) => item.id === row.t.id)) unique.push(row.t);
    if (unique.length >= limit) break;
  }
  return unique;
}
