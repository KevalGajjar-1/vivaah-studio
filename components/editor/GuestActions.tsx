"use client";

import { DownloadActions } from "@/components/editor/DownloadActions";
import type { InviteData } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/format";

function calendarUrl(data: InviteData): string | null {
  if (!data.date) return null;
  const start = data.date.replace(/-/g, "");
  const title = encodeURIComponent(`Wedding of ${data.partnerA} & ${data.partnerB}`);
  const details = encodeURIComponent(data.wording || "");
  const location = encodeURIComponent([data.venue, data.venueAddress].filter(Boolean).join(", "));
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${start}&details=${details}&location=${location}`;
}

function mapsUrl(data: InviteData): string | null {
  const q = [data.venue, data.venueAddress].filter(Boolean).join(", ");
  if (!q) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export function GuestActions({ data }: { data: InviteData }) {
  const cal = calendarUrl(data);
  const map = mapsUrl(data);
  const when = [formatDate(data.date, data.language), formatTime(data.time, data.language)]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="rounded-2xl border border-[#e0d4c6] bg-white p-5">
      <p className="font-serif text-xl">
        {data.partnerA} & {data.partnerB}
      </p>
      {when ? <p className="mt-1 text-sm text-[#6b5a4c]">{when}</p> : null}
      {data.venue ? <p className="mt-1 text-sm text-[#6b5a4c]">{[data.venue, data.venueAddress].filter(Boolean).join(", ")}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <DownloadActions data={data} />
        {cal ? (
          <a href={cal} target="_blank" rel="noreferrer" className="btn-outline !px-3 !py-2 text-xs">
            Add to calendar
          </a>
        ) : null}
        {map ? (
          <a href={map} target="_blank" rel="noreferrer" className="btn-outline !px-3 !py-2 text-xs">
            Open maps
          </a>
        ) : null}
      </div>
    </div>
  );
}
