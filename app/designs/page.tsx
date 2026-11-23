export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DesignList, type DesignRow } from "@/components/dashboard/DesignList";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My designs" };

export default async function DesignsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-16">
        <h1 className="font-serif text-4xl">My designs</h1>
        <p className="mt-4 text-[#6b5a4c]">Accounts are being connected. You can still preview templates in the library.</p>
        <Link href="/templates" className="btn-gold mt-6 inline-flex">Browse templates</Link>
      </div>
    );
  }
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?next=/designs");
  const { data } = await supabase
    .from("designs")
    .select("id,title,template_id,kind,fields,status,is_unlocked,unlock_requested,updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">Your studio</p>
          <h1 className="font-serif mt-2 text-4xl">My designs</h1>
        </div>
        <Link href="/templates" className="btn-gold">New invitation</Link>
      </div>
      <DashboardNav />
      <DesignList initial={(data || []) as DesignRow[]} />
    </div>
  );
}
