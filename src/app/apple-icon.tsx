import { ImageResponse } from "next/og";

/** iOS home-screen icon. Square, since iOS rounds the corners itself. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#ffffff",
          fontSize: 104,
          fontWeight: 700,
          fontFamily: "sans-serif",
          letterSpacing: -4,
        }}
      >
        <div style={{ display: "flex", marginTop: 8 }}>M</div>
        <div
          style={{
            display: "flex",
            width: 64,
            height: 8,
            marginTop: 6,
            borderRadius: 4,
            background: "#e63946",
          }}
        />
      </div>
    ),
    size
  );
}
