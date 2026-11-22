"use client";

import { formatDate, formatTime } from "@/lib/format";
import type { CatalogTemplate } from "@/lib/catalog/types";
import { Watermark } from "./Watermark";

export function VideoInvite({
  template,
  fields,
  watermark = false,
  playing = true,
  className = "",
}: {
  template: CatalogTemplate;
  fields: Record<string, string>;
  watermark?: boolean;
  playing?: boolean;
  className?: string;
}) {
  const video = template.video;
  const heading = fields.heading || template.sample.heading || "";
  const host = fields.hostLine || "";
  const a = (fields.partnerA || "Your Name").trim();
  const b = (fields.partnerB || "Their Name").trim();
  const wording = fields.wording || "";
  const date = formatDate(fields.date, "en");
  const time = formatTime(fields.time, "en");
  const venue = [fields.venue, fields.venueAddress].filter(Boolean).join(" · ");

  return (
    <article
      data-invite-card
      data-video-invite
      className={`invite-card relative aspect-[9/16] w-full overflow-hidden bg-black shadow-[0_20px_50px_-24px_rgba(0,0,0,0.55)] ${className}`}
    >
      {video?.file ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={video.file}
          autoPlay={playing}
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : null}
      <div className="absolute inset-0" style={{ background: video?.overlay || "rgba(0,0,0,.45)" }} />
      <div className="relative z-10 flex h-full flex-col items-center justify-between px-[9%] py-[12%] text-center text-[#f7f1e8]">
        <header className="vid-fade mt-[6%]">
          {host ? <p className="mb-2 text-[3.2cqi] italic opacity-90">{host}</p> : null}
          <p className="text-[3cqi] tracking-[0.35em] uppercase text-[#e8c872]">{heading}</p>
        </header>
        <div className="vid-fade-slow">
          <h1 className="font-serif text-[11cqi] leading-[1.05]">
            <span className="block">{a}</span>
            <span className="my-[0.1em] block font-serif text-[6cqi] text-[#e8c872]">&</span>
            <span className="block">{b}</span>
          </h1>
        </div>
        <div className="vid-fade mb-[4%] max-w-[90%] text-[3.1cqi] leading-relaxed">
          {wording ? <p className="mb-3 opacity-95">{wording}</p> : null}
          {date ? <p className="tracking-[0.12em] uppercase text-[#e8c872]">{date}</p> : null}
          {time ? <p className="opacity-90">{time}</p> : null}
          {venue ? <p className="mt-1 opacity-90">{venue}</p> : null}
        </div>
      </div>
      <Watermark show={watermark} />
    </article>
  );
}
