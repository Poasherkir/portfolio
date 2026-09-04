import { ImageResponse } from "next/og";

/**
 * Browser tab icon, generated rather than shipped as a binary so it cannot
 * drift from the palette the rest of the site uses. No remote assets and no
 * web font — a tab icon that waits on a network request is a blank tab icon.
 */
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
          // The brand red reads as a deliberate edge at 32px, where a thin
          // rule or a separate dot would collapse into mush.
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
