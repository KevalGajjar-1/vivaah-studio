export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-16">
        <h1 className="font-serif text-4xl">Dashboard</h1>
        <p className="mt-4 text-[#6b5a4c]">Accounts are being connected. You can still design an invitation or try the free message writer.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/create" className="btn-gold">Design an invitation</Link>
          <Link href="/tools/messages" className="btn-outline">Free message writer</Link>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?next=/dashboard");

  const [{ data: designs }, { data: weddings }] = await Promise.all([
    supabase.from("designs").select("id,title,template_id,kind,is_unlocked,updated_at,fields").order("updated_at", { ascending: false }).limit(6),
    supabase.from("weddings").select("id,title,slug,partner_a,partner_b,wedding_date,is_published").order("updated_at", { ascending: false }).limit(1),
  ]);

  const wedding = weddings?.[0] || null;
  let guestCount = 0;
  let yesCount = 0;
  let pendingCount = 0;
  if (wedding) {
    const { count } = await supabase.from("guests").select("id", { count: "exact", head: true }).eq("wedding_id", wedding.id);
    guestCount = count || 0;
    const { data: eventRows } = await supabase.from("wedding_events").select("id").eq("wedding_id", wedding.id);
    const eventIds = (eventRows || []).map((row) => row.id);
    if (eventIds.length) {
      const { data: rsvps } = await supabase.from("guest_event_rsvps").select("status").in("event_id", eventIds);
      for (const row of rsvps || []) {
        if (row.status === "yes") yesCount += 1;
        if (row.status === "pending" || row.status === "invited") pendingCount += 1;
      }
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">Your wedding</p>
      <h1 className="font-serif mt-2 text-4xl">Dashboard</h1>
      <DashboardNav />
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#e8dccb] bg-white p-5">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#8a7a6a]">Invitations</p>
          <p className="font-serif mt-2 text-4xl">{designs?.length ? designs.length : 0}</p>
          <Link href="/create" className="mt-3 inline-block text-sm text-[#6b1d2a] hover:underline">New design</Link>
        </div>
        <div className="rounded-2xl border border-[#e8dccb] bg-white p-5">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#8a7a6a]">Guests</p>
          <p className="font-serif mt-2 text-4xl">{guestCount}</p>
          <Link href="/dashboard/guests" className="mt-3 inline-block text-sm text-[#6b1d2a] hover:underline">Manage list</Link>
        </div>
        <div className="rounded-2xl border border-[#e8dccb] bg-white p-5">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#8a7a6a]">RSVPs</p>
          <p className="font-serif mt-2 text-4xl">{yesCount}</p>
          <p className="mt-1 text-xs text-[#8a7a6a]">{pendingCount} awaiting a reply</p>
        </div>
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#e8dccb] bg-white p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl">Wedding website</h2>
              <p className="mt-1 text-sm text-[#6b5a4c]">
                {wedding
                  ? wedding.is_published
                    ? "Published and ready to share."
                    : "Saved as a draft. Publish when the details feel right."
                  : "Create a page for your story, schedule, maps and RSVP."}
              </p>
            </div>
            <Link href="/dashboard/wedding" className="btn-gold !px-3 !py-1.5 text-xs">
              {wedding ? "Edit" : "Create"}
            </Link>
          </div>
          {wedding ? (
            <p className="mt-4 text-sm text-[#4a3d34]">
              {wedding.partner_a} & {wedding.partner_b}
              {wedding.wedding_date ? ` · ${wedding.wedding_date}` : ""}
              <br />
              {wedding.is_published ? (
                <Link href={`/w/${wedding.slug}`} className="text-[#6b1d2a] hover:underline">
                  /w/{wedding.slug}
                </Link>
              ) : (
                <span className="text-[#8a7a6a]">/{wedding.slug} (unpublished)</span>
              )}
            </p>
          ) : null}
        </section>
        <section className="rounded-2xl border border-[#e8dccb] bg-white p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-serif text-2xl">Recent invitations</h2>
            <Link href="/designs" className="text-sm text-[#6b1d2a] hover:underline">View all</Link>
          </div>
          {designs?.length ? (
            <ul className="mt-4 divide-y divide-[#f0e6d8]">
              {designs.map((design) => (
                <li key={design.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <Link href={`/designs/${design.id}`} className="hover:text-[#6b1d2a]">
                    {design.title}
                  </Link>
                  <span className="text-xs text-[#8a7a6a]">{design.kind}{design.is_unlocked ? " · unlocked" : ""}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-[#6b5a4c]">
              No designs yet. <Link href="/create" className="text-[#6b1d2a] hover:underline">Start with the designer</Link>.
            </p>
          )}
        </section>
      </div>
      <section className="mt-8 rounded-2xl border border-dashed border-[#e0d4c6] p-6">
        <p className="text-[11px] tracking-[0.18em] uppercase text-[#8a7a6a]">Coming in phase 2</p>
        <h2 className="font-serif mt-2 text-2xl">WhatsApp invites and RSVPs</h2>
        <p className="mt-2 max-w-2xl text-sm text-[#6b5a4c]">
          Sending invitations and collecting replies on WhatsApp is planned next. For now, write messages
          with the free tool and collect RSVPs on the wedding website.
        </p>
        <Link href="/tools/messages" className="btn-outline mt-4 !px-4 !py-2 text-sm">
          Open the message writer
        </Link>
      </section>
    </div>
  );
}
