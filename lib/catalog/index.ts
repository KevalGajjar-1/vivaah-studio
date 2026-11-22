import type { CatalogTemplate } from "./types";
import { fileTemplates } from "./templates";

export * from "./types";
export { fileTemplates, imageTemplates, videoTemplates, fieldsFromSample } from "./templates";

export function getFileTemplate(id: string): CatalogTemplate | undefined {
  return fileTemplates.find((t) => t.id === id);
}

export function mergeTemplates(dbTemplates: CatalogTemplate[] = []): CatalogTemplate[] {
  const map = new Map<string, CatalogTemplate>();
  for (const t of fileTemplates) map.set(t.id, t);
  for (const t of dbTemplates) map.set(t.id, t);
  return [...map.values()];
}

export function filterTemplates(
  list: CatalogTemplate[],
  opts: { category?: string; kind?: string; tag?: string; q?: string },
): CatalogTemplate[] {
  const q = (opts.q || "").trim().toLowerCase();
  return list.filter((t) => {
    if (opts.category && opts.category !== "all" && t.category !== opts.category) return false;
    if (opts.kind && opts.kind !== "all" && t.kind !== opts.kind) return false;
    if (opts.tag && opts.tag !== "all" && !t.tags.includes(opts.tag)) return false;
    if (q) {
      const hay = `${t.name} ${t.tagline} ${t.description} ${t.category} ${t.tags.join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
