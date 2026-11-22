import type { ReactNode } from "react";
import type { InviteData } from "@/lib/types";
import { ArtDecoCard } from "./ArtDeco";
import { BohoWatercolorCard } from "./BohoWatercolor";
import { ChurchElegantCard } from "./ChurchElegant";
import { ClassicFloralCard } from "./ClassicFloral";
import { MinimalistModernCard } from "./MinimalistModern";
import { NikahElegantCard } from "./NikahElegant";
import { RoyalMandalaCard } from "./RoyalMandala";
import { RusticCard } from "./Rustic";
import { SouthIndianTempleCard } from "./SouthIndianTemple";

export type CardVariant = "thumb" | "preview" | "full" | "export";

export function InvitationCard({
  data,
  variant = "preview",
  className = "",
  cardId,
}: {
  data: InviteData;
  variant?: CardVariant;
  className?: string;
  cardId?: string;
}) {
  const props = { data, variant, cardId: cardId || data.template };
  const slug = data.template || "classic-floral";
  const map: Record<string, ReactNode> = {
    "classic-floral": <ClassicFloralCard {...props} />,
    "royal-mandala": <RoyalMandalaCard {...props} />,
    "minimalist-modern": <MinimalistModernCard {...props} />,
    "boho-watercolor": <BohoWatercolorCard {...props} />,
    "art-deco": <ArtDecoCard {...props} />,
    rustic: <RusticCard {...props} />,
    "church-elegant": <ChurchElegantCard {...props} />,
    "nikah-elegant": <NikahElegantCard {...props} />,
    "south-indian-temple": <SouthIndianTempleCard {...props} />,
  };

  return (
    <article
      data-invite-card
      data-lang={data.language || "en"}
      className={`invite-card relative aspect-[5/7] w-full overflow-hidden shadow-[0_20px_50px_-24px_rgba(40,16,8,0.45)] ${className}`}
    >
      {map[slug] ?? <ClassicFloralCard {...props} />}
    </article>
  );
}

export function CardNames({
  a,
  b,
  scriptClass,
  andClass,
  stacked = true,
}: {
  a: string;
  b: string;
  scriptClass: string;
  andClass?: string;
  stacked?: boolean;
}) {
  const left = a.trim() || "Your Name";
  const right = b.trim() || "Their Name";
  if (!stacked) {
    return (
      <h1 className={scriptClass}>
        {left} <span className={andClass || "amp"}>and</span> {right}
      </h1>
    );
  }
  return (
    <h1 className={scriptClass}>
      <span className="block">{left}</span>
      <span className={andClass || "amp"}>&</span>
      <span className="block">{right}</span>
    </h1>
  );
}
