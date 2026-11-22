import type { InviteData } from "@/lib/types";
import { CrossFleur, GothicArch, LilyVine, PaperGrain } from "./ornaments";
import { EventsList, Names, WhenWhere, Wording } from "./shared";

export function ChurchElegantCard({ data, cardId }: { data: InviteData; cardId?: string }) {
  return (
    <div className="church-elegant relative flex h-full flex-col items-center justify-between px-[12%] py-[8%] text-center">
      <PaperGrain uid={`${cardId}-church`} opacity={0.1} />
      <GothicArch className="absolute top-[3%] left-1/2 h-[94%] w-[88%] -translate-x-1/2 text-[#1b2a4a]/80" />
      <LilyVine className="absolute top-[18%] left-[10%] h-[46%] w-[10%] text-[#1b2a4a]/50" />
      <LilyVine className="absolute top-[18%] right-[10%] h-[46%] w-[10%] -scale-x-100 text-[#1b2a4a]/50" />

      <header className="relative z-10 mt-[10%] flex flex-col items-center">
        <CrossFleur className="h-[2.2em] w-[1.8em] text-[#c4a35a]" />
        {data.hostLine ? <p className="host">{data.hostLine}</p> : null}
        <p className="kicker">{data.heading || "Holy Matrimony"}</p>
      </header>
      <div className="relative z-10">
        <Names data={data} className="names" andClassName="amp" />
      </div>
      <div className="relative z-10 mb-[8%] flex flex-col items-center gap-[0.6em]">
        <Wording data={data} className="body" />
        <WhenWhere data={data} className="meta" />
        <EventsList data={data} className="events" />
      </div>
    </div>
  );
}
