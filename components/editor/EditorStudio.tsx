"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { InvitationCard } from "@/components/invites/InvitationCard";
import { InviteFormFields } from "@/components/create/InviteFormFields";
import { DownloadActions } from "@/components/editor/DownloadActions";
import { encodeInvite } from "@/lib/codec";
import { templates } from "@/lib/templates";
import { generateFallbackWording } from "@/lib/wording";
import type { InviteData } from "@/lib/types";

export function EditorStudio({ initial }: { initial: InviteData }) {
  const [data, setData] = useState<InviteData>(initial);
  const [source, setSource] = useState<"ai" | "fallback" | null>(null);
  const [busy, setBusy] = useState(false);
  const timer = useRef<number | null>(null);

  const preview = useMemo(() => {
    if (data.wording) return data;
    const fallback = generateFallbackWording(data);
    return { ...data, heading: fallback.heading, wording: fallback.wording, hostLine: fallback.hostLine };
  }, [data]);

  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const url = `/editor?d=${encodeURIComponent(encodeInvite(preview))}`;
      window.history.replaceState(null, "", url);
    }, 400);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [preview]);

  function patch(next: Partial<InviteData>) {
    setData((current) => ({ ...current, ...next }));
  }

  async function generate() {
    setBusy(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setData((current) => ({
        ...current,
        heading: result.heading || current.heading,
        wording: result.wording || current.wording,
        hostLine: result.hostLine || current.hostLine,
      }));
      setSource(result.source === "ai" ? "ai" : "fallback");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <div>
        <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">Studio editor</p>
        <h1 className="font-serif mt-2 text-4xl">Refine the card</h1>
        <p className="mt-3 text-sm text-[#6b5a4c]">
          Every change appears instantly. Download a print-ready file, or copy a guest link — the
          details live in the URL, no account required.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {templates.map((template) => (
            <button
              key={template.slug}
              type="button"
              onClick={() => patch({ template: template.slug })}
              className={`rounded-full border px-3 py-1 text-[11px] ${
                data.template === template.slug
                  ? "border-[#6b1d2a] bg-[#6b1d2a] text-[#f7f1e8]"
                  : "border-[#e0d4c6] bg-white hover:border-[#b8952a]"
              }`}
            >
              {template.name}
            </button>
          ))}
        </div>
        <div className="mt-6">
          <InviteFormFields data={data} onChange={patch} />
        </div>
        <div className="mt-4 field">
          <label htmlFor="heading">Heading</label>
          <input id="heading" value={data.heading || ""} onChange={(e) => patch({ heading: e.target.value })} />
        </div>
        <div className="mt-4 field">
          <label htmlFor="hostLine">Host line</label>
          <input id="hostLine" value={data.hostLine || ""} onChange={(e) => patch({ hostLine: e.target.value })} />
        </div>
        <div className="mt-4 field">
          <label htmlFor="wording">Wording</label>
          <textarea id="wording" rows={5} value={data.wording} onChange={(e) => patch({ wording: e.target.value })} />
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" className="btn-outline" onClick={generate} disabled={busy}>
            {busy ? "Rewriting…" : "Rewrite with AI"}
          </button>
          <Link href="/create" className="btn-outline">
            Back to composer
          </Link>
        </div>
        {source ? (
          <p className="mt-3 text-sm text-[#6b5a4c]">
            {source === "ai" ? "Rewritten by AI." : "Studio wording is being used (model unavailable)."}
          </p>
        ) : null}
      </div>
      <aside className="lg:sticky lg:top-24">
        <div className="mb-4">
          <DownloadActions data={preview} />
        </div>
        <div className="mx-auto w-full max-w-[520px]" data-print-root>
          <InvitationCard data={preview} variant="full" cardId="editor-preview" />
        </div>
      </aside>
    </div>
  );
}
