import {
  ArabesqueBorder,
  Crescent,
  CrossFleur,
  DecoCorner,
  DecoFan,
  FloralCorner,
  FloralSprig,
  GothicArch,
  Gopuram,
  KolamCorner,
  LilyVine,
  Lotus,
  Mandala,
  OakLeaf,
  Paisley,
  PaperGrain,
  TwineBow,
  Vilakku,
  WatercolorWash,
} from "@/components/invites/ornaments";

export function OrnamentLayer({
  ornament,
  color,
  skin,
  uid,
}: {
  ornament: string;
  color?: string;
  skin: string;
  uid: string;
}) {
  const c = color || "currentColor";
  if (ornament === "floral-corners") {
    return (
      <>
        {skin === "boho-watercolor" || skin === "jade-mehendi" ? <WatercolorWash uid={`${uid}-w`} /> : null}
        <PaperGrain uid={`${uid}-g`} opacity={0.1} />
        <FloralCorner className="absolute top-[3%] left-[3%] h-[22%] w-[22%]" style={{ color: c }} />
        <FloralCorner className="absolute top-[3%] right-[3%] h-[22%] w-[22%] rotate-90" style={{ color: c }} />
        <FloralCorner className="absolute bottom-[3%] left-[3%] h-[22%] w-[22%] -rotate-90" style={{ color: c }} />
        <FloralCorner className="absolute right-[3%] bottom-[3%] h-[22%] w-[22%] rotate-180" style={{ color: c }} />
      </>
    );
  }
  if (ornament === "mandala") {
    return (
      <>
        <PaperGrain uid={`${uid}-g`} opacity={0.18} />
        <Mandala className="absolute top-1/2 left-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 opacity-25" style={{ color: c }} />
        <Paisley className="absolute top-[6%] left-[6%] h-[16%] w-[11%] opacity-80" style={{ color: c }} />
        <Paisley className="absolute top-[6%] right-[6%] h-[16%] w-[11%] -scale-x-100 opacity-80" style={{ color: c }} />
        <Paisley className="absolute bottom-[6%] left-[6%] h-[16%] w-[11%] -scale-y-100 opacity-80" style={{ color: c }} />
        <Paisley className="absolute right-[6%] bottom-[6%] h-[16%] w-[11%] rotate-180 opacity-80" style={{ color: c }} />
        <Lotus className="absolute bottom-[9%] left-1/2 h-[2.2em] w-[4.4em] -translate-x-1/2" style={{ color: c }} />
      </>
    );
  }
  if (ornament === "deco-frame") {
    return (
      <>
        <PaperGrain uid={`${uid}-g`} opacity={0.12} />
        <DecoCorner className="absolute top-[4%] left-[4%] h-[14%] w-[14%]" style={{ color: c }} />
        <DecoCorner className="absolute top-[4%] right-[4%] h-[14%] w-[14%] rotate-90" style={{ color: c }} />
        <DecoCorner className="absolute bottom-[4%] left-[4%] h-[14%] w-[14%] -rotate-90" style={{ color: c }} />
        <DecoCorner className="absolute right-[4%] bottom-[4%] h-[14%] w-[14%] rotate-180" style={{ color: c }} />
        <DecoFan className="absolute top-[7%] left-1/2 h-[11%] w-[36%] -translate-x-1/2 opacity-80" style={{ color: c }} />
        <DecoFan className="absolute bottom-[7%] left-1/2 h-[11%] w-[36%] -translate-x-1/2 rotate-180 opacity-80" style={{ color: c }} />
      </>
    );
  }
  if (ornament === "oak-leaves") {
    return (
      <>
        <PaperGrain uid={`${uid}-g`} opacity={0.28} />
        <OakLeaf className="absolute top-[5%] left-[4%] h-[22%] w-[14%]" style={{ color: c }} />
        <OakLeaf className="absolute top-[5%] right-[4%] h-[22%] w-[14%] -scale-x-100" style={{ color: c }} />
        <OakLeaf className="absolute bottom-[4%] left-[4%] h-[22%] w-[14%] -scale-y-100" style={{ color: c }} />
        <OakLeaf className="absolute right-[4%] bottom-[4%] h-[22%] w-[14%] rotate-180" style={{ color: c }} />
        <TwineBow className="absolute top-[8%] left-1/2 h-[2.2em] w-[5em] -translate-x-1/2" style={{ color: c }} />
      </>
    );
  }
  if (ornament === "gothic-arch") {
    return (
      <>
        <PaperGrain uid={`${uid}-g`} opacity={0.1} />
        <GothicArch className="absolute top-[3%] left-1/2 h-[94%] w-[88%] -translate-x-1/2" style={{ color: c }} />
        <LilyVine className="absolute top-[18%] left-[10%] h-[46%] w-[10%] opacity-50" style={{ color: c }} />
        <LilyVine className="absolute top-[18%] right-[10%] h-[46%] w-[10%] -scale-x-100 opacity-50" style={{ color: c }} />
        <CrossFleur className="absolute top-[9%] left-1/2 h-[2.1em] w-[1.7em] -translate-x-1/2" style={{ color: c }} />
      </>
    );
  }
  if (ornament === "arabesque") {
    return (
      <>
        <PaperGrain uid={`${uid}-g`} opacity={0.16} />
        <ArabesqueBorder className="absolute top-1/2 left-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 opacity-20" style={{ color: c }} />
        <div className="absolute top-[9%] left-1/2 z-10 flex -translate-x-1/2 items-center gap-[0.5em]" style={{ color: c }}>
          <span className="rule-h" />
          <Crescent className="h-[1.1em] w-[1.1em]" />
          <span className="rule-h" />
        </div>
      </>
    );
  }
  if (ornament === "gopuram") {
    return (
      <>
        <PaperGrain uid={`${uid}-g`} opacity={0.18} />
        <KolamCorner className="absolute top-[4.8%] left-[4.8%] h-[14%] w-[14%]" style={{ color: c }} />
        <KolamCorner className="absolute top-[4.8%] right-[4.8%] h-[14%] w-[14%] rotate-90" style={{ color: c }} />
        <KolamCorner className="absolute bottom-[4.8%] left-[4.8%] h-[14%] w-[14%] -rotate-90" style={{ color: c }} />
        <KolamCorner className="absolute right-[4.8%] bottom-[4.8%] h-[14%] w-[14%] rotate-180" style={{ color: c }} />
        <Vilakku className="absolute top-[16%] left-[8%] h-[16%] w-[9%]" style={{ color: c }} />
        <Vilakku className="absolute top-[16%] right-[8%] h-[16%] w-[9%]" style={{ color: c }} />
        <Gopuram className="absolute top-[6%] left-1/2 h-[16%] w-[26%] -translate-x-1/2" style={{ color: c }} />
      </>
    );
  }
  if (ornament === "paisley") {
    return (
      <>
        <PaperGrain uid={`${uid}-g`} opacity={0.16} />
        <Paisley className="absolute top-[6%] left-[6%] h-[18%] w-[12%] opacity-80" style={{ color: c }} />
        <Paisley className="absolute top-[6%] right-[6%] h-[18%] w-[12%] -scale-x-100 opacity-80" style={{ color: c }} />
        <Paisley className="absolute bottom-[6%] left-[6%] h-[18%] w-[12%] -scale-y-100 opacity-80" style={{ color: c }} />
        <Paisley className="absolute right-[6%] bottom-[6%] h-[18%] w-[12%] rotate-180 opacity-80" style={{ color: c }} />
      </>
    );
  }
  if (ornament === "marigold") {
    return (
      <>
        <PaperGrain uid={`${uid}-g`} opacity={0.14} />
        <FloralCorner className="absolute top-[3%] left-[3%] h-[22%] w-[22%]" style={{ color: c }} />
        <FloralCorner className="absolute top-[3%] right-[3%] h-[22%] w-[22%] rotate-90" style={{ color: c }} />
        <FloralCorner className="absolute bottom-[3%] left-[3%] h-[22%] w-[22%] -rotate-90" style={{ color: c }} />
        <FloralCorner className="absolute right-[3%] bottom-[3%] h-[22%] w-[22%] rotate-180" style={{ color: c }} />
        <FloralSprig className="absolute top-[12%] left-1/2 h-[1.4em] w-[6em] -translate-x-1/2" style={{ color: c }} />
      </>
    );
  }
  return <PaperGrain uid={`${uid}-g`} opacity={0.08} />;
}
