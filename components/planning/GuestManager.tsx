"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { guestsToCsv, parseGuestCsv, SAMPLE_GUEST_CSV } from "@/lib/planning/csv";
import type { GuestEventRsvpRow, GuestRow, GuestSide, RsvpStatus, WeddingEventRow } from "@/lib/planning/types";
import { createClient } from "@/lib/supabase/client";

const SIDES: { id: GuestSide | "all"; label: string }[] = [
  { id: "all", label: "All sides" },
  { id: "bride", label: "Bride's side" },
  { id: "groom", label: "Groom's side" },
  { id: "other", label: "Other" },
];

const STATUSES: RsvpStatus[] = ["pending", "invited", "yes", "maybe", "no"];

export function GuestManager({
  weddingId,
  initialGuests,
  initialEvents,
  initialRsvps,
}: {
  weddingId: string;
  initialGuests: GuestRow[];
  initialEvents: WeddingEventRow[];
  initialRsvps: GuestEventRsvpRow[];
}) {
  const [guests, setGuests] = useState(initialGuests);
  const [rsvps, setRsvps] = useState(initialRsvps);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [side, setSide] = useState<GuestSide>("other");
  const [groupName, setGroupName] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [notes, setNotes] = useState("");
  const [filterSide, setFilterSide] = useState<GuestSide | "all">("all");
  const [filterGroup, setFilterGroup] = useState("all");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const groups = useMemo(() => {
    const set = new Set(guests.map((g) => g.group_name).filter(Boolean) as string[]);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [guests]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guests.filter((guest) => {
      if (filterSide !== "all" && guest.side !== filterSide) return false;
      if (filterGroup !== "all" && (guest.group_name || "") !== filterGroup) return false;
      if (q) {
        const hay = `${guest.name} ${guest.phone || ""} ${guest.email || ""} ${guest.group_name || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [guests, filterSide, filterGroup, query]);

  const counts = useMemo(() => {
    return initialEvents.map((event) => {
      const rows = rsvps.filter((r) => r.event_id === event.id);
      const byStatus = (status: RsvpStatus) =>
        rows
          .filter((r) => r.status === status)
          .reduce((sum, r) => {
            const guest = guests.find((g) => g.id === r.guest_id);
            return sum + (r.party_size || guest?.party_size || 1);
          }, 0);
      const invitedPeople = guests.reduce((sum, guest) => {
        const row = rows.find((r) => r.guest_id === guest.id);
        if (row && (row.status === "no" || row.status === "yes" || row.status === "maybe")) {
          return sum;
        }
        return sum + guest.party_size;
      }, 0);
      return {
        event,
        yes: byStatus("yes"),
        no: byStatus("no"),
        maybe: byStatus("maybe"),
        pending: invitedPeople,
        listed: guests.reduce((sum, guest) => sum + guest.party_size, 0),
      };
    });
  }, [initialEvents, rsvps, guests]);

  function statusFor(guestId: string, eventId: string): RsvpStatus {
    return rsvps.find((r) => r.guest_id === guestId && r.event_id === eventId)?.status || "pending";
  }

  async function addGuest(input?: {
    name: string;
    phone?: string;
    email?: string;
    side?: GuestSide;
    group_name?: string;
    party_size?: number;
    notes?: string;
  }) {
    const payload = input || {
      name,
      phone,
      email,
      side,
      group_name: groupName,
      party_size: partySize,
      notes,
    };
    if (!payload.name.trim()) {
      setMessage("Please add a guest name.");
      return null;
    }
    setBusy(true);
    const { data, error } = await createClient()
      .from("guests")
      .insert({
        wedding_id: weddingId,
        name: payload.name.trim(),
        phone: payload.phone?.trim() || null,
        email: payload.email?.trim() || null,
        side: payload.side || "other",
        group_name: payload.group_name?.trim() || null,
        party_size: payload.party_size || 1,
        notes: payload.notes?.trim() || null,
      })
      .select("*")
      .single();
    setBusy(false);
    if (error || !data) {
      setMessage(error?.message || "Could not add the guest.");
      return null;
    }
    setGuests((current) => [...current, data as GuestRow]);
    return data as GuestRow;
  }

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    const row = await addGuest();
    if (row) {
      setName("");
      setPhone("");
      setEmail("");
      setGroupName("");
      setPartySize(1);
      setNotes("");
      setMessage("Guest added.");
    }
  }

  async function removeGuest(id: string) {
    if (!confirm("Remove this guest?")) return;
    const { error } = await createClient().from("guests").delete().eq("id", id);
    if (error) {
      setMessage(error.message);
      return;
    }
    setGuests((current) => current.filter((g) => g.id !== id));
    setRsvps((current) => current.filter((r) => r.guest_id !== id));
  }

  async function setRsvp(guest: GuestRow, eventId: string, status: RsvpStatus) {
    const existing = rsvps.find((r) => r.guest_id === guest.id && r.event_id === eventId);
    const payload = {
      guest_id: guest.id,
      event_id: eventId,
      status,
      party_size: guest.party_size,
      responded_at: status === "pending" || status === "invited" ? null : new Date().toISOString(),
    };
    const supabase = createClient();
    if (existing) {
      const { error } = await supabase.from("guest_event_rsvps").update(payload).eq("id", existing.id);
      if (error) {
        setMessage(error.message);
        return;
      }
      setRsvps((current) => current.map((r) => (r.id === existing.id ? { ...r, ...payload } : r)));
    } else {
      const { data, error } = await supabase.from("guest_event_rsvps").insert(payload).select("*").single();
      if (error || !data) {
        setMessage(error?.message || "Could not update RSVP.");
        return;
      }
      setRsvps((current) => [...current, data as GuestEventRsvpRow]);
    }
  }

  async function onImport(file: File) {
    const text = await file.text();
    const { guests: rows, errors } = parseGuestCsv(text);
    if (!rows.length) {
      setMessage(errors[0] || "No guests found in that file.");
      return;
    }
    setBusy(true);
    let added = 0;
    for (const row of rows) {
      const created = await addGuest(row);
      if (created) added += 1;
    }
    setBusy(false);
    setMessage(`Imported ${added} guest${added === 1 ? "" : "s"}${errors.length ? `. ${errors.length} row(s) skipped.` : "."}`);
  }

  function exportCsv() {
    const csv = guestsToCsv(
      visible,
      initialEvents,
      rsvps,
      visible.map((g) => g.id),
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vivaah-guests.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadTemplate() {
    const blob = new Blob([SAMPLE_GUEST_CSV], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vivaah-guest-list-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-8 space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {counts.length ? (
          counts.map((item) => (
            <div key={item.event.id} className="rounded-2xl border border-[#e8dccb] bg-white p-4">
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#8a7a6a]">{item.event.title}</p>
              <p className="font-serif mt-1 text-3xl">{item.yes} coming</p>
              <p className="mt-1 text-xs text-[#6b5a4c]">
                {item.maybe} maybe · {item.pending} awaiting · {item.no} declined · {item.listed} on the list
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-[#e0d4c6] p-4 text-sm text-[#6b5a4c] sm:col-span-2">
            Add functions on your <Link href="/dashboard/wedding" className="text-[#6b1d2a] hover:underline">wedding page</Link> to track RSVPs per event.
          </div>
        )}
      </div>

      <form onSubmit={(e) => void onAdd(e)} className="rounded-2xl border border-[#e8dccb] bg-white p-5">
        <h2 className="font-serif text-2xl">Add a guest</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="field">
            <label htmlFor="guest-name">Name</label>
            <input id="guest-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="guest-phone">Phone</label>
            <input id="guest-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9198XXXXXXXX" />
          </div>
          <div className="field">
            <label htmlFor="guest-email">Email</label>
            <input id="guest-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="guest-side">Side</label>
            <select id="guest-side" value={side} onChange={(e) => setSide(e.target.value as GuestSide)}>
              <option value="bride">Bride&apos;s side</option>
              <option value="groom">Groom&apos;s side</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="guest-group">Group</label>
            <input id="guest-group" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Mama's family" />
          </div>
          <div className="field">
            <label htmlFor="guest-party">Party size</label>
            <input
              id="guest-party"
              type="number"
              min={1}
              max={30}
              value={partySize}
              onChange={(e) => setPartySize(Math.min(30, Math.max(1, Number(e.target.value) || 1)))}
            />
          </div>
          <div className="field sm:col-span-2 lg:col-span-3">
            <label htmlFor="guest-notes">Notes</label>
            <input id="guest-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Vegetarian, needs a pickup…" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="submit" className="btn-gold" disabled={busy}>
            Add guest
          </button>
          <label className="btn-outline cursor-pointer !px-4 !py-2 text-sm">
            Import CSV
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onImport(file);
                e.target.value = "";
              }}
            />
          </label>
          <button type="button" className="btn-outline" onClick={downloadTemplate}>
            CSV template
          </button>
          <button type="button" className="btn-outline" onClick={exportCsv} disabled={!visible.length}>
            Export CSV
          </button>
          <button type="button" className="btn-outline cursor-not-allowed opacity-60" disabled title="WhatsApp sending is planned for phase 2">
            WhatsApp invites — phase 2
          </button>
        </div>
        {message ? <p className="mt-3 text-sm text-[#6b5a4c]">{message}</p> : null}
      </form>

      <div className="flex flex-wrap gap-3">
        <input
          placeholder="Search name, phone, group"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-[200px] flex-1 rounded-md border border-[#e0d4c6] bg-white px-3 py-2 text-sm"
        />
        <select
          value={filterSide}
          onChange={(e) => setFilterSide(e.target.value as GuestSide | "all")}
          className="rounded-md border border-[#e0d4c6] bg-white px-3 py-2 text-sm"
        >
          {SIDES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value)}
          className="rounded-md border border-[#e0d4c6] bg-white px-3 py-2 text-sm"
        >
          <option value="all">All groups</option>
          {groups.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {visible.length ? (
        <div className="overflow-x-auto rounded-2xl border border-[#e8dccb] bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#e8dccb] text-[11px] tracking-[0.14em] uppercase text-[#8a7a6a]">
              <tr>
                <th className="px-4 py-3 font-medium">Guest</th>
                <th className="px-4 py-3 font-medium">Side / group</th>
                <th className="px-4 py-3 font-medium">Party</th>
                {initialEvents.map((event) => (
                  <th key={event.id} className="px-4 py-3 font-medium">
                    {event.title}
                  </th>
                ))}
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((guest) => (
                <tr key={guest.id} className="border-b border-[#f0e6d8] last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{guest.name}</p>
                    <p className="text-xs text-[#8a7a6a]">{[guest.phone, guest.email].filter(Boolean).join(" · ")}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6b5a4c]">
                    {guest.side === "bride" ? "Bride" : guest.side === "groom" ? "Groom" : "Other"}
                    {guest.group_name ? ` · ${guest.group_name}` : ""}
                  </td>
                  <td className="px-4 py-3">{guest.party_size}</td>
                  {initialEvents.map((event) => (
                    <td key={event.id} className="px-4 py-3">
                      <select
                        value={statusFor(guest.id, event.id)}
                        onChange={(e) => void setRsvp(guest, event.id, e.target.value as RsvpStatus)}
                        className="rounded-md border border-[#e0d4c6] bg-white px-2 py-1 text-xs"
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <button type="button" className="text-xs text-[#6b1d2a] hover:underline" onClick={() => void removeGuest(guest.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#e0d4c6] px-6 py-12 text-center text-sm text-[#6b5a4c]">
          No guests yet. Add one above, or import a CSV.
        </div>
      )}
    </div>
  );
}
