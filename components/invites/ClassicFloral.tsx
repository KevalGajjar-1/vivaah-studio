import type { InviteData } from "@/lib/types";
import { FloralCorner, FloralSprig, PaperGrain } from "./ornaments";
import { EventsList, Names, WhenWhere, Wording } from "./shared";

export function ClassicFloralCard({ data, cardId }: { data: InviteData; cardId?: string }) {
  return (
    <div className="classic-floral relative flex h-full flex-col items-center justify-between px-[9%] py-[8%] text-center">
      <div className="absolute inset-[3.5%] border border-[#c9a84c]/50" />
      <div className="absolute inset-[4.4%] border border-[#8b3a42]/20" />
      <PaperGrain uid={`${cardId}-floral`} opacity={0.12} />
      <FloralCorner className="absolute top-[3%] left-[3%] h-[22%] w-[22%] text-[#7a8f6e]" />
      <FloralCorner className="absolute top-[3%] right-[3%] h-[22%] w-[22%] rotate-90 text-[#7a8f6e]" />
      <FloralCorner className="absolute bottom-[3%] left-[3%] h-[22%] w-[22%] -rotate-90 text-[#7a8f6e]" />
      <FloralCorner className="absolute right-[3%] bottom-[3%] h-[22%] w-[22%] rotate-180 text-[#7a8f6e]" />

      <header className="relative z-10 mt-[6%]">
        {data.hostLine ? <p className="host">{data.hostLine}</p> : null}
        <p className="kicker">{data.heading || "The Wedding Of"}</p>
        <FloralSprig className="mx-auto mt-[0.4em] h-[1.4em] w-[6em] text-[#c9a84c]" />
      </header>

      <div className="relative z-10 my-[2%]">
        <Names data={data} className="names" andClassName="amp" />
      </div>

      <div className="relative z-10 mb-[6%] flex flex-col items-center gap-[0.7em]">
        <Wording data={data} className="body" />
        <FloralSprig className="h-[1.2em] w-[5.5em] text-[#7a8f6e]" />
        <WhenWhere data={data} className="meta" dateClassName="date" venueClassName="venue" />
        <EventsList data={data} className="events" />
      </div>
    </div>
  );
}
