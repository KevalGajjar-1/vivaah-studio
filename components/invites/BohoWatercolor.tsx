import type { InviteData } from "@/lib/types";
import { FloralCorner, PaperGrain, WatercolorWash } from "./ornaments";
import { EventsList, Names, WhenWhere, Wording } from "./shared";

export function BohoWatercolorCard({ data, cardId }: { data: InviteData; cardId?: string }) {
  return (
    <div className="boho-watercolor relative flex h-full flex-col items-center justify-between px-[10%] py-[9%] text-center">
      <WatercolorWash uid={`${cardId}-boho`} />
      <PaperGrain uid={`${cardId}-boho-g`} opacity={0.1} />
      <FloralCorner className="absolute top-[2%] left-[2%] h-[24%] w-[24%] text-[#7c8a5a]/80" />
      <FloralCorner className="absolute top-[2%] right-[2%] h-[24%] w-[24%] rotate-90 text-[#c56a3a]/70" />
      <FloralCorner className="absolute bottom-[2%] left-[2%] h-[24%] w-[24%] -rotate-90 text-[#c56a3a]/70" />
      <FloralCorner className="absolute right-[2%] bottom-[2%] h-[24%] w-[24%] rotate-180 text-[#7c8a5a]/80" />

      <header className="relative z-10 mt-[8%]">
        {data.hostLine ? <p className="host">{data.hostLine}</p> : null}
        <p className="kicker">{data.heading || "A celebration of love"}</p>
      </header>
      <div className="relative z-10">
        <Names data={data} className="names" andClassName="amp" />
      </div>
      <div className="relative z-10 mb-[6%] flex flex-col items-center gap-[0.7em]">
        <Wording data={data} className="body" />
        <WhenWhere data={data} className="meta" />
        <EventsList data={data} className="events" />
      </div>
    </div>
  );
}
