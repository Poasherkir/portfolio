import { ImageResponse } from "next/og";

/** Generated favicon. */
export const size = { width: 32, height: 32 };
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
          background: "#0a0a0a",
          color: "#ffffff",
          fontSize: 21,
          fontWeight: 700,
          fontFamily: "sans-serif",
          borderBottom: "4px solid #e63946",
          letterSpacing: -1,
        }}
      >
        M
      </div>
    ),
    size
  );
}
