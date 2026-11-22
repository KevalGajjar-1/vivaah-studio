import type { Metadata } from "next";
import { EditorStudio } from "@/components/editor/EditorStudio";
import { decodeInvite } from "@/lib/codec";
import { sampleInvite } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Invitation editor",
  description: "Edit your wedding invitation live, download a PNG or PDF, and copy a guest share link.",
};

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string; template?: string }>;
}) {
  const { d, template } = await searchParams;
  const initial = decodeInvite(d) || sampleInvite(template);
  return <EditorStudio initial={initial} />;
}
