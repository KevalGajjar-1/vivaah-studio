"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InvitationCard } from "@/components/invites/InvitationCard";
import { InviteFormFields } from "@/components/create/InviteFormFields";
import { inviteSearchParam } from "@/lib/codec";
import { emptyInvite, getTemplate, suggestTemplateFromStyle, templates } from "@/lib/templates";
import { generateFallbackWording } from "@/lib/wording";
import type { InviteData } from "@/lib/types";

type Source = "ai" | "fallback" | null;

export function CreateStudio({ initial }: { initial: InviteData }) {
  const router = useRouter();
  const [data, setData] = useState<InviteData>(initial);
  const [source, setSource] = useState<Source>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const preview = useMemo(() => {
    const fallback = !data.wording
      ? generateFallbackWording(data)
      : null;
    return {
      ...data,
      heading: data.heading || fallback?.heading || "",
      wording: data.wording || fallback?.wording || "",
      hostLine: data.hostLine || fallback?.hostLine || "",
      template: data.template || suggestTemplateFromStyle(data.style),
    };
  }, [data]);

  function patch(next: Partial<InviteData>) {
    setData((current) => {
      const merged = { ...current, ...next };
      if (next.style && !next.template) {
        merged.template = suggestTemplateFromStyle(next.style);
      }
      return merged;
    });
  }

  async function generate() {
    setBusy(true);
    setError("");
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
        template: current.template || result.suggestedTemplate || current.template,
      }));
      setSource(result.source === "ai" ? "ai" : "fallback");
      setReason(result.reason || "");
    } catch {
      const local = generateFallbackWording(data);
      setData((current) => ({
        ...current,
        heading: local.heading,
        wording: local.wording,
        hostLine: local.hostLine,
      }));
      setSource("fallback");
      setError("Could not reach the writer. Studio wording is shown instead.");
    } finally {
      setBusy(false);
    }
  }

  async function suggest() {
    setBusy(true);
    try {
      const response = await fetch("/api/suggest-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.suggestedTemplate) {
        setData((current) => ({ ...current, template: result.suggestedTemplate }));
        setReason(result.reason || "");
        setSource(result.source === "ai" ? "ai" : "fallback");
      }
    } finally {
      setBusy(false);
    }
  }

  function openEditor() {
    const payload = preview;
    router.push(`/editor?${inviteSearchParam(payload)}`);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_400px]">
      <div>
        <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">The AI harness</p>
        <h1 className="font-serif mt-2 text-4xl">Compose your invitation</h1>
        <p className="mt-3 max-w-xl text-[#6b5a4c]">
          Share the essential details. We will write a polished invitation in your language, suggest
          a template, and open a live editor you can refine and share.
        </p>
        <div className="mt-8">
          <InviteFormFields data={data} onChange={patch} />
        </div>
        <div className="mt-6 field">
          <label htmlFor="heading">Heading</label>
          <input id="heading" value={data.heading || ""} onChange={(e) => patch({ heading: e.target.value })} />
        </div>
        <div className="mt-4 field">
          <label htmlFor="hostLine">Host line</label>
          <input id="hostLine" value={data.hostLine || ""} onChange={(e) => patch({ hostLine: e.target.value })} />
        </div>
        <div className="mt-4 field">
          <label htmlFor="wording">Invitation wording</label>
          <textarea
            id="wording"
            rows={5}
            value={data.wording}
            onChange={(e) => patch({ wording: e.target.value })}
            placeholder="Generate wording, then edit freely."
          />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="btn-gold" onClick={generate} disabled={busy}>
            {busy ? "Composing…" : "Write with AI"}
          </button>
          <button type="button" className="btn-outline" onClick={suggest} disabled={busy}>
            Suggest a template
          </button>
          <button type="button" className="btn-outline" onClick={openEditor}>
            Open in editor
          </button>
        </div>
        {source ? (
          <p className="mt-4 text-sm text-[#6b5a4c]">
            {source === "ai"
              ? "Wording composed by AI via Vercel AI Gateway."
              : "Studio template wording is being used. Add an AI Gateway key or deploy with Vercel OIDC to enable the model-backed writer."}
            {reason ? ` (${reason})` : ""}
          </p>
        ) : null}
        {error ? <p className="mt-2 text-sm text-[#6b1d2a]">{error}</p> : null}
      </div>
      <aside className="lg:sticky lg:top-24">
        <p className="text-[11px] tracking-[0.18em] uppercase text-[#8a7a6a]">Live preview</p>
        <div className="mt-3">
          <InvitationCard data={preview} variant="preview" cardId="create-preview" />
        </div>
        <div className="mt-5">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#8a7a6a]">Template</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {templates.map((template) => (
              <button
                key={template.slug}
                type="button"
                onClick={() => patch({ template: template.slug, style: template.style })}
                className={`rounded-md border px-2 py-2 text-left text-[11px] leading-tight ${
                  preview.template === template.slug
                    ? "border-[#6b1d2a] bg-[#6b1d2a] text-[#f7f1e8]"
                    : "border-[#e0d4c6] bg-white text-[#4a3d34] hover:border-[#b8952a]"
                }`}
              >
                {template.name}
              </button>
            ))}
          </div>
          <Link href={`/templates/${preview.template}`} className="mt-3 inline-block text-xs text-[#6b1d2a] hover:underline">
            View {getTemplate(preview.template).name} sample
          </Link>
        </div>
      </aside>
    </div>
  );
}
