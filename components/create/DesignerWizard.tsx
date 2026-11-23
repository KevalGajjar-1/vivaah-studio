"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InvitationView } from "@/components/render/InvitationView";
import { inviteSearchParam } from "@/lib/codec";
import { fileTemplates, getFileTemplate } from "@/lib/catalog";
import type { CatalogTemplate } from "@/lib/catalog/types";
import { defaultPlannedEvents, enabledEvents } from "@/lib/planning/events";
import type { PlannedEvent } from "@/lib/planning/types";
import { suggestCatalogTemplates } from "@/lib/planning/suggest";
import { generateFallbackWording } from "@/lib/wording";
import type { CeremonyStyle, InviteData, Language, Tone } from "@/lib/types";

const tones: { id: Tone; label: string }[] = [
  { id: "warm", label: "Warm" },
  { id: "traditional", label: "Traditional" },
  { id: "formal", label: "Formal" },
  { id: "poetic", label: "Poetic" },
  { id: "modern", label: "Modern" },
  { id: "playful", label: "Playful" },
];

const styles: { id: CeremonyStyle; label: string }[] = [
  { id: "hindu", label: "Hindu" },
  { id: "south-indian", label: "South Indian" },
  { id: "muslim", label: "Muslim / Nikah" },
  { id: "christian", label: "Christian" },
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "boho", label: "Boho" },
  { id: "rustic", label: "Rustic" },
  { id: "art-deco", label: "Art Deco" },
];

type Step = "details" | "events" | "style" | "preview";

const STEPS: Step[] = ["details", "events", "style", "preview"];
const STEP_LABEL: Record<Step, string> = {
  details: "Couple",
  events: "Events",
  style: "Look",
  preview: "Design",
};

function patchEvent(list: PlannedEvent[], key: string, patch: Partial<PlannedEvent>): PlannedEvent[] {
  return list.map((event) => (event.key === key ? { ...event, ...patch } : event));
}

function weddingFromEvents(events: PlannedEvent[]) {
  const wedding = events.find((event) => event.key === "wedding" && event.enabled) || events.find((e) => e.enabled);
  return {
    date: wedding?.date || "",
    time: wedding?.time || "",
    venue: wedding?.venue || "",
    venueAddress: wedding?.venueAddress || "",
  };
}

