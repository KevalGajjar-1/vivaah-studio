import type { InviteData } from "@/lib/types";
import { Lotus, Mandala, Paisley, PaperGrain } from "./ornaments";
import { EventsList, Names, WhenWhere, Wording } from "./shared";

export function RoyalMandalaCard({ data, cardId }: { data: InviteData; cardId?: string }) {
  return (
    <div className="royal-mandala relative flex h-full flex-col items-center justify-between px-[10%] py-[8%] text-center">
      <div className="absolute inset-[3%] border-[0.18em] border-[#e8c872]/80" />
      <div className="absolute inset-[4.2%] border border-[#e8c872]/40" />
      <PaperGrain uid={`${cardId}-mandala`} opacity={0.2} />
      <Mandala className="absolute top-1/2 left-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 text-[#e8c872] opacity-25" />
      <Paisley className="absolute top-[6%] left-[6%] h-[16%] w-[11%] text-[#e8c872]/80" />
      <Paisley className="absolute top-[6%] right-[6%] h-[16%] w-[11%] -scale-x-100 text-[#e8c872]/80" />
      <Paisley className="absolute bottom-[6%] left-[6%] h-[16%] w-[11%] -scale-y-100 text-[#e8c872]/80" />
      <Paisley className="absolute right-[6%] bottom-[6%] h-[16%] w-[11%] scale-x-[-1] scale-y-[-1] text-[#e8c872]/80" />

      <header className="relative z-10 mt-[7%]">
        <p className="sacred">शुभ मंगल</p>
        {data.hostLine ? <p className="host">{data.hostLine}</p> : null}
        <p className="kicker">{data.heading || "Shubh Vivah"}</p>
      </header>

      <div className="relative z-10">
        <Names data={data} className="names" andClassName="amp" />
      </div>

      <div className="relative z-10 mb-[6%] flex flex-col items-center gap-[0.65em]">
        <Wording data={data} className="body" />
        <Lotus className="h-[2em] w-[4.2em] text-[#e8c872]" />
        <WhenWhere data={data} className="meta" />
        <EventsList data={data} className="events" />
      </div>
    </div>
  );
}
