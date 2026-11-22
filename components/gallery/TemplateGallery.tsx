"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, STYLE_TAGS, type CatalogTemplate } from "@/lib/catalog/types";
import { filterTemplates } from "@/lib/catalog";
import { rupees } from "@/lib/slug";
import { TemplateThumb } from "@/components/render/TemplateThumb";

export function TemplateGallery({ templates }: { templates: CatalogTemplate[] }) {
  const [category, setCategory] = useState("all");
  const [kind, setKind] = useState("all");
  const [tag, setTag] = useState("all");
  const [q, setQ] = useState("");

  const visible = useMemo(
    () => filterTemplates(templates, { category, kind, tag, q }),
    [templates, category, kind, tag, q],
  );

  const images = visible.filter((t) => t.kind === "image").length;
  const videos = visible.filter((t) => t.kind === "video").length;

  return (
    <div>
      <div className="mt-8 flex flex-col gap-4">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search templates, styles, events…"
          className="w-full rounded-full border border-[#e0d4c6] bg-white px-5 py-3 text-sm outline-none focus:border-[#b8952a]"
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              className={`rounded-full border px-3 py-1 text-[12px] ${
                category === item.id
                  ? "border-[#6b1d2a] bg-[#6b1d2a] text-[#f7f1e8]"
                  : "border-[#e0d4c6] bg-white hover:border-[#b8952a]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {["all", "image", "video"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setKind(item)}
              className={`rounded-full border px-3 py-1 text-[12px] ${
                kind === item
                  ? "border-[#6b1d2a] bg-[#6b1d2a] text-[#f7f1e8]"
                  : "border-[#e0d4c6] bg-white hover:border-[#b8952a]"
              }`}
            >
              {item === "all" ? "All types" : item === "image" ? "Still cards" : "Video invites"}
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-[#e0d4c6]" />
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="rounded-full border border-[#e0d4c6] bg-white px-3 py-1 text-[12px]"
          >
            <option value="all">All styles</option>
            {STYLE_TAGS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm text-[#8a7a6a]">
          {visible.length} templates · {images} still · {videos} video
        </p>
      </div>
      <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((template) => (
          <article key={template.id} className="group">
            <Link href={`/templates/${template.id}`} className="block">
              <TemplateThumb
                template={template}
                className="rounded-sm shadow-[0_16px_40px_-24px_rgba(40,16,8,0.5)] transition duration-300 group-hover:-translate-y-1"
              />
            </Link>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-2xl">
                    <Link href={`/templates/${template.id}`} className="hover:text-[#6b1d2a]">
                      {template.name}
                    </Link>
                  </h2>
                  <span className="rounded-full bg-[#f0e6d6] px-2 py-0.5 text-[10px] tracking-wide uppercase text-[#6b1d2a]">
                    {template.kind === "video" ? "Video" : "Card"}
                  </span>
                </div>
                <p className="text-sm text-[#6b5a4c]">{template.tagline}</p>
                <p className="mt-1 text-xs text-[#8a7a6a]">
                  {template.category.replace("-", " ")} · from {rupees(template.pricePaise)}
                </p>
              </div>
              <Link
                href={`/editor?template=${template.id}`}
                className="shrink-0 text-xs tracking-wide text-[#6b1d2a] uppercase hover:underline"
              >
                Use this
              </Link>
            </div>
          </article>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="py-20 text-center text-[#6b5a4c]">No templates match those filters yet.</p>
      ) : null}
    </div>
  );
}
