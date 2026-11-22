export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getFileTemplate } from "@/lib/catalog";
import { rupees } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";

export default async function UnlockPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect(`/login?next=/unlock/${id}`);
  const { data } = await supabase.from("designs").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const template = getFileTemplate(data.template_id);
  const price = rupees(template?.pricePaise);

  async function request() {
    "use server";
    const client = await createClient();
    await client.rpc("request_unlock", { p_design_id: id });
    redirect(`/designs/${id}`);
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-16">
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">Unlock</p>
      <h1 className="font-serif mt-2 text-4xl">Clean download</h1>
      <p className="mt-4 text-[#6b5a4c]">
        A payment gateway will be added later. For now, request an unlock for {data.title} ({price}). The
        studio can grant it from the admin panel, after which the watermark is removed and a guest link can
        be shared.
      </p>
      {data.is_unlocked ? (
        <p className="mt-6 text-sm text-[#3d6b3a]">This design is already unlocked.</p>
      ) : (
        <form action={request} className="mt-8">
          <button type="submit" className="btn-gold">
            {data.unlock_requested ? "Unlock already requested — return to design" : "Request unlock"}
          </button>
        </form>
      )}
      <Link href={`/designs/${id}`} className="mt-6 inline-block text-sm text-[#6b1d2a] underline">
        Back to the design
      </Link>
    </div>
  );
}
