import type { Metadata } from "next";
import { TemplateGallery } from "@/components/gallery/TemplateGallery";
import { fileTemplates } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Invitation templates",
  description:
    "Browse a library of ready-made wedding invitation templates — still cards and video invites for wedding, engagement, haldi, mehendi, sangeet, reception, and save-the-date. Change the wording, then download or share.",
};

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">The collection</p>
      <h1 className="font-serif mt-2 text-4xl sm:text-5xl">Ready-made invitations</h1>
      <p className="mt-4 max-w-2xl text-[#6b5a4c]">
        Every design is a finished layout. Pick a card or a video, change the names, date, venue and
        wording, and leave the typography and ornaments as they are. Video invites play a licensed
        stock background with your text over the top.
      </p>
      <TemplateGallery templates={fileTemplates} />
    </div>
  );
}
