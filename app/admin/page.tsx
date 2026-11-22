export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminStudio } from "@/components/admin/AdminStudio";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?next=/admin");
  const { data: admin } = await supabase.rpc("is_admin");
  if (!admin) redirect("/designs");

  const [{ data: profiles }, { data: roles }, { data: designs }, { data: prices }, { data: settings }] =
    await Promise.all([
      supabase.from("profiles").select("id,display_name,created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id,role"),
      supabase.from("designs").select("id,user_id,title,template_id,kind,is_unlocked,unlock_requested,status,share_slug,updated_at").order("updated_at", { ascending: false }).limit(200),
      supabase.from("template_prices").select("template_id,price_paise,currency"),
      supabase.from("site_settings").select("value").eq("key", "pricing").maybeSingle(),
    ]);

  return (
    <AdminStudio
      profiles={profiles || []}
      roles={roles || []}
      designs={designs || []}
      prices={prices || []}
      settings={(settings?.value as { default_price_paise?: number }) || { default_price_paise: 49900 }}
    />
  );
}
