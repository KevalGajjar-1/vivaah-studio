import type { InviteData } from "@/lib/types";
import { Gopuram, KolamCorner, PaperGrain, Vilakku } from "./ornaments";
import { EventsList, Names, WhenWhere, Wording } from "./shared";

export function SouthIndianTempleCard({ data, cardId }: { data: InviteData; cardId?: string }) {
  return (
    <div className="south-indian-temple relative flex h-full flex-col items-center justify-between px-[10%] py-[7%] text-center">
      <div className="absolute inset-[3%] border-[0.28em] border-[#e8a317]" />
      <div className="absolute inset-[4.6%] border border-[#f4e0b0]/50" />
      <PaperGrain uid={`${cardId}-temple`} opacity={0.18} />
      <KolamCorner className="absolute top-[4.8%] left-[4.8%] h-[14%] w-[14%] text-[#e8a317]/90" />
      <KolamCorner className="absolute top-[4.8%] right-[4.8%] h-[14%] w-[14%] rotate-90 text-[#e8a317]/90" />
      <KolamCorner className="absolute bottom-[4.8%] left-[4.8%] h-[14%] w-[14%] -rotate-90 text-[#e8a317]/90" />
      <KolamCorner className="absolute right-[4.8%] bottom-[4.8%] h-[14%] w-[14%] rotate-180 text-[#e8a317]/90" />
      <Vilakku className="absolute top-[18%] left-[8%] h-[16%] w-[9%] text-[#e8a317]" />
      <Vilakku className="absolute top-[18%] right-[8%] h-[16%] w-[9%] text-[#e8a317]" />

      <header className="relative z-10 mt-[5%] flex flex-col items-center">
        <Gopuram className="h-[18%] w-[28%] text-[#e8a317]" />
        {data.hostLine ? <p className="host">{data.hostLine}</p> : null}
        <p className="kicker">{data.heading || "Kalyanam"}</p>
      </header>
      <div className="relative z-10">
        <Names data={data} className="names" andClassName="amp" />
      </div>
      <div className="relative z-10 mb-[6%] flex flex-col items-center gap-[0.6em]">
        <Wording data={data} className="body" />
        <WhenWhere data={data} className="meta" />
        <EventsList data={data} className="events" />
      </div>
    </div>
  );
}
