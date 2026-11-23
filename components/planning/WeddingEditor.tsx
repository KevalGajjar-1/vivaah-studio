"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DEFAULT_EVENT_TEMPLATES } from "@/lib/planning/events";
import { makeWeddingSlug } from "@/lib/planning/slug";
import type { WeddingEventRow, WeddingRow, WeddingTheme } from "@/lib/planning/types";
import { createClient } from "@/lib/supabase/client";
import type { Language } from "@/lib/types";

type EventDraft = {
  id?: string;
  key: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  venueAddress: string;
  notes: string;
  sort: number;
};

function timeValue(value?: string | null) {
  return (value || "").slice(0, 5);
}

function fromRows(rows: WeddingEventRow[]): EventDraft[] {
  if (!rows.length) {
    return DEFAULT_EVENT_TEMPLATES.map((event, index) => ({
      key: event.key,
      title: event.title,
      date: "",
      time: "",
      venue: "",
      venueAddress: "",
      notes: "",
      sort: index,
    }));
  }
  return rows
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row, index) => ({
      id: row.id,
      key: row.event_key || row.title.toLowerCase(),
      title: row.title,
      date: row.event_date || "",
      time: timeValue(row.event_time),
      venue: row.venue || "",
      venueAddress: row.venue_address || "",
      notes: row.notes || "",
      sort: row.sort_order ?? index,
    }));
}

