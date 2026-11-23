"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Countdown } from "@/components/planning/Countdown";
import { RsvpForm } from "@/components/planning/RsvpForm";
import { formatDate, formatTime, joinNames, monogram } from "@/lib/format";
import { mapsSearchUrl } from "@/lib/planning/events";
import type { WeddingEventRow, WeddingRow } from "@/lib/planning/types";

gsap.registerPlugin(useGSAP);

export function WeddingSite({ wedding, events }: { wedding: WeddingRow; events: WeddingEventRow[] }) {
  const language = wedding.language || "en";
  const names = joinNames(wedding.partner_a, wedding.partner_b, language);
  const dateLabel = formatDate(wedding.wedding_date || undefined, language);
  const timeLabel = formatTime(wedding.wedding_time || undefined, language);
  const venueLine = [wedding.venue, wedding.venue_address].filter(Boolean).join(", ");
  const map = mapsSearchUrl(wedding.venue, wedding.venue_address);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set("[data-reveal]", { opacity: 1, y: 0 });
      return;
    }
    gsap.to("[data-reveal]", {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.14,
      ease: "power2.out",
    });
  });

  return (
    <div className={`wedding-site`} data-theme={wedding.theme || "ivory"} data-lang={language}>
      <section className="relative overflow-hidden px-5 py-24 text-center sm:py-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              wedding.theme === "ivory"
                ? "radial-gradient(ellipse at 50% 0%, #e8dccb 0%, transparent 60%)"
                : "radial-gradient(ellipse at 50% 0%, #6b1d2a 0%, transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl">
          <p data-reveal className="wedding-kicker opacity-80">
            {language === "hi" ? "शुभ विवाह" : language === "gu" ? "શુભ લગ્ન" : "Together with their families"}
          </p>
          <p data-reveal className="font-serif mt-6 text-2xl opacity-80">
            {monogram(wedding.partner_a, wedding.partner_b)}
          </p>
          <h1 data-reveal className="wedding-hero-title mt-4 text-5xl sm:text-7xl">
            {names}
          </h1>
          <p data-reveal className="mt-6 text-lg opacity-80">
            {[dateLabel, timeLabel].filter(Boolean).join(" · ")}
          </p>
          {venueLine ? (
            <p data-reveal className="mt-2 text-sm opacity-70">
              {venueLine}
            </p>
          ) : null}
          <div data-reveal className="mt-10">
            <Countdown date={wedding.wedding_date} time={wedding.wedding_time} />
          </div>
        </div>
      </section>

      {wedding.story ? (
        <section className="mx-auto max-w-2xl px-5 py-16 text-center" data-reveal>
          <p className="wedding-kicker opacity-70">Our story</p>
          <p className="font-serif mt-6 text-2xl leading-relaxed sm:text-3xl">{wedding.story}</p>
        </section>
      ) : null}

      {events.length ? (
        <section className="mx-auto max-w-3xl px-5 py-16">
          <p className="wedding-kicker text-center opacity-70" data-reveal>
            The celebrations
          </p>
          <h2 className="font-serif mt-3 text-center text-4xl" data-reveal>
            Event schedule
          </h2>
          <ol className="mt-10 space-y-6">
            {events.map((event) => {
              const eventMap = mapsSearchUrl(event.venue, event.venue_address);
              return (
                <li key={event.id} data-reveal className="border-t border-current/15 pt-6">
                  <p className="font-serif text-3xl">{event.title}</p>
                  <p className="mt-2 text-sm opacity-80">
                    {[formatDate(event.event_date || undefined, language), formatTime(event.event_time || undefined, language)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {[event.venue, event.venue_address].filter(Boolean).length ? (
                    <p className="mt-1 text-sm opacity-80">{[event.venue, event.venue_address].filter(Boolean).join(", ")}</p>
                  ) : null}
                  {event.notes ? <p className="mt-2 text-sm opacity-70">{event.notes}</p> : null}
                  {eventMap ? (
                    <a href={eventMap} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm underline underline-offset-4">
                      Open map
                    </a>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}

      {venueLine ? (
        <section className="mx-auto max-w-2xl px-5 py-16 text-center" data-reveal>
          <p className="wedding-kicker opacity-70">Venue</p>
          <h2 className="font-serif mt-3 text-4xl">{wedding.venue || "Join us"}</h2>
          {wedding.venue_address ? <p className="mt-3 text-sm opacity-80">{wedding.venue_address}</p> : null}
          {map ? (
            <a href={map} target="_blank" rel="noreferrer" className="btn-gold mt-6 inline-flex">
              Get directions
            </a>
          ) : null}
        </section>
      ) : null}

      <section className="mx-auto max-w-2xl px-5 py-16" id="rsvp">
        <div className="text-center" data-reveal>
          <p className="wedding-kicker opacity-70">Kindly reply</p>
          <h2 className="font-serif mt-3 text-4xl">RSVP</h2>
          <p className="mx-auto mt-3 max-w-md text-sm opacity-75">
            Tell us if you will be with us, and for which functions. WhatsApp replies will arrive in a later phase.
          </p>
        </div>
        <div className="mt-8" data-reveal>
          <RsvpForm slug={wedding.slug} events={events} />
        </div>
      </section>

      <footer className="px-5 py-10 text-center text-xs opacity-50">
        {names}
        {dateLabel ? ` · ${dateLabel}` : ""}
      </footer>
    </div>
  );
}
