import type { InviteData } from "@/lib/types";
import { DecoCorner, DecoFan, PaperGrain } from "./ornaments";
import { EventsList, Names, WhenWhere, Wording } from "./shared";

export function ArtDecoCard({ data, cardId }: { data: InviteData; cardId?: string }) {
  return (
    <div className="art-deco relative flex h-full flex-col items-center justify-between px-[11%] py-[9%] text-center">
      <div className="absolute inset-[4%] border-[0.22em] border-[#d4af37]" />
      <div className="absolute inset-[5.4%] border border-[#d4af37]/60" />
      <PaperGrain uid={`${cardId}-deco`} opacity={0.14} />
      <DecoCorner className="absolute top-[4%] left-[4%] h-[14%] w-[14%] text-[#d4af37]" />
      <DecoCorner className="absolute top-[4%] right-[4%] h-[14%] w-[14%] rotate-90 text-[#d4af37]" />
      <DecoCorner className="absolute bottom-[4%] left-[4%] h-[14%] w-[14%] -rotate-90 text-[#d4af37]" />
      <DecoCorner className="absolute right-[4%] bottom-[4%] h-[14%] w-[14%] rotate-180 text-[#d4af37]" />
      <DecoFan className="absolute top-[7%] left-1/2 h-[11%] w-[36%] -translate-x-1/2 text-[#d4af37]/80" />
      <DecoFan className="absolute bottom-[7%] left-1/2 h-[11%] w-[36%] -translate-x-1/2 rotate-180 text-[#d4af37]/80" />

      <header className="relative z-10 mt-[14%]">
        {data.hostLine ? <p className="host">{data.hostLine}</p> : null}
        <p className="kicker">{data.heading || "Request the Pleasure of Your Company"}</p>
      </header>
      <div className="relative z-10">
        <Names data={data} className="names" andClassName="amp" />
      </div>
      <div className="relative z-10 mb-[12%] flex flex-col items-center gap-[0.65em]">
        <Wording data={data} className="body" />
        <div className="diamond" />
        <WhenWhere data={data} className="meta" />
        <EventsList data={data} className="events" />
      </div>
    </div>
  );
}