export function WeddingEditor({
  initial,
  initialEvents,
}: {
  initial: WeddingRow | null;
  initialEvents: WeddingEventRow[];
}) {
  const router = useRouter();
  const [wedding, setWedding] = useState(initial);
  const [partnerA, setPartnerA] = useState(initial?.partner_a || "");
  const [partnerB, setPartnerB] = useState(initial?.partner_b || "");
  const [date, setDate] = useState(initial?.wedding_date || "");
  const [time, setTime] = useState(timeValue(initial?.wedding_time));
  const [venue, setVenue] = useState(initial?.venue || "");
  const [venueAddress, setVenueAddress] = useState(initial?.venue_address || "");
  const [story, setStory] = useState(initial?.story || "");
  const [language, setLanguage] = useState<Language>(initial?.language || "en");
  const [theme, setTheme] = useState<WeddingTheme>(initial?.theme || "ivory");
  const [vibe, setVibe] = useState(initial?.vibe || "");
  const [whatsapp, setWhatsapp] = useState(initial?.whatsapp_phone || "");
  const [published, setPublished] = useState(Boolean(initial?.is_published));
  const [events, setEvents] = useState<EventDraft[]>(fromRows(initialEvents));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const title = useMemo(() => {
    const a = partnerA.trim();
    const b = partnerB.trim();
    if (a && b) return `${a} & ${b}`;
    return a || b || "Our Wedding";
  }, [partnerA, partnerB]);

  function patchEvent(index: number, patch: Partial<EventDraft>) {
    setEvents((current) => current.map((event, i) => (i === index ? { ...event, ...patch } : event)));
  }

  async function save() {
    setBusy(true);
    setMessage("Saving…");
    try {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.push("/login?next=/dashboard/wedding");
        return;
      }
      let current = wedding;
      if (!current) {
        const slug = makeWeddingSlug(partnerA, partnerB);
        const { data, error } = await supabase
          .from("weddings")
          .insert({
            user_id: auth.user.id,
            title,
            slug,
            partner_a: partnerA.trim(),
            partner_b: partnerB.trim(),
            wedding_date: date || null,
            wedding_time: time || null,
            venue: venue.trim() || null,
            venue_address: venueAddress.trim() || null,
            story: story.trim() || null,
            language,
            theme,
            vibe: vibe.trim() || null,
            whatsapp_phone: whatsapp.trim() || null,
            is_published: published,
          })
          .select("*")
          .single();
        if (error || !data) throw new Error(error?.message || "Could not create the wedding page.");
        current = data as WeddingRow;
        setWedding(current);
      } else {
        const { error } = await supabase
          .from("weddings")
          .update({
            title,
            partner_a: partnerA.trim(),
            partner_b: partnerB.trim(),
            wedding_date: date || null,
            wedding_time: time || null,
            venue: venue.trim() || null,
            venue_address: venueAddress.trim() || null,
            story: story.trim() || null,
            language,
            theme,
            vibe: vibe.trim() || null,
            whatsapp_phone: whatsapp.trim() || null,
            is_published: published,
          })
          .eq("id", current.id);
        if (error) throw new Error(error.message);
      }

      const weddingId = current.id;
      const keptIds = events.map((event) => event.id).filter(Boolean) as string[];
      if (keptIds.length) {
        await supabase.from("wedding_events").delete().eq("wedding_id", weddingId).not("id", "in", `(${keptIds.join(",")})`);
      } else {
        await supabase.from("wedding_events").delete().eq("wedding_id", weddingId);
      }

      const nextEvents: EventDraft[] = [];
      for (const [index, event] of events.entries()) {
        if (!event.title.trim()) continue;
        const payload = {
          wedding_id: weddingId,
          title: event.title.trim(),
          event_key: event.key,
          event_date: event.date || null,
          event_time: event.time || null,
          venue: event.venue.trim() || null,
          venue_address: event.venueAddress.trim() || null,
          notes: event.notes.trim() || null,
          sort_order: index,
        };
        if (event.id) {
          const { error } = await supabase.from("wedding_events").update(payload).eq("id", event.id);
          if (error) throw new Error(error.message);
          nextEvents.push({ ...event, sort: index });
        } else {
          const { data, error } = await supabase.from("wedding_events").insert(payload).select("*").single();
          if (error || !data) throw new Error(error?.message || "Could not save an event.");
          nextEvents.push({
            ...event,
            id: data.id,
            sort: index,
          });
        }
      }
      setEvents(nextEvents);
      setMessage(published ? "Saved and published." : "Saved as a draft.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8 space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="partnerA">Name 1</label>
          <input id="partnerA" value={partnerA} onChange={(e) => setPartnerA(e.target.value)} placeholder="Ananya" />
        </div>
        <div className="field">
          <label htmlFor="partnerB">Name 2</label>
          <input id="partnerB" value={partnerB} onChange={(e) => setPartnerB(e.target.value)} placeholder="Arjun" />
        </div>
        <div className="field">
          <label htmlFor="date">Wedding date</label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="time">Time</label>
          <input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div className="field sm:col-span-2">
          <label htmlFor="venue">Venue</label>
          <input id="venue" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="The Leela Palace" />
        </div>
        <div className="field sm:col-span-2">
          <label htmlFor="venueAddress">Address</label>
          <input id="venueAddress" value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} placeholder="Udaipur" />
        </div>
        <div className="field">
          <label htmlFor="language">Language</label>
          <select id="language" value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="gu">Gujarati</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="theme">Page theme</label>
          <select id="theme" value={theme} onChange={(e) => setTheme(e.target.value as WeddingTheme)}>
            <option value="ivory">Ivory</option>
            <option value="wine">Wine</option>
            <option value="marigold">Marigold night</option>
          </select>
        </div>
        <div className="field sm:col-span-2">
          <label htmlFor="vibe">Vibe, in a few words</label>
          <input id="vibe" value={vibe} onChange={(e) => setVibe(e.target.value)} placeholder="Warm, festive, garden" />
        </div>
        <div className="field sm:col-span-2">
          <label htmlFor="story">Your story</label>
          <textarea
            id="story"
            rows={5}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="How you met, the families, or a short welcome for guests."
          />
        </div>
        <div className="field sm:col-span-2">
          <label htmlFor="whatsapp">WhatsApp number, saved for phase 2</label>
          <input
            id="whatsapp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="9198XXXXXXXX"
          />
          <p className="text-xs text-[#8a7a6a]">Invites will not be sent from Vivaah yet. Guests RSVP on the website.</p>
        </div>
      </div>

      <section>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl">Functions</h2>
            <p className="mt-1 text-sm text-[#6b5a4c]">These become the schedule and the RSVP choices on your page.</p>
          </div>
          <button
            type="button"
            className="btn-outline !px-3 !py-1.5 text-xs"
            onClick={() =>
              setEvents((current) => [
                ...current,
                {
                  key: `custom-${current.length + 1}`,
                  title: "",
                  date: "",
                  time: "",
                  venue: "",
                  venueAddress: "",
                  notes: "",
                  sort: current.length,
                },
              ])
            }
          >
            Add event
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {events.map((event, index) => (
            <div key={event.id || event.key + index} className="rounded-2xl border border-[#e8dccb] bg-white p-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  placeholder="Event title"
                  value={event.title}
                  onChange={(e) => patchEvent(index, { title: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" value={event.date} onChange={(e) => patchEvent(index, { date: e.target.value })} />
                  <input type="time" value={event.time} onChange={(e) => patchEvent(index, { time: e.target.value })} />
                </div>
                <input
                  placeholder="Venue"
                  value={event.venue}
                  onChange={(e) => patchEvent(index, { venue: e.target.value })}
                />
                <input
                  placeholder="Address"
                  value={event.venueAddress}
                  onChange={(e) => patchEvent(index, { venueAddress: e.target.value })}
                />
                <input
                  className="sm:col-span-2"
                  placeholder="Notes for guests (optional)"
                  value={event.notes}
                  onChange={(e) => patchEvent(index, { notes: e.target.value })}
                />
              </div>
              <button
                type="button"
                className="mt-2 text-xs text-[#6b1d2a] hover:underline"
                onClick={() => setEvents((current) => current.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Publish this page so guests can open the link
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn-gold" onClick={() => void save()} disabled={busy}>
          {busy ? "Saving…" : published ? "Save and publish" : "Save draft"}
        </button>
        {wedding ? (
          <Link href={`/w/${wedding.slug}`} className="btn-outline" target={published ? "_blank" : undefined}>
            {published ? "View page" : "Preview route"}
          </Link>
        ) : null}
        <Link href="/dashboard/guests" className="btn-outline">
          Guest list
        </Link>
        {message ? <p className="text-sm text-[#6b5a4c]">{message}</p> : null}
      </div>
    </div>
  );
}
