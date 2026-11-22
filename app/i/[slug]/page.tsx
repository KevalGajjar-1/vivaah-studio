export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { InvitationView } from "@/components/render/InvitationView";
import { getFileTemplate } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";
import { defaultRsvpMessage, whatsappRsvpUrl } from "@/lib/whatsapp";

export default async function GuestInvitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("designs")
    .select("title,template_id,fields,is_unlocked,status,photo_path")
    .eq("share_slug", slug)
    .maybeSingle();
  if (!data || !data.is_unlocked || data.status === "archived") notFound();
  const template = getFileTemplate(data.template_id);
  if (!template) notFound();
  const fields = { ...template.sample, ...(data.fields || {}) };
  let photoUrl = fields.photo || null;
  if (data.photo_path) {
    photoUrl = supabase.storage.from("invitation-photos").getPublicUrl(data.photo_path).data.publicUrl;
  }
  const rsvp = whatsappRsvpUrl(
    fields.rsvpPhone,
    defaultRsvpMessage(fields.partnerA || "the couple", fields.partnerB || "", fields.rsvpName),
  );

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-center text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">You are invited</p>
      <div className={`mx-auto mt-8 w-full ${template.kind === "video" ? "max-w-[360px]" : "max-w-[520px]"}`}>
        <InvitationView template={template} fields={fields} photoUrl={photoUrl} playing />
      </div>
      {rsvp ? (
        <div className="mt-8 text-center">
          <a href={rsvp} className="btn-gold" target="_blank" rel="noreferrer">
            RSVP on WhatsApp
          </a>
        </div>
      ) : null}
    </div>
  );
}
