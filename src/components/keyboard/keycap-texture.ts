import * as THREE from "three";
import type { Keycap } from "@/data/portfolio";

/**
 * Paints a keycap's top face: cap colour, with the technology's Devicon logo
 * over it. Devicon is MIT licensed and vendored into /public/assets/devicon,
 * so nothing is fetched from a CDN at runtime.
 */
/**
 * Cap colour and ink are picked together so the logo always contrasts with the
 * plastic under it. Brands with a real hue keep it; black/white/grey brands get
 * a charcoal cap instead, since their own colour gives nothing to work with.
 */
export function capAndInk(hex: string): { cap: string; ink: string } {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);

  if (hsl.s < 0.18) return { cap: "#2b3039", ink: "#ffffff" };

  const lightness = Math.min(Math.max(hsl.l, 0.34), 0.56);
  const cap = new THREE.Color().setHSL(hsl.h, Math.max(hsl.s, 0.62), lightness);

  // Perceived brightness of the cap decides whether white or black reads.
  const lum = 0.299 * cap.r + 0.587 * cap.g + 0.114 * cap.b;
  return { cap: `#${cap.getHexString()}`, ink: lum > 0.55 ? "#15191f" : "#ffffff" };
}

/** Strips every colour out of an SVG so it renders as one flat silhouette. */
function monochrome(svg: string, ink: string) {
  return svg
    // Drop fills, but keep fill="none" — that is how stroke-only shapes work.
    .replace(/\sfill="(?!none)[^"]*"/gi, "")
    .replace(/\sstroke="(?!none)[^"]*"/gi, "")
    // Inline styles can set fill/stroke too.
    .replace(/\sstyle="[^"]*"/gi, "")
    // <style> blocks with CSS classes are common in Devicon files.
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\sclass="[^"]*"/gi, "")
    // Inherited from the root, so everything without an explicit fill picks it up.
    .replace(/<svg/, `<svg fill="${ink}"`);
}

const cache = new Map<string, THREE.CanvasTexture>();

/**
 * Fetches an SVG and draws it. Two silent-failure traps:
 *  1. Devicon files declare only a viewBox, so they decode to a zero-sized
 *     image and paint nothing. Width/height are written back from the viewBox.
 *  2. The blob URL must outlive the draw — Chrome rasterises SVGs lazily, so
 *     revoking on decode() leaves a decoded but unpaintable image.
 */
async function drawSvg(
  url: string,
  ink: string,
  paint: (img: HTMLImageElement) => void
) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  let svg = await res.text();

  svg = monochrome(svg, ink);

  const hasSize = /<svg[^>]*\swidth=/.test(svg) && /<svg[^>]*\sheight=/.test(svg);
  if (!hasSize) {
    const box = svg.match(/viewBox="\s*([-\d.]+)\s+([-\d.]+)\s+([\d.]+)\s+([\d.]+)/);
    const w = box ? Number(box[3]) : 128;
    const h = box ? Number(box[4]) : 128;
    svg = svg.replace(/<svg/, `<svg width="${w}" height="${h}"`);
  }

  const blobUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    img.src = blobUrl;
    await img.decode();
    paint(img); // must happen while blobUrl is still live
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

export function keycapTexture(cap: Keycap, tint: string, ink: string) {
  const hit = cache.get(cap.id);
  if (hit) return hit;

  const S = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.colorSpace = THREE.SRGBColorSpace;
  cache.set(cap.id, texture);

  // Opaque cap colour first, so the legend never needs an alpha channel.
  const base = () => {
    ctx.fillStyle = tint;
    ctx.fillRect(0, 0, S, S);
  };

  base();
  texture.needsUpdate = true;

  drawSvg(`/assets/devicon/${cap.icon}`, ink, (img) => {
    base();

    // Several Devicon files are wordmarks, so keep the aspect ratio.
    const pad = S * 0.13;
    const boxSize = S - pad * 2;
    const ratio = (img.naturalWidth || 1) / (img.naturalHeight || 1);
    const w = ratio >= 1 ? boxSize : boxSize * ratio;
    const h = ratio >= 1 ? boxSize / ratio : boxSize;

    // No shadow blur — a halo behind the mark reads as fuzzy, not printed.
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);

    texture.needsUpdate = true;
  }).catch(() => {
    // Initials rather than a blank cap if an SVG ever goes missing.
    base();
    ctx.font = `700 ${S * 0.3}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = ink;
    ctx.fillText(cap.label.slice(0, 3).toUpperCase(), S / 2, S / 2);
    texture.needsUpdate = true;
  });

  return texture;
}
