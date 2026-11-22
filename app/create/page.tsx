import type { Metadata } from "next";
import { CreateStudio } from "@/components/create/CreateStudio";
import { emptyInvite, getTemplate } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Create an invitation",
  description:
    "Write wedding invitation wording with AI in English, Hindi, or Gujarati, choose a template, and open the live editor.",
};

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template } = await searchParams;
  const initial = emptyInvite(template);
  initial.template = getTemplate(template).slug;
  initial.style = getTemplate(template).style;
  return <CreateStudio initial={initial} />;
}
