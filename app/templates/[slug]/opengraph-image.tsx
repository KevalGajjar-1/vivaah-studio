import { ImageResponse } from "next/og";
import { getTemplate, templates } from "@/lib/templates";

export const alt = "Vivaah invitation template";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export default async function TemplateOg({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = getTemplate(slug);
  const sample = template.preview;
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
          padding: 80,
          background: bg,
          color: fg,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: 'flex', fontSize: 20, letterSpacing: 8, textTransform: "uppercase", color: accent }}>
          VIVAAH · {template.name}
        </div>
        <div style={{ display: 'flex', fontSize: 72, marginTop: 28 }}>{sample.partnerA}</div>
        <div style={{ display: 'flex', fontSize: 30, color: accent, margin: "8px 0" }}>&</div>
        <div style={{ display: 'flex', fontSize: 72 }}>{sample.partnerB}</div>
        <div style={{ marginTop: 28, fontSize: 26, opacity: 0.85 }}>{template.tagline}</div>
      </div>
    ),
    { ...size },
  );
}
