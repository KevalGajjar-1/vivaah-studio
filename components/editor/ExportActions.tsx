"use client";

import { useState } from "react";
import type { CatalogTemplate } from "@/lib/catalog/types";
import { downloadPdf, downloadPng } from "@/lib/export/still";
import { downloadBlob, exportVideoInvitation } from "@/lib/export/video";
import { rupees } from "@/lib/slug";

export function ExportActions({
  template,
  fields,
  unlocked,
  designId,
  shareUrl,
  onRequestUnlock,
  unlockPending,
}: {
  template: CatalogTemplate;
  fields: Record<string, string>;
  unlocked: boolean;
  designId?: string;
  shareUrl?: string;
  onRequestUnlock?: () => void;
  unlockPending?: boolean;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState("");
  const names = [fields.partnerA, fields.partnerB].filter(Boolean).join("-") || "invitation";

  async function run(kind: string, fn: () => Promise<void>) {
    setBusy(kind);
    setNote("");
    try {
      await fn();
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="no-print space-y-3">
      <div className="flex flex-wrap gap-2">
        {template.kind === "video" ? (
          <button
            type="button"
            className="btn-outline !px-3 !py-2 text-xs"
            disabled={!!busy}
            onClick={() =>
              run("video", async () => {
                if (!template.video) throw new Error("This template has no background clip.");
                const result = await exportVideoInvitation({
                  videoUrl: template.video.file,
                  fields,
                  overlay: template.video.overlay,
                  watermark: !unlocked,
                  duration: 8,
                });
                downloadBlob(result.blob, `${names}.${result.ext}`);
                if (result.ext === "webm") {
                  setNote("This browser exported WebM. Chrome and Edge can also try MP4; Safari often records MP4.");
                }
              })
            }
          >
            {busy === "video" ? "Rendering…" : unlocked ? "Download video" : "Download preview video"}
          </button>
        ) : (
          <>
            <button
              type="button"
              className="btn-outline !px-3 !py-2 text-xs"
              disabled={!!busy}
              onClick={() =>
                run("png", async () => {
                  const card = document.querySelector("[data-invite-card]") as HTMLElement | null;
                  if (!card) throw new Error("Preview is not ready.");
                  await downloadPng(card, names);
                })
              }
            >
              {busy === "png" ? "Preparing…" : unlocked ? "Download PNG" : "Download preview PNG"}
            </button>
            <button
              type="button"
              className="btn-outline !px-3 !py-2 text-xs"
              disabled={!!busy}
              onClick={() =>
                run("pdf", async () => {
                  const card = document.querySelector("[data-invite-card]") as HTMLElement | null;
                  if (!card) throw new Error("Preview is not ready.");
                  await downloadPdf(card, names, [5, 7]);
                })
              }
            >
              {busy === "pdf" ? "Preparing…" : unlocked ? "Download PDF" : "Download preview PDF"}
            </button>
          </>
        )}
        {shareUrl ? (
          <button
            type="button"
            className="btn-outline !px-3 !py-2 text-xs"
            onClick={async () => {
              await navigator.clipboard.writeText(shareUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            }}
          >
            {copied ? "Link copied" : "Copy guest link"}
          </button>
        ) : null}
      </div>
      {!unlocked ? (
        <div className="rounded-xl border border-[#e0d4c6] bg-white px-4 py-3 text-sm text-[#6b5a4c]">
          <p>
            Exports include a Vivaah preview watermark. A clean file is {rupees(template.pricePaise)}. Payments
            will be added later — request an unlock and the studio can grant it by hand.
          </p>
          {designId && onRequestUnlock ? (
            <button type="button" className="btn-gold mt-3 !px-3 !py-1.5 text-xs" onClick={onRequestUnlock} disabled={unlockPending}>
              {unlockPending ? "Unlock requested" : "Request unlock"}
            </button>
          ) : (
            <p className="mt-2 text-xs">Sign in and save this design to request a clean download.</p>
          )}
        </div>
      ) : (
        <p className="text-xs text-[#3d6b3a]">This design is unlocked. Downloads are clean and unwatermarked.</p>
      )}
      {note ? <p className="text-xs text-[#6b5a4c]">{note}</p> : null}
    </div>
  );
}
