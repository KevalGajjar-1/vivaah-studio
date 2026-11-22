import { ImageResponse } from "next/og";

export const alt = "Vivaah — Wedding Invitation Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          background: "#1c0b0f",
          color: "#f7f1e8",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: 'flex', fontSize: 22, letterSpacing: 10, textTransform: "uppercase", color: "#d4b56a" }}>
          Invitation atelier
        </div>
        <div style={{ display: 'flex', fontSize: 84, marginTop: 24, lineHeight: 1 }}>Vivaah</div>
        <div style={{ display: 'flex', fontSize: 32, marginTop: 24, maxWidth: 800, color: "#e8dccb" }}>
          Beautiful wedding invitations, composed with care.
        </div>
      </div>
    ),
    { ...size },
  );
}
