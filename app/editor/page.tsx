import type { Metadata } from "next";
import { FieldEditor } from "@/components/editor/FieldEditor";
import { getFileTemplate } from "@/lib/catalog";
import { decodeInvite } from "@/lib/codec";
import { fieldsFromInvite } from "@/lib/fields";

export const metadata: Metadata = {
  title: "Invitation editor",
  description: "Change the wording on a ready-made wedding invitation, preview it, and download a watermarked copy.",
};

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string; template?: string }>;
}) {
  const { d, template } = await searchParams;
  const decoded = decodeInvite(d);
  const templateId = template || decoded?.template || "classic-floral";
  const catalog = getFileTemplate(templateId) || getFileTemplate("classic-floral")!;
  const fields = decoded ? fieldsFromInvite(decoded) : { ...catalog.sample };
  return <FieldEditor initialTemplateId={catalog.id} initialFields={fields} />;
}
