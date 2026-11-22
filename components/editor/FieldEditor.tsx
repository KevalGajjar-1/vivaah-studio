"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InvitationView } from "@/components/render/InvitationView";
import { ExportActions } from "@/components/editor/ExportActions";
import { fileTemplates, getFileTemplate } from "@/lib/catalog";
import type { CatalogTemplate } from "@/lib/catalog/types";
import { fieldsFromInvite, designTitle, inviteFromFields } from "@/lib/fields";
import { randomSlug } from "@/lib/slug";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/client";
import { generateFallbackWording } from "@/lib/wording";
import type { InviteData } from "@/lib/types";

type SavedDesign = {
  id: string;
  title: string;
  template_id: string;
  kind: "image" | "video";
  fields: Record<string, string>;
  is_unlocked: boolean;
  unlock_requested: boolean;
  share_slug: string | null;
  photo_path: string | null;
};

export function FieldEditor({
  initialTemplateId,
  initialFields,
  design,
  photoUrl,
}: {
  initialTemplateId: string;
  initialFields: Record<string, string>;
  design?: SavedDesign | null;
  photoUrl?: string | null;
}) {
  const router = useRouter();
  const [templateId, setTemplateId] = useState(initialTemplateId);
  const [fields, setFields] = useState(initialFields);
  const [photo, setPhoto] = useState<string | null>(photoUrl || initialFields.photo || null);
  const [source, setSource] = useState<"ai" | "fallback" | null>(null);
  const [busy, setBusy] = useState(false);
  const [saveState, setSaveState] = useState("");
  const [designState, setDesignState] = useState(design || null);
  const [signedIn, setSignedIn] = useState(Boolean(design));
  const timer = useRef<number | null>(null);

  const template = useMemo(
    () => getFileTemplate(templateId) || getFileTemplate("classic-floral") as CatalogTemplate,
    [templateId],
  );

  const previewFields = useMemo(() => {
    if (fields.wording) return { ...fields, photo: photo || fields.photo || "" };
    const invite = inviteFromFields(template.id, fields);
    const fallback = generateFallbackWording(invite);
    return {
      ...fields,
      heading: fields.heading || fallback.heading,
      wording: fallback.wording,
      hostLine: fields.hostLine || fallback.hostLine,
      photo: photo || fields.photo || "",
    };
  }, [fields, photo, template.id]);

  useEffect(() => {
    if (design) return;
    if (!isSupabaseConfigured()) return;
    createClient()
      .auth.getUser()
      .then(({ data }) => setSignedIn(Boolean(data.user)));
  }, [design]);

  useEffect(() => {
    if (designState) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      window.history.replaceState(null, "", `/editor?template=${encodeURIComponent(templateId)}`);
    }, 400);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [fields, templateId, designState]);

  useEffect(() => {
    if (!designState) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      if (!isSupabaseConfigured()) return;
      setSaveState("Saving…");
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from("designs")
          .update({
            template_id: templateId,
            kind: template.kind,
            fields,
            title: designTitle(fields, designState.title),
            updated_at: new Date().toISOString(),
          })
          .eq("id", designState.id);
        if (error) throw error;
        setSaveState("Saved");
      } catch {
        setSaveState("Could not save");
      }
    }, 700);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [fields, templateId, template.kind, designState]);

  function patch(next: Record<string, string>) {
    setFields((current) => ({ ...current, ...next }));
  }

  async function generate() {
    setBusy(true);
    try {
      const payload: InviteData = inviteFromFields(template.id, fields);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      patch({
        heading: result.heading || fields.heading,
        wording: result.wording || fields.wording,
        hostLine: result.hostLine || fields.hostLine,
      });
      setSource(result.source === "ai" ? "ai" : "fallback");
    } finally {
      setBusy(false);
    }
  }

  async function saveToAccount() {
    if (!isSupabaseConfigured()) return;
    setSaveState("Saving…");
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      window.localStorage.setItem("vivaah-draft", JSON.stringify({ templateId, fields }));
      router.push(`/login?next=${encodeURIComponent("/editor?restore=1")}`);
      return;
    }
    const { data, error } = await supabase
      .from("designs")
      .insert({
        title: designTitle(fields),
        template_id: templateId,
        kind: template.kind,
        fields,
        status: "draft",
        share_slug: randomSlug(),
      })
      .select("*")
      .single();
    if (error || !data) {
      setSaveState(error?.message || "Could not save");
      return;
    }
    setDesignState(data as SavedDesign);
    setSaveState("Saved");
    router.replace(`/designs/${data.id}`);
  }

  async function requestUnlock() {
    if (!designState) return;
    const supabase = createClient();
    const { error } = await supabase.rpc("request_unlock", { p_design_id: designState.id });
    if (error) {
      setSaveState(error.message);
      return;
    }
    setDesignState({ ...designState, unlock_requested: true });
  }

  async function onPhoto(file: File) {
    const local = URL.createObjectURL(file);
    setPhoto(local);
    if (!designState || !isSupabaseConfigured()) {
      patch({ photo: local });
      return;
    }
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    const path = `${auth.user.id}/${designState.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("invitation-photos").upload(path, file, { upsert: true });
    if (error) {
      setSaveState(error.message);
      return;
    }
    const { data } = supabase.storage.from("invitation-photos").getPublicUrl(path);
    setPhoto(data.publicUrl);
    patch({ photo: data.publicUrl });
    await supabase.from("designs").update({ photo_path: path }).eq("id", designState.id);
  }

  const unlocked = Boolean(designState?.is_unlocked);
  const shareUrl =
    unlocked && designState?.share_slug
      ? typeof window !== "undefined"
        ? `${window.location.origin}/i/${designState.share_slug}`
        : ""
      : undefined;

  const sameKind = fileTemplates.filter((t) => t.kind === template.kind);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <div>
        <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">
          {template.kind === "video" ? "Video invitation" : "Invitation card"}
        </p>
        <h1 className="font-serif mt-2 text-4xl">Change the wording</h1>
        <p className="mt-3 text-sm text-[#6b5a4c]">
          This layout is fixed — typography, ornaments and motion stay as designed. Edit the names,
          date, venue and invitation text, and they appear on the card instantly.
        </p>
        <p className="mt-2 text-xs text-[#8a7a6a]">{saveState}</p>
        <div className="mt-6">
          <label className="text-[11px] tracking-[0.18em] uppercase text-[#8a7a6a]">Template</label>
          <select
            className="mt-1 w-full rounded-lg border border-[#e0d4c6] bg-white px-3 py-2 text-sm"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
          >
            {sameKind.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} · {item.category}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-6 space-y-4">
          {template.fields.map((field) => (
            <div key={field.key} className="field">
              <label htmlFor={field.key}>{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.key}
                  rows={5}
                  placeholder={field.placeholder}
                  value={fields[field.key] || ""}
                  onChange={(e) => patch({ [field.key]: e.target.value })}
                />
              ) : field.type === "photo" ? (
                <input
                  id={field.key}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void onPhoto(file);
                  }}
                />
              ) : (
                <input
                  id={field.key}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={fields[field.key] || ""}
                  onChange={(e) => patch({ [field.key]: e.target.value })}
                />
              )}
            </div>
          ))}
          <div className="field">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              value={fields.language || "en"}
              onChange={(e) => patch({ language: e.target.value })}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="gu">Gujarati</option>
            </select>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" className="btn-outline" onClick={generate} disabled={busy}>
            {busy ? "Rewriting…" : "Rewrite wording"}
          </button>
          {!designState ? (
            <button type="button" className="btn-gold" onClick={saveToAccount}>
              {signedIn ? "Save to My designs" : "Sign in to save"}
            </button>
          ) : null}
          <Link href="/templates" className="btn-outline">
            Library
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
          <ExportActions
            template={template}
            fields={previewFields}
            unlocked={unlocked}
            designId={designState?.id}
            shareUrl={shareUrl}
            onRequestUnlock={requestUnlock}
            unlockPending={designState?.unlock_requested}
          />
        </div>
        <div className={`mx-auto w-full ${template.kind === "video" ? "max-w-[360px]" : "max-w-[520px]"}`}>
          <InvitationView
            template={template}
            fields={previewFields}
            watermark={!unlocked}
            photoUrl={photo}
            playing
          />
        </div>
      </aside>
    </div>
  );
}

export { fieldsFromInvite };
