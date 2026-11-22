"use client";

import type { CeremonyStyle, EventItem, InviteData, Language, Tone } from "@/lib/types";

type Props = {
  data: InviteData;
  onChange: (patch: Partial<InviteData>) => void;
};

const tones: { id: Tone; label: string }[] = [
  { id: "warm", label: "Warm" },
  { id: "traditional", label: "Traditional" },
  { id: "formal", label: "Formal" },
  { id: "poetic", label: "Poetic" },
  { id: "modern", label: "Modern" },
  { id: "playful", label: "Playful" },
];

const styles: { id: CeremonyStyle; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "hindu", label: "Hindu" },
  { id: "christian", label: "Christian" },
  { id: "muslim", label: "Muslim / Nikah" },
  { id: "south-indian", label: "South Indian" },
  { id: "modern", label: "Modern" },
  { id: "boho", label: "Boho" },
  { id: "rustic", label: "Rustic" },
  { id: "art-deco", label: "Art Deco" },
];

function setEvent(events: EventItem[] | undefined, index: number, patch: Partial<EventItem>): EventItem[] {
  const next = [...(events || [])];
  while (next.length <= index) next.push({ title: "" });
  next[index] = { ...next[index], ...patch };
  return next;
}

export function InviteFormFields({ data, onChange }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="field">
        <label htmlFor="partnerA">Name 1</label>
        <input id="partnerA" value={data.partnerA} onChange={(e) => onChange({ partnerA: e.target.value })} placeholder="Ananya" />
      </div>
      <div className="field">
        <label htmlFor="partnerB">Name 2</label>
        <input id="partnerB" value={data.partnerB} onChange={(e) => onChange({ partnerB: e.target.value })} placeholder="Arjun" />
      </div>
      <div className="field">
        <label htmlFor="date">Date</label>
        <input id="date" type="date" value={data.date} onChange={(e) => onChange({ date: e.target.value })} />
      </div>
      <div className="field">
        <label htmlFor="time">Time</label>
        <input id="time" type="time" value={data.time || ""} onChange={(e) => onChange({ time: e.target.value })} />
      </div>
      <div className="field sm:col-span-2">
        <label htmlFor="venue">Venue</label>
        <input id="venue" value={data.venue} onChange={(e) => onChange({ venue: e.target.value })} placeholder="The Leela Palace" />
      </div>
      <div className="field sm:col-span-2">
        <label htmlFor="venueAddress">Address</label>
        <input id="venueAddress" value={data.venueAddress || ""} onChange={(e) => onChange({ venueAddress: e.target.value })} placeholder="Udaipur" />
      </div>
      <div className="field">
        <label htmlFor="familyA">Family 1</label>
        <input id="familyA" value={data.familyA || ""} onChange={(e) => onChange({ familyA: e.target.value })} placeholder="Sharma Parivar" />
      </div>
      <div className="field">
        <label htmlFor="familyB">Family 2</label>
        <input id="familyB" value={data.familyB || ""} onChange={(e) => onChange({ familyB: e.target.value })} placeholder="Mehta Parivar" />
      </div>
      <div className="field">
        <label htmlFor="language">Language</label>
        <select
          id="language"
          value={data.language}
          onChange={(e) => onChange({ language: e.target.value as Language })}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="gu">Gujarati</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="tone">Tone</label>
        <select id="tone" value={data.tone || "warm"} onChange={(e) => onChange({ tone: e.target.value as Tone })}>
          {tones.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field sm:col-span-2">
        <label htmlFor="style">Religion / style</label>
        <select id="style" value={data.style || "classic"} onChange={(e) => onChange({ style: e.target.value as CeremonyStyle })}>
          {styles.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="rsvpPhone">WhatsApp RSVP (with country code)</label>
        <input id="rsvpPhone" value={data.rsvpPhone || ""} onChange={(e) => onChange({ rsvpPhone: e.target.value })} placeholder="9198XXXXXXXX" />
      </div>
      <div className="field">
        <label htmlFor="rsvpName">RSVP from (optional)</label>
        <input id="rsvpName" value={data.rsvpName || ""} onChange={(e) => onChange({ rsvpName: e.target.value })} placeholder="Guest name in the message" />
      </div>
      <div className="field sm:col-span-2">
        <label htmlFor="event1">Additional event 1</label>
        <input
          id="event1"
          value={data.events?.[0]?.title || ""}
          onChange={(e) => onChange({ events: setEvent(data.events, 0, { title: e.target.value }) })}
          placeholder="Reception, Sangeet, Walima…"
        />
        <div className="mt-2 grid grid-cols-3 gap-2">
          <input type="date" value={data.events?.[0]?.date || ""} onChange={(e) => onChange({ events: setEvent(data.events, 0, { date: e.target.value }) })} />
          <input type="time" value={data.events?.[0]?.time || ""} onChange={(e) => onChange({ events: setEvent(data.events, 0, { time: e.target.value }) })} />
          <input placeholder="Venue" value={data.events?.[0]?.venue || ""} onChange={(e) => onChange({ events: setEvent(data.events, 0, { venue: e.target.value }) })} />
        </div>
      </div>
      <div className="field sm:col-span-2">
        <label htmlFor="event2">Additional event 2</label>
        <input
          id="event2"
          value={data.events?.[1]?.title || ""}
          onChange={(e) => onChange({ events: setEvent(data.events, 1, { title: e.target.value }) })}
          placeholder="Mehendi, brunch…"
        />
        <div className="mt-2 grid grid-cols-3 gap-2">
          <input type="date" value={data.events?.[1]?.date || ""} onChange={(e) => onChange({ events: setEvent(data.events, 1, { date: e.target.value }) })} />
          <input type="time" value={data.events?.[1]?.time || ""} onChange={(e) => onChange({ events: setEvent(data.events, 1, { time: e.target.value }) })} />
          <input placeholder="Venue" value={data.events?.[1]?.venue || ""} onChange={(e) => onChange({ events: setEvent(data.events, 1, { venue: e.target.value }) })} />
        </div>
      </div>
    </div>
  );
}
