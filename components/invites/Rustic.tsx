import type { InviteData } from "@/lib/types";
import { OakLeaf, PaperGrain, TwineBow } from "./ornaments";
import { EventsList, Names, WhenWhere, Wording } from "./shared";

export function RusticCard({ data, cardId }: { data: InviteData; cardId?: string }) {
  return (
    <div className="rustic relative flex h-full flex-col items-center justify-between px-[10%] py-[8%] text-center">
      <div className="absolute inset-[4%] border border-[#6b4f32]/50" />
      <PaperGrain uid={`${cardId}-rustic`} opacity={0.28} />
      <OakLeaf className="absolute top-[5%] left-[4%] h-[22%] w-[14%] text-[#6b4f32]/80" />
      <OakLeaf className="absolute top-[5%] right-[4%] h-[22%] w-[14%] -scale-x-100 text-[#6b4f32]/80" />
      <OakLeaf className="absolute bottom-[4%] left-[4%] h-[22%] w-[14%] -scale-y-100 text-[#6b4f32]/70" />
      <OakLeaf className="absolute right-[4%] bottom-[4%] h-[22%] w-[14%] rotate-180 text-[#6b4f32]/70" />

      <header className="relative z-10 mt-[8%] flex flex-col items-center">
        <TwineBow className="h-[2.4em] w-[5.5em] text-[#6b4f32]" />
        {data.hostLine ? <p className="host">{data.hostLine}</p> : null}
        <p className="kicker">{data.heading || "Here's to forever"}</p>
      </header>
      <div className="relative z-10">
        <Names data={data} className="names" andClassName="amp" />
      </div>
      <div className="relative z-10 mb-[6%] flex flex-col items-center gap-[0.65em]">
        <Wording data={data} className="body" />
        <WhenWhere data={data} className="meta" />
        <EventsList data={data} className="events" />
      </div>
    </div>
  );
}
