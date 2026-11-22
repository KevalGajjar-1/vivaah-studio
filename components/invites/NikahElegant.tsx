import type { InviteData } from "@/lib/types";
import { ArabesqueBorder, Crescent, PaperGrain } from "./ornaments";
import { EventsList, Names, WhenWhere, Wording } from "./shared";

export function NikahElegantCard({ data, cardId }: { data: InviteData; cardId?: string }) {
  return (
    <div className="nikah-elegant relative flex h-full flex-col items-center justify-between px-[11%] py-[8%] text-center">
      <div className="absolute inset-[3.2%] border-[0.2em] border-[#d4af37]/90" />
      <div className="absolute inset-[4.6%] border border-[#d4af37]/45" />
      <PaperGrain uid={`${cardId}-nikah`} opacity={0.16} />
      <ArabesqueBorder className="absolute top-1/2 left-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 text-[#d4af37] opacity-20" />

      <header className="relative z-10 mt-[8%] flex flex-col items-center">
        <p className="bismillah">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ</p>
        <div className="mt-[0.4em] flex items-center gap-[0.5em] text-[#d4af37]">
          <span className="rule-h" />
          <Crescent className="h-[1.1em] w-[1.1em]" />
          <span className="rule-h" />
        </div>
        {data.hostLine ? <p className="host">{data.hostLine}</p> : null}
        <p className="kicker">{data.heading || "Nikah Ceremony"}</p>
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
