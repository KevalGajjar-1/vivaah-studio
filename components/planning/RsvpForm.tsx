"use client";

import { useState } from "react";
import type { GuestSide, RsvpStatus, WeddingEventRow } from "@/lib/planning/types";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function RsvpForm({ slug, events }: { slug: string; events: WeddingEventRow[] }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [side, setSide] = useState<GuestSide>("other");
  const [partySize, setPartySize] = useState(1);
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState<Record<string, RsvpStatus>>(() =>
    Object.fromEntries(events.map((event) => [event.id, "yes"])),
  );
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      setError("RSVP is not available just now.");
      return;
    }
    setBusy(true);
    setError("");
    const { data, error: rpcError } = await createClient().rpc("submit_wedding_rsvp", {
      p_slug: slug,
      p_name: name,
      p_phone: phone || null,
      p_email: email || null,
      p_side: side,
      p_party_size: partySize,
      p_message: message || null,
      p_responses: events.map((event) => ({ event_id: event.id, status: responses[event.id] || "pending" })),
    });
    setBusy(false);
    if (rpcError) {
      setError(rpcError.message || "Could not send your RSVP.");
      return;
    }
    if (!(data as { ok?: boolean } | null)?.ok && data) {
      // some clients return the jsonb directly
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-current/20 px-6 py-10 text-center">
        <p className="font-serif text-3xl">Thank you</p>
        <p className="mt-3 text-sm opacity-80">Your RSVP has been received. We look forward to celebrating with you.</p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="rounded-3xl border border-current/15 bg-black/5 p-6 backdrop-blur-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs tracking-[0.16em] uppercase opacity-70">
          Your name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-current/20 bg-transparent px-3 py-2 text-sm tracking-normal normal-case opacity-100"
          />
        </label>
        <label className="block text-xs tracking-[0.16em] uppercase opacity-70">
          Phone
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-md border border-current/20 bg-transparent px-3 py-2 text-sm tracking-normal normal-case"
          />
        </label>
        <label className="block text-xs tracking-[0.16em] uppercase opacity-70">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-current/20 bg-transparent px-3 py-2 text-sm tracking-normal normal-case"
          />
        </label>
        <label className="block text-xs tracking-[0.16em] uppercase opacity-70">
          Side
          <select
            value={side}
            onChange={(e) => setSide(e.target.value as GuestSide)}
            className="mt-1 w-full rounded-md border border-current/20 bg-transparent px-3 py-2 text-sm tracking-normal normal-case"
          >
            <option value="bride">Bride&apos;s family</option>
            <option value="groom">Groom&apos;s family</option>
            <option value="other">Friend / other</option>
          </select>
        </label>
        <label className="block text-xs tracking-[0.16em] uppercase opacity-70">
          Number of guests
          <input
            type="number"
            min={1}
            max={20}
            value={partySize}
            onChange={(e) => setPartySize(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
            className="mt-1 w-full rounded-md border border-current/20 bg-transparent px-3 py-2 text-sm tracking-normal normal-case"
          />
        </label>
        <label className="block text-xs tracking-[0.16em] uppercase opacity-70 sm:col-span-2">
          A note for the couple
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full rounded-md border border-current/20 bg-transparent px-3 py-2 text-sm tracking-normal normal-case"
          />
        </label>
      </div>
      {events.length ? (
        <div className="mt-5 space-y-3">
          <p className="text-xs tracking-[0.16em] uppercase opacity-70">Which functions will you attend?</p>
          {events.map((event) => (
            <label key={event.id} className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <span>{event.title}</span>
              <select
                value={responses[event.id] || "yes"}
                onChange={(e) => setResponses((current) => ({ ...current, [event.id]: e.target.value as RsvpStatus }))}
                className="rounded-md border border-current/20 bg-transparent px-2 py-1 text-sm"
              >
                <option value="yes">Yes</option>
                <option value="maybe">Maybe</option>
                <option value="no">No</option>
              </select>
            </label>
          ))}
        </div>
      ) : null}
      {error ? <p className="mt-3 text-sm text-[#c45c5c]">{error}</p> : null}
      <button type="submit" className="btn-gold mt-6" disabled={busy}>
        {busy ? "Sending…" : "Send RSVP"}
      </button>
    </form>
  );
}