export function DesignerWizard({ initialTemplate }: { initialTemplate?: string }) {
  const router = useRouter();
  const initial = getFileTemplate(initialTemplate || "") || getFileTemplate("classic-floral")!;
  const [step, setStep] = useState<Step>("details");
  const [partnerA, setPartnerA] = useState("");
  const [partnerB, setPartnerB] = useState("");
  const [familyA, setFamilyA] = useState("");
  const [familyB, setFamilyB] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [events, setEvents] = useState<PlannedEvent[]>(defaultPlannedEvents());
  const [style, setStyle] = useState<CeremonyStyle>("hindu");
  const [tone, setTone] = useState<Tone>("warm");
  const [kind, setKind] = useState<"image" | "video" | "all">("all");
  const [templateId, setTemplateId] = useState(initial.id);
  const [heading, setHeading] = useState("");
  const [hostLine, setHostLine] = useState("");
  const [wording, setWording] = useState("");
  const [busy, setBusy] = useState(false);
  const [source, setSource] = useState<"ai" | "fallback" | null>(null);
  const [error, setError] = useState("");

  const primaryCategory = enabledEvents(events).find((e) => e.key !== "wedding")?.key || "wedding";

  const suggestions = useMemo(
    () =>
      suggestCatalogTemplates({
        style,
        vibe: tone,
        category: primaryCategory === "mehendi" ? "mehendi" : primaryCategory,
        kind,
        limit: 8,
      }),
    [style, tone, primaryCategory, kind],
  );

  const template = (getFileTemplate(templateId) || suggestions[0] || fileTemplates[0]) as CatalogTemplate;

  const invite: InviteData = useMemo(() => {
    const main = weddingFromEvents(events);
    return {
      template: template.id,
      partnerA,
      partnerB,
      date: main.date,
      time: main.time,
      venue: main.venue,
      venueAddress: main.venueAddress,
      heading,
      wording,
      hostLine,
      familyA,
      familyB,
      language,
      tone,
      style,
      events: enabledEvents(events).map((event) => ({
        title: event.title,
        date: event.date,
        time: event.time,
        venue: event.venue,
      })),
    };
  }, [template.id, partnerA, partnerB, events, heading, wording, hostLine, familyA, familyB, language, tone, style]);

  const previewFields = useMemo(() => {
    const fallback = generateFallbackWording(invite);
    return {
      ...template.sample,
      partnerA: partnerA || template.sample.partnerA,
      partnerB: partnerB || template.sample.partnerB,
      date: invite.date || template.sample.date,
      time: invite.time || template.sample.time,
      venue: invite.venue || template.sample.venue,
      venueAddress: invite.venueAddress || template.sample.venueAddress,
      heading: heading || fallback.heading,
      hostLine: hostLine || fallback.hostLine,
      wording: wording || fallback.wording,
      familyA,
      familyB,
      language,
    };
  }, [invite, template.sample, partnerA, partnerB, heading, hostLine, wording, familyA, familyB, language]);

  async function compose(nextTemplate?: string) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invite),
      });
      const result = await response.json();
      setHeading(result.heading || "");
      setHostLine(result.hostLine || "");
      setWording(result.wording || "");
      setSource(result.source === "ai" ? "ai" : "fallback");
      if (nextTemplate) setTemplateId(nextTemplate);
      else if (suggestions[0]) setTemplateId(suggestions[0].id);
    } catch {
      const local = generateFallbackWording(invite);
      setHeading(local.heading);
      setHostLine(local.hostLine);
      setWording(local.wording);
      setSource("fallback");
      setError("Could not reach the writer. Studio wording is shown instead.");
    } finally {
      setBusy(false);
    }
  }

  async function goPreview() {
    const pick = suggestions[0]?.id || templateId;
    setTemplateId(pick);
    setStep("preview");
    await compose(pick);
  }

  function openEditor() {
    router.push(`/editor?${inviteSearchParam({ ...invite, template: template.id, heading: previewFields.heading, wording: previewFields.wording, hostLine: previewFields.hostLine })}`);
  }

  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">Invitation designer</p>
      <h1 className="font-serif mt-2 text-4xl">Compose your invitation</h1>
      <p className="mt-3 max-w-xl text-[#6b5a4c]">
        Tell us about the wedding, pick the functions, and we will write the wording and lay it onto a
        finished still or video template.
      </p>
      <ol className="mt-8 flex flex-wrap gap-2">
        {STEPS.map((item, index) => (
          <li key={item}>
            <button
              type="button"
              onClick={() => setStep(item)}
              className={`rounded-full border px-3 py-1 text-xs ${
                item === step
                  ? "border-[#6b1d2a] bg-[#6b1d2a] text-[#f7f1e8]"
                  : index < stepIndex
                    ? "border-[#b8952a] text-[#6b1d2a]"
                    : "border-[#e0d4c6] text-[#8a7a6a]"
              }`}
            >
              {index + 1}. {STEP_LABEL[item]}
            </button>
          </li>
        ))}
      </ol>

      {step === "details" ? (
        <section className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="field">
            <label htmlFor="partnerA">Name 1</label>
            <input id="partnerA" value={partnerA} onChange={(e) => setPartnerA(e.target.value)} placeholder="Ananya" />
          </div>
          <div className="field">
            <label htmlFor="partnerB">Name 2</label>
            <input id="partnerB" value={partnerB} onChange={(e) => setPartnerB(e.target.value)} placeholder="Arjun" />
          </div>
          <div className="field">
            <label htmlFor="familyA">Family 1</label>
            <input id="familyA" value={familyA} onChange={(e) => setFamilyA(e.target.value)} placeholder="Sharma Parivar" />
          </div>
          <div className="field">
            <label htmlFor="familyB">Family 2</label>
            <input id="familyB" value={familyB} onChange={(e) => setFamilyB(e.target.value)} placeholder="Mehta Parivar" />
          </div>
          <div className="field sm:col-span-2">
            <label htmlFor="language">Language</label>
            <select id="language" value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="gu">Gujarati</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <button type="button" className="btn-gold" onClick={() => setStep("events")}>
              Next: events
            </button>
          </div>
        </section>
      ) : null}

      {step === "events" ? (
        <section className="mt-10 max-w-3xl space-y-4">
          <p className="text-sm text-[#6b5a4c]">
            Tick the functions you are hosting. Dates and venues can be refined later on the wedding website.
          </p>
          {events.map((event) => (
            <div key={event.key} className="rounded-2xl border border-[#e8dccb] bg-white p-4">
              <label className="flex items-center gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={event.enabled}
                  onChange={(e) => setEvents((current) => patchEvent(current, event.key, { enabled: e.target.checked }))}
                />
                {event.title}
              </label>
              {event.enabled ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <input
                    type="date"
                    value={event.date || ""}
                    onChange={(e) => setEvents((current) => patchEvent(current, event.key, { date: e.target.value }))}
                  />
                  <input
                    type="time"
                    value={event.time || ""}
                    onChange={(e) => setEvents((current) => patchEvent(current, event.key, { time: e.target.value }))}
                  />
                  <input
                    className="sm:col-span-2"
                    placeholder="Venue"
                    value={event.venue || ""}
                    onChange={(e) => setEvents((current) => patchEvent(current, event.key, { venue: e.target.value }))}
                  />
                  <input
                    className="sm:col-span-2"
                    placeholder="Address"
                    value={event.venueAddress || ""}
                    onChange={(e) => setEvents((current) => patchEvent(current, event.key, { venueAddress: e.target.value }))}
                  />
                </div>
              ) : null}
            </div>
          ))}
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-outline" onClick={() => setStep("details")}>
              Back
            </button>
            <button type="button" className="btn-gold" onClick={() => setStep("style")}>
              Next: look and vibe
            </button>
          </div>
        </section>
      ) : null}

      {step === "style" ? (
        <section className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="field">
            <label htmlFor="style">Ceremony style</label>
            <select id="style" value={style} onChange={(e) => setStyle(e.target.value as CeremonyStyle)}>
              {styles.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="tone">Vibe</label>
            <select id="tone" value={tone} onChange={(e) => setTone(e.target.value as Tone)}>
              {tones.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field sm:col-span-2">
            <label htmlFor="kind">Invitation type</label>
            <select id="kind" value={kind} onChange={(e) => setKind(e.target.value as "image" | "video" | "all")}>
              <option value="all">Still cards and video</option>
              <option value="image">Still cards only</option>
              <option value="video">Video invites only</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <button type="button" className="btn-outline" onClick={() => setStep("events")}>
              Back
            </button>
            <button type="button" className="btn-gold" onClick={() => void goPreview()} disabled={busy}>
              {busy ? "Composing…" : "Generate invitation"}
            </button>
          </div>
        </section>
      ) : null}

      {step === "preview" ? (
        <section className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div>
            <div className="field">
              <label htmlFor="heading">Heading</label>
              <input id="heading" value={heading} onChange={(e) => setHeading(e.target.value)} />
            </div>
            <div className="mt-4 field">
              <label htmlFor="hostLine">Host line</label>
              <input id="hostLine" value={hostLine} onChange={(e) => setHostLine(e.target.value)} />
            </div>
            <div className="mt-4 field">
              <label htmlFor="wording">Invitation wording</label>
              <textarea id="wording" rows={6} value={wording} onChange={(e) => setWording(e.target.value)} />
            </div>
            <div className="mt-6">
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#8a7a6a]">Suggested templates</p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTemplateId(item.id)}
                    className={`rounded-md border px-2 py-2 text-left text-[11px] leading-tight ${
                      template.id === item.id
                        ? "border-[#6b1d2a] bg-[#6b1d2a] text-[#f7f1e8]"
                        : "border-[#e0d4c6] bg-white hover:border-[#b8952a]"
                    }`}
                  >
                    {item.name}
                    <span className="mt-0.5 block opacity-80">{item.kind === "video" ? "Video" : "Still"} · {item.category}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="btn-gold" onClick={openEditor}>
                Open in editor
              </button>
              <button type="button" className="btn-outline" onClick={() => void compose()} disabled={busy}>
                {busy ? "Rewriting…" : "Rewrite wording"}
              </button>
              <Link href="/dashboard/wedding" className="btn-outline">
                Also start a wedding page
              </Link>
              <button type="button" className="btn-outline" onClick={() => setStep("style")}>
                Back
              </button>
            </div>
            {source ? (
              <p className="mt-4 text-sm text-[#6b5a4c]">
                {source === "ai"
                  ? "Wording composed by AI via Vercel AI Gateway."
                  : "Studio wording is being used. A model-backed writer turns on when an AI Gateway key is added."}
              </p>
            ) : null}
            {error ? <p className="mt-2 text-sm text-[#6b1d2a]">{error}</p> : null}
          </div>
          <aside className="lg:sticky lg:top-24">
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#8a7a6a]">Live preview</p>
            <div className={`mx-auto mt-3 w-full ${template.kind === "video" ? "max-w-[320px]" : "max-w-[420px]"}`}>
              <InvitationView template={template} fields={previewFields} playing />
            </div>
            <p className="mt-3 text-center text-xs text-[#8a7a6a]">
              {template.name} · watermarked until you unlock a download
            </p>
          </aside>
        </section>
      ) : null}
    </div>
  );
}
