"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { randomSlug, rupees } from "@/lib/slug";

type Profile = { id: string; display_name: string | null; created_at: string; email?: string };
type Role = { user_id: string; role: string };
type Design = {
  id: string;
  user_id: string;
  title: string;
  template_id: string;
  kind: string;
  is_unlocked: boolean;
  unlock_requested: boolean;
  status: string;
  share_slug: string | null;
  updated_at: string;
};
type Price = { template_id: string; price_paise: number; currency: string };

export function AdminStudio({
  profiles,
  roles,
  designs,
  prices,
  settings,
}: {
  profiles: Profile[];
  roles: Role[];
  designs: Design[];
  prices: Price[];
  settings: { default_price_paise?: number } | null;
}) {
  const [tab, setTab] = useState<"users" | "designs" | "pricing">("users");
  const [note, setNote] = useState("");
  const roleMap = new Map(roles.map((r) => [r.user_id, r.role]));

  async function setRole(userId: string, role: string) {
    const { error } = await createClient().rpc("admin_set_role", { p_user_id: userId, p_role: role });
    setNote(error ? error.message : `Role updated to ${role}. Refresh to confirm.`);
  }

  async function grant(id: string) {
    const supabase = createClient();
    const { error } = await supabase.rpc("admin_grant_unlock", { p_design_id: id });
    if (error) {
      setNote(error.message);
      return;
    }
    const slug = randomSlug();
    await supabase.from("designs").update({ status: "published", share_slug: slug }).eq("id", id);
    setNote("Unlock granted and guest link published. Refresh to see the change.");
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">Studio admin</p>
      <h1 className="font-serif mt-2 text-4xl">Users, unlocks and pricing</h1>
      <p className="mt-3 max-w-2xl text-sm text-[#6b5a4c]">
        Payments are not connected yet. Grant a clean download by hand when a guest is ready. Default
        still-card price is {rupees(settings?.default_price_paise || 49900)}.
      </p>
      <div className="mt-8 flex gap-2">
        {(["users", "designs", "pricing"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`rounded-full border px-4 py-1.5 text-sm capitalize ${
              tab === item ? "border-[#6b1d2a] bg-[#6b1d2a] text-[#f7f1e8]" : "border-[#e0d4c6] bg-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      {note ? <p className="mt-4 text-sm text-[#6b1d2a]">{note}</p> : null}

      {tab === "users" ? (
        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#e8dccb] text-[11px] tracking-wide uppercase text-[#8a7a6a]">
              <th className="py-2">User</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-b border-[#f0e6d6]">
                <td className="py-3">
                  <div>{p.display_name || p.email || p.id.slice(0, 8)}</div>
                  <div className="text-xs text-[#8a7a6a]">{p.id}</div>
                </td>
                <td>{roleMap.get(p.id) || "user"}</td>
                <td className="text-right">
                  <button type="button" className="text-xs underline" onClick={() => setRole(p.id, roleMap.get(p.id) === "admin" ? "user" : "admin")}>
                    {roleMap.get(p.id) === "admin" ? "Make user" : "Make admin"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {tab === "designs" ? (
        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#e8dccb] text-[11px] tracking-wide uppercase text-[#8a7a6a]">
              <th className="py-2">Design</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {designs.map((d) => (
              <tr key={d.id} className="border-b border-[#f0e6d6]">
                <td className="py-3">
                  <div>{d.title}</div>
                  <div className="text-xs text-[#8a7a6a]">
                    {d.template_id} · {d.kind} · {d.user_id.slice(0, 8)}
                  </div>
                </td>
                <td>
                  {d.is_unlocked ? "unlocked" : d.unlock_requested ? "requested" : "preview"} · {d.status}
                </td>
                <td className="text-right">
                  {!d.is_unlocked ? (
                    <button type="button" className="btn-gold !px-3 !py-1 text-xs" onClick={() => grant(d.id)}>
                      Grant unlock
                    </button>
                  ) : d.share_slug ? (
                    <Link href={`/i/${d.share_slug}`} className="text-xs underline">
                      Guest link
                    </Link>
                  ) : (
                    "unlocked"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {tab === "pricing" ? (
        <div className="mt-8 text-sm text-[#4a3d34]">
          <p className="mb-4">
            Prices are stored for later checkout. They are not charged automatically yet. Default {rupees(settings?.default_price_paise || 49900)}.
          </p>
          <ul className="space-y-2">
            {prices.length ? (
              prices.map((p) => (
                <li key={p.template_id} className="flex justify-between border-b border-[#f0e6d6] py-2">
                  <span>{p.template_id}</span>
                  <span>{rupees(p.price_paise)}</span>
                </li>
              ))
            ) : (
              <li>No per-template overrides yet. File catalog prices are used in the app.</li>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
