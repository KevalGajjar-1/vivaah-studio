export const dynamic = "force-dynamic";
import { notFound, redirect } from "next/navigation";
import { FieldEditor } from "@/components/editor/FieldEditor";
import { getFileTemplate } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";

export default async function DesignEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect(`/login?next=/designs/${id}`);
  const { data } = await supabase.from("designs").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const template = getFileTemplate(data.template_id) || getFileTemplate("classic-floral")!;
  const fields = { ...(template.sample || {}), ...(data.fields || {}) };
  let photoUrl: string | null = fields.photo || null;
  if (data.photo_path) {
    photoUrl = supabase.storage.from("invitation-photos").getPublicUrl(data.photo_path).data.publicUrl;
  }
  return (
    <FieldEditor
      initialTemplateId={data.template_id}
      initialFields={fields}
      photoUrl={photoUrl}
      design={{
        id: data.id,
        title: data.title,
        template_id: data.template_id,
        kind: data.kind,
        fields,
        is_unlocked: data.is_unlocked,
        unlock_requested: data.unlock_requested,
        share_slug: data.share_slug,
        photo_path: data.photo_path,
      }}
    />
  );
}
