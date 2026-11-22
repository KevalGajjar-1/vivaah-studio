import { ImageResponse } from "next/og";
import { decodeInvite } from "@/lib/codec";
import { getTemplate, sampleInvite } from "@/lib/templates";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const demo = searchParams.get("demo");
  const data = decodeInvite(searchParams.get("d")) || (demo ? sampleInvite(demo) : null);
  const template = getTemplate(data?.template || searchParams.get("template"));
  const partnerA = data?.partnerA || "Your Name";
  const partnerB = data?.partnerB || "Their Name";
  const dark = ["royal-mandala", "art-deco", "nikah-elegant", "south-indian-temple"].includes(
    template.slug,
  );
  const bg = dark ? template.palette[0] : "#f7f1e8";
  const fg = dark ? "#f5e6b8" : "#1a1410";
  const accent = dark ? "#e8c872" : "#6b1d2a";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: bg,
          color: fg,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: 'flex', fontSize: 22, letterSpacing: 8, textTransform: "uppercase", color: accent }}>
          VIVAAH
        </div>
        <div style={{ display: 'flex', fontSize: 28, marginTop: 24, letterSpacing: 4, textTransform: "uppercase" }}>
          {template.name}
        </div>
        <div style={{ display: 'flex', fontSize: 72, marginTop: 20, lineHeight: 1.1 }}>
          {partnerA}
        </div>
        <div style={{ display: 'flex', fontSize: 32, color: accent, margin: "8px 0" }}>&</div>
        <div style={{ display: 'flex', fontSize: 72, lineHeight: 1.1 }}>{partnerB}</div>
        <div style={{ marginTop: 36, fontSize: 24, opacity: 0.85 }}>
          {data?.venue || template.tagline}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
