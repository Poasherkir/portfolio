import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { caseStudies, getProject, profile } from "@/data/portfolio";
import type { Project } from "@/types";

export const alt = `A case study by ${profile.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Build time only: the screenshots are read from public/, which serverless functions do not bundle.
export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug }));
}

const STATUS: Record<Project["status"], string> = {
  production: "Production",
  active: "In development",
  archived: "Archived",
};

const BRAND = "#e63946";
const MUTED = "#9a9a9a";

/** The bundled OG font has no Arabic glyphs, so bilingual titles keep their Latin half. */
function latinTitle(title: string) {
  if (!/[؀-ۿ]/.test(title)) return title;
  return title.split("—").pop()?.trim() ?? title;
}

/** Satori cannot decode WebP; screenshots are converted to PNG data URLs. */
async function pngDataUrl(src: string, width: number) {
  const file = await readFile(path.join(process.cwd(), "public", src));
  const png = await sharp(file).resize({ width }).png().toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

async function visualFor(project: Project) {
  const cover = project.images[0];
  if (cover) {
    return { kind: "desktop" as const, urls: [await pngDataUrl(cover.src, 1240)] };
  }
  const screens = project.screens?.slice(0, 2) ?? [];
  if (screens.length > 0) {
    return {
      kind: "phone" as const,
      urls: await Promise.all(screens.map((s) => pngDataUrl(s.src, 440))),
    };
  }
  return null;
}

/** Per-project Open Graph image: title, summary, numbers and the project's own screenshots. */
export default async function CaseStudyImage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) return new Response("Not found", { status: 404 });

  const visual = await visualFor(project);
  const title = latinTitle(project.title);
  const metrics = (project.metrics ?? []).slice(0, visual ? 2 : 3);
  const textWidth = visual ? 560 : 1072;
  const host = new URL(profile.site).host;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0c0c0c",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(230,57,70,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(230,57,70,0.05) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {visual?.kind === "desktop" && (
          <div
            style={{
              position: "absolute",
              top: 128,
              left: 656,
              width: 620,
              height: 388,
              display: "flex",
              borderRadius: 14,
              border: "1px solid rgba(242,242,242,0.16)",
              overflow: "hidden",
              boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={visual.urls[0]} width={620} height={388} alt="" />
          </div>
        )}

        {visual?.kind === "phone" &&
          visual.urls.map((url, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: i === 0 ? 92 : 152,
                left: i === 0 ? 700 : 930,
                width: 220,
                height: 463,
                display: "flex",
                borderRadius: 30,
                border: "6px solid #1d1d1d",
                overflow: "hidden",
                boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} width={208} height={451} alt="" style={{ objectFit: "cover" }} />
            </div>
          ))}

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: 64,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{ width: 12, height: 12, borderRadius: 6, background: BRAND, display: "flex" }}
            />
            <span style={{ color: MUTED, fontSize: 20, letterSpacing: 5, textTransform: "uppercase" }}>
              Case study · {project.year} · {STATUS[project.status]}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", width: textWidth }}>
            <span
              style={{
                color: "#f2f2f2",
                fontSize: title.length > 16 ? 60 : 76,
                fontWeight: 700,
                lineHeight: 1.05,
              }}
            >
              {title}
            </span>
            <span style={{ color: MUTED, fontSize: 28, lineHeight: 1.35, marginTop: 22 }}>
              {project.tagline}
            </span>

            {metrics.length > 0 && (
              <div style={{ display: "flex", gap: 40, marginTop: 34 }}>
                {metrics.map((m) => (
                  <div key={m.label} style={{ display: "flex", flexDirection: "column", maxWidth: visual ? 260 : 340 }}>
                    <span style={{ color: BRAND, fontSize: 30, fontWeight: 700 }}>{m.value}</span>
                    <span
                      style={{
                        color: MUTED,
                        fontSize: 16,
                        letterSpacing: 3,
                        textTransform: "uppercase",
                        marginTop: 6,
                      }}
                    >
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: textWidth,
              borderTop: "1px solid rgba(230,237,245,0.14)",
              paddingTop: 22,
              color: MUTED,
              fontSize: 20,
            }}
          >
            <span>{profile.name}</span>
            <span>{host}</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
