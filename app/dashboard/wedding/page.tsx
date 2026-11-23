export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { WeddingEditor } from "@/components/planning/WeddingEditor";
import type { WeddingEventRow, WeddingRow } from "@/lib/planning/types";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Wedding website" };

export default async function WeddingDashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-16">
        <h1 className="font-serif text-4xl">Wedding website</h1>
        <p className="mt-4 text-[#6b5a4c]">Accounts are being connected, so wedding pages cannot be saved just yet.</p>
      </div>
    );
  }
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?next=/dashboard/wedding");
  const { data: rows } = await supabase.from("weddings").select("*").order("updated_at", { ascending: false }).limit(1);
  const wedding = (rows?.[0] || null) as WeddingRow | null;
  let events: WeddingEventRow[] = [];
  if (wedding) {
    const { data } = await supabase
      .from("wedding_events")
      .select("*")
      .eq("wedding_id", wedding.id)
      .order("sort_order", { ascending: true });
    events = (data || []) as WeddingEventRow[];
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">For your guests</p>
      <h1 className="font-serif mt-2 text-4xl">Wedding website</h1>
      <p className="mt-3 max-w-2xl text-[#6b5a4c]">
        A mobile-first page with your story, the function schedule, maps and an RSVP form. WhatsApp sending comes in phase 2.
      </p>
      <DashboardNav />
      {wedding?.is_published ? (
        <p className="mt-6 text-sm">
          Live at{" "}
          <Link href={`/w/${wedding.slug}`} className="text-[#6b1d2a] hover:underline">
            /w/{wedding.slug}
          </Link>
        </p>
      ) : null}
      <WeddingEditor initial={wedding} initialEvents={events} />
    </div>
  );
}
