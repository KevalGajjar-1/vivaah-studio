export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { GuestManager } from "@/components/planning/GuestManager";
import type { GuestEventRsvpRow, GuestRow, WeddingEventRow } from "@/lib/planning/types";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Guest list" };

export default async function GuestsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h1 className="font-serif text-4xl">Guest list</h1>
        <p className="mt-4 text-[#6b5a4c]">Accounts are being connected, so the guest list cannot be saved just yet.</p>
      </div>
    );
  }
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?next=/dashboard/guests");
  const { data: weddings } = await supabase.from("weddings").select("id,title,slug").order("updated_at", { ascending: false }).limit(1);
  const wedding = weddings?.[0];
  if (!wedding) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-16">
        <h1 className="font-serif text-4xl">Guest list</h1>
        <DashboardNav />
        <p className="mt-8 text-[#6b5a4c]">Create a wedding page first, then add both families to one list.</p>
        <Link href="/dashboard/wedding" className="btn-gold mt-6 inline-flex">
          Create wedding page
        </Link>
      </div>
    );
  }

  const [{ data: guests }, { data: events }] = await Promise.all([
    supabase.from("guests").select("*").eq("wedding_id", wedding.id).order("created_at", { ascending: true }),
    supabase.from("wedding_events").select("*").eq("wedding_id", wedding.id).order("sort_order", { ascending: true }),
  ]);
  const eventIds = (events || []).map((event) => event.id);
  let rsvps: GuestEventRsvpRow[] = [];
  if (eventIds.length) {
    const { data } = await supabase.from("guest_event_rsvps").select("*").in("event_id", eventIds);
    rsvps = (data || []) as GuestEventRsvpRow[];
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">{wedding.title}</p>
      <h1 className="font-serif mt-2 text-4xl">Guest list</h1>
      <p className="mt-3 max-w-2xl text-[#6b5a4c]">
        Add or import guests, group them by side and family, and track RSVPs for every function. WhatsApp sending is reserved for phase 2.
      </p>
      <DashboardNav />
      <GuestManager
        weddingId={wedding.id}
        initialGuests={(guests || []) as GuestRow[]}
        initialEvents={(events || []) as WeddingEventRow[]}
        initialRsvps={rsvps}
      />
    </div>
  );
}
