import { ImageResponse } from "next/og";
import { profile, hero } from "@/data/portfolio";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated at build time, so there is never a missing-OG-image 404 while the
 * hand-designed one is still pending. Uses no remote assets or web fonts —
 * everything here is solid colour and system type.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c0c0c",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Instrument grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(230,57,70,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(230,57,70,0.06) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            display: "flex",
          }}
        />
        {/* Brand glow */}
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -160,
            width: 640,
            height: 640,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(230,57,70,0.28) 0%, rgba(10,10,10,0) 65%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#e63946",
              display: "flex",
            }}
          />
          <span
            style={{
              color: "#9a9a9a",
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            {profile.handle}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "#f2f2f2", fontSize: 88, fontWeight: 700, lineHeight: 1.05 }}>
            {profile.name}
          </span>
          <span style={{ color: "#e63946", fontSize: 44, fontWeight: 600, marginTop: 8 }}>
            {profile.role}
          </span>
          <span
            style={{
              color: "#9a9a9a",
              fontSize: 30,
              marginTop: 28,
              maxWidth: 940,
              lineHeight: 1.35,
            }}
          >
            {hero.subhead}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(230,237,245,0.14)",
            paddingTop: 28,
            color: "#9a9a9a",
            fontSize: 24,
          }}
        >
          <span>Flutter · React · Supabase · Python</span>
          <span>
            {profile.location} · {profile.timezone}
          </span>
        </div>
      </div>
    ),
    size
  );
}
