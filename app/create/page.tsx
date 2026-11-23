import type { Metadata } from "next";
import { DesignerWizard } from "@/components/create/DesignerWizard";

export const metadata: Metadata = {
  title: "Invitation designer",
  description:
    "Design a wedding invitation from names, events, venue and vibe. Edit the wording and preview a still card or video invite in English, Hindi or Gujarati.",
};

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template } = await searchParams;
  return <DesignerWizard initialTemplate={template} />;
}
