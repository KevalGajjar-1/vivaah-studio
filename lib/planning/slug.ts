import { randomSlug } from "@/lib/slug";

function slugPart(value?: string | null): string {
  const latin = (value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return latin.slice(0, 32);
}

export function makeWeddingSlug(partnerA?: string, partnerB?: string): string {
  const base = [slugPart(partnerA), slugPart(partnerB)].filter(Boolean).join("-");
  return `${base || "wedding"}-${randomSlug(4)}`;
}
