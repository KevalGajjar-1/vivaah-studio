"use client";

import { useState } from "react";
import { MESSAGE_STYLES, type MessageInput, type GeneratedMessage } from "@/lib/planning/messages";
import type { MessageStyle } from "@/lib/planning/types";
import type { Language } from "@/lib/types";

const EVENTS = ["Wedding", "Haldi", "Mehendi", "Sangeet", "Reception", "Engagement", "Save the date"];

export function MessageStudio() {
  const [partnerA, setPartnerA] = useState("");
  const [partnerB, setPartnerB] = useState("");
  const [familyA, setFamilyA] = useState("");
  const [familyB, setFamilyB] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [eventTitle, setEventTitle] = useState("Wedding");
  const [language, setLanguage] = useState<Language>("en");
  const [style, setStyle] = useState<MessageStyle>("formal");
  const [messages, setMessages] = useState<GeneratedMessage[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const payload: MessageInput = {
      partnerA,
      partnerB,
      familyA,
      familyB,
      date,
      time,
      venue,
      venueAddress,
      eventTitle,
      language,
      style,
    };
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Could not generate messages.");
        setRemaining(typeof result.remaining === "number" ? result.remaining : remaining);
        return;
      }
      setMessages(result.messages || []);
      setRemaining(typeof result.remaining === "number" ? result.remaining : remaining);
    } catch {
      setError("Could not reach the writer. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function copy(text: string, title: string) {
    await navigator.clipboard.writeText(text);
    setCopied(title);
    window.setTimeout(() => setCopied(""), 1500);
  }

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <form onSubmit={(e) => void generate(e)} className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="m-a">Name 1</label>
          <input id="m-a" value={partnerA} onChange={(e) => setPartnerA(e.target.value)} placeholder="Ananya" required />
        </div>
        <div className="field">
          <label htmlFor="m-b">Name 2</label>
          <input id="m-b" value={partnerB} onChange={(e) => setPartnerB(e.target.value)} placeholder="Arjun" />
        </div>
        <div className="field">
          <label htmlFor="m-fa">Family 1</label>
          <input id="m-fa" value={familyA} onChange={(e) => setFamilyA(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="m-fb">Family 2</label>
          <input id="m-fb" value={familyB} onChange={(e) => setFamilyB(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="m-event">Function</label>
          <select id="m-event" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)}>
            {EVENTS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="m-lang">Language</label>
          <select id="m-lang" value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="gu">Gujarati</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="m-date">Date</label>
          <input id="m-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="m-time">Time</label>
          <input id="m-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div className="field sm:col-span-2">
          <label htmlFor="m-venue">Venue</label>
          <input id="m-venue" value={venue} onChange={(e) => setVenue(e.target.value)} />
        </div>
        <div className="field sm:col-span-2">
          <label htmlFor="m-address">Address</label>
          <input id="m-address" value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <p className="text-[11px] tracking-[0.16em] uppercase text-[#6b5a4c]">Style</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {MESSAGE_STYLES.map((item) => (
              <label
                key={item.id}
                className={`cursor-pointer rounded-xl border px-3 py-3 text-sm ${
                  style === item.id ? "border-[#6b1d2a] bg-[#6b1d2a] text-[#f7f1e8]" : "border-[#e0d4c6] bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="style"
                  value={item.id}
                  checked={style === item.id}
                  onChange={() => setStyle(item.id)}
                  className="sr-only"
                />
                <span className="font-medium">{item.label}</span>
                <span className="mt-1 block text-xs opacity-80">{item.hint}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className="btn-gold" disabled={busy}>
            {busy ? "Writing…" : "Write messages"}
          </button>
          {remaining != null ? (
            <p className="mt-3 text-xs text-[#8a7a6a]">{remaining} free generations left today</p>
          ) : (
            <p className="mt-3 text-xs text-[#8a7a6a]">No account needed. 8 free generations per day.</p>
          )}
          {error ? <p className="mt-2 text-sm text-[#6b1d2a]">{error}</p> : null}
        </div>
      </form>
      <div>
        {messages.length ? (
          <ul className="space-y-4">
            {messages.map((item) => (
              <li key={item.title} className="rounded-2xl border border-[#e8dccb] bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[11px] tracking-[0.16em] uppercase text-[#8a7a6a]">{item.title}</p>
                  <button type="button" className="text-xs text-[#6b1d2a] hover:underline" onClick={() => void copy(item.text, item.title)}>
                    {copied === item.title ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-[#2a211c]">{item.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#e0d4c6] px-6 py-16 text-center text-sm text-[#6b5a4c]">
            Messages appear here, ready to copy into WhatsApp or a card.
          </div>
        )}
      </div>
    </div>
  );
}
