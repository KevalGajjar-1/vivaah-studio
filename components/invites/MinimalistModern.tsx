import type { InviteData } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/format";
import { EventsList, Names, Wording } from "./shared";

export function MinimalistModernCard({ data }: { data: InviteData; cardId?: string }) {
  const date = formatDate(data.date, data.language);
  const time = formatTime(data.time, data.language);
  return (
    <div className="minimalist-modern relative flex h-full flex-col justify-between px-[11%] py-[11%]">
      <div className="absolute inset-[6%] border border-[#c2a15a]/70" />
      <header>
        <p className="kicker">{data.heading || "We're getting married"}</p>
        {data.hostLine ? <p className="host">{data.hostLine}</p> : null}
      </header>
      <div className="my-auto">
        <Names data={data} className="names" andClassName="amp" />
      </div>
      <div className="flex flex-col gap-[0.8em]">
        <Wording data={data} className="body" />
        <div className="rule" />
        <p className="date">{[date, time].filter(Boolean).join("  ·  ")}</p>
        {data.venue ? <p className="venue">{data.venue}</p> : null}
        {data.venueAddress ? <p className="venue subtle">{data.venueAddress}</p> : null}
        <EventsList data={data} className="events" />
      </div>
    </div>
  );
}
