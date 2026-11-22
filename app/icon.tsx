import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#6b1d2a",
          color: "#f7f1e8",
          fontSize: 40,
          fontFamily: "Georgia, serif",
        }}
      >
        V
      </div>
    ),
    { ...size },
  );
}
