export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WeddingSite } from "@/components/planning/WeddingSite";
import { joinNames } from "@/lib/format";
import type { WeddingEventRow, WeddingRow } from "@/lib/planning/types";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("weddings")
      .select("partner_a,partner_b,is_published,language")
      .eq("slug", slug)
      .maybeSingle();
    if (!data || !data.is_published) return { title: "Wedding invitation", robots: { index: false, follow: false } };
    const title = joinNames(data.partner_a, data.partner_b, data.language || "en");
    return {
      title: `${title} — Wedding`,
      description: `You are invited to the wedding of ${title}. View the schedule, venue and RSVP.`,
    };
  } catch {
    return { title: "Wedding invitation" };
  }
}

export default async function PublicWeddingPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("weddings").select("*").eq("slug", slug).maybeSingle();
  if (!data || !data.is_published) notFound();
  const wedding = data as WeddingRow;
  const { data: events } = await supabase
    .from("wedding_events")
    .select("*")
    .eq("wedding_id", wedding.id)
    .order("sort_order", { ascending: true });

  return <WeddingSite wedding={wedding} events={(events || []) as WeddingEventRow[]} />;
}
