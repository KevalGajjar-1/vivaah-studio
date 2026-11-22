"use client";

import { useState } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import type { InviteData } from "@/lib/types";
import { inviteSearchParam } from "@/lib/codec";
import { defaultRsvpMessage, whatsappRsvpUrl } from "@/lib/whatsapp";

async function capture(card: HTMLElement) {
  await document.fonts.ready;
  return toPng(card, {
    pixelRatio: 3,
    cacheBust: true,
    backgroundColor: "#ffffff",
  });
}

export function DownloadActions({
  data,
  cardSelector = "[data-invite-card]",
}: {
  data: InviteData;
  cardSelector?: string;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/invite?${inviteSearchParam(data)}`;

  const rsvp = whatsappRsvpUrl(
    data.rsvpPhone,
    defaultRsvpMessage(data.partnerA || "the couple", data.partnerB || "", data.rsvpName),
  );

  async function withCard(kind: string, fn: (card: HTMLElement) => Promise<void>) {
    const card = document.querySelector(cardSelector) as HTMLElement | null;
    if (!card) return;
    setBusy(kind);
    try {
      await fn(card);
    } finally {
      setBusy(null);
    }
  }

  const names = [data.partnerA, data.partnerB].filter(Boolean).join("-") || "invitation";

  return (
    <div className="no-print flex flex-wrap gap-2">
      <button
        type="button"
        className="btn-outline !px-3 !py-2 text-xs"
        disabled={!!busy}
        onClick={() =>
          withCard("png", async (card) => {
            const href = await capture(card);
            const a = document.createElement("a");
            a.href = href;
            a.download = `${names}.png`;
            a.click();
          })
        }
      >
        {busy === "png" ? "Preparing…" : "Download PNG"}
      </button>
      <button
        type="button"
        className="btn-outline !px-3 !py-2 text-xs"
        disabled={!!busy}
        onClick={() =>
          withCard("pdf", async (card) => {
            const href = await capture(card);
            const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: [5, 7] });
            pdf.addImage(href, "PNG", 0, 0, 5, 7);
            pdf.save(`${names}.pdf`);
          })
        }
      >
        {busy === "pdf" ? "Preparing…" : "Download PDF"}
      </button>
      <button
        type="button"
        className="btn-outline !px-3 !py-2 text-xs"
        onClick={async () => {
          if (!shareUrl) return;
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        }}
      >
        {copied ? "Link copied" : "Copy share link"}
      </button>
      {rsvp ? (
        <a href={rsvp} target="_blank" rel="noreferrer" className="btn-gold !px-3 !py-2 text-xs">
          RSVP on WhatsApp
        </a>
      ) : null}
    </div>
  );
}
