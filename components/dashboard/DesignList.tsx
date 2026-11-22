"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getFileTemplate } from "@/lib/catalog";
import { designTitle } from "@/lib/fields";

export type DesignRow = {
  id: string;
  title: string;
  template_id: string;
  kind: "image" | "video";
  fields: Record<string, string>;
  status: string;
  is_unlocked: boolean;
  unlock_requested: boolean;
  updated_at: string;
};

export function DesignList({ initial }: { initial: DesignRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function remove(id: string) {
    if (!confirm("Delete this invitation? This cannot be undone.")) return;
    setBusy(id);
    const { error } = await createClient().from("designs").delete().eq("id", id);
    setBusy(null);
    if (!error) setRows((current) => current.filter((row) => row.id !== id));
  }

  async function duplicate(row: DesignRow) {
    setBusy(row.id);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("designs")
      .insert({
        title: `${row.title} copy`,
        template_id: row.template_id,
        kind: row.kind,
        fields: row.fields,
        status: "draft",
      })
      .select("id")
      .single();
    setBusy(null);
    if (!error && data) router.push(`/designs/${data.id}`);
  }

  async function rename(row: DesignRow) {
    const title = window.prompt("Rename this design", row.title);
    if (!title) return;
    const { error } = await createClient().from("designs").update({ title }).eq("id", row.id);
    if (!error) setRows((current) => current.map((item) => (item.id === row.id ? { ...item, title } : item)));
  }

  if (!rows.length) {
    return (
      <div className="mt-12 rounded-2xl border border-dashed border-[#e0d4c6] px-8 py-16 text-center">
        <p className="font-serif text-2xl">No invitations yet</p>
        <p className="mt-2 text-sm text-[#6b5a4c]">Open the library, pick a ready-made template, and change the wording.</p>
        <Link href="/templates" className="btn-gold mt-6 inline-flex">
          Browse templates
        </Link>
      </div>
    );
  }

  return (
    <ul className="mt-10 divide-y divide-[#e8dccb] rounded-2xl border border-[#e8dccb] bg-white">
      {rows.map((row) => {
        const template = getFileTemplate(row.template_id);
        const names = designTitle(row.fields || {}, row.title);
        return (
          <li key={row.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
            <div>
              <Link href={`/designs/${row.id}`} className="font-serif text-xl hover:text-[#6b1d2a]">
                {names}
              </Link>
              <p className="text-xs text-[#8a7a6a]">
                {template?.name || row.template_id} · {row.kind} ·{" "}
                {row.is_unlocked ? "unlocked" : row.unlock_requested ? "unlock requested" : "preview"} · updated{" "}
                {new Date(row.updated_at).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <Link href={`/designs/${row.id}`} className="btn-outline !px-3 !py-1.5">
                Edit
              </Link>
              <button type="button" className="btn-outline !px-3 !py-1.5" onClick={() => rename(row)} disabled={busy === row.id}>
                Rename
              </button>
              <button type="button" className="btn-outline !px-3 !py-1.5" onClick={() => duplicate(row)} disabled={busy === row.id}>
                Duplicate
              </button>
              <button type="button" className="btn-outline !px-3 !py-1.5" onClick={() => remove(row.id)} disabled={busy === row.id}>
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
