import type { Application } from "@splinetool/runtime";

/**
 * Re-labels three keycaps in the Spline scene.
 *
 * The logos in that scene are textures baked into the binary, so the honest
 * fix would be re-authoring it in Spline. The runtime does expose setMaterial
 * with a three.js material, though, which is enough to paint over a cap's face
 * with one drawn here instead.
 *
 * Caveat worth knowing: setMaterial only accepts three.js materials on the
 * WebGPU backend and throws on classic WebGL. Every swap is therefore
 * independently guarded — a browser without WebGPU keeps the original caps
 * rather than losing the board.
 */

/** Cap in the scene -> logo to put on it. */
export const RECAPS: { target: string; icon: string; tint: string }[] = [
  { target: "laravel", icon: "flutter-plain.svg", tint: "#0b3d5c" },
  { target: "redis", icon: "dart-plain.svg", tint: "#0b3a44" },
  { target: "aws", icon: "supabase-plain.svg", tint: "#0d3b28" },
];

/** Paints a cap face: flat colour, logo centred, on a square canvas. */
async function capFace(icon: string, tint: string): Promise<HTMLCanvasElement> {
  const S = 512;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = tint;
  ctx.fillRect(0, 0, S, S);

  const res = await fetch(`/assets/devicon/${icon}`);
  let svg = await res.text();

  // Devicon files carry only a viewBox, which decodes to a zero-sized image
  // and paints nothing. Width and height are written back from it.
  const vb = svg.match(/viewBox="([\d.\s-]+)"/)?.[1]?.trim().split(/\s+/);
  if (vb?.length === 4 && !/\swidth=/.test(svg)) {
    svg = svg.replace("<svg", `<svg width="${vb[2]}" height="${vb[3]}"`);
  }
  // One flat colour, so the mark reads at cap size the way a printed legend does.
  svg = svg
    .replace(/fill="(?!none)[^"]*"/g, 'fill="#ffffff"')
    .replace("<svg", '<svg fill="#ffffff"');

  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const pad = S * 0.2;
    const box = S - pad * 2;
    const ratio = (img.naturalWidth || 1) / (img.naturalHeight || 1);
    const w = ratio >= 1 ? box : box * ratio;
    const h = ratio >= 1 ? box / ratio : box;
    ctx.imageSmoothingQuality = "high";
    // Drawn before the URL is revoked: Chrome rasterises SVGs lazily, so a
    // revoked blob leaves a decoded but unpaintable image.
    ctx.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
  } finally {
    URL.revokeObjectURL(url);
  }
  return canvas;
}

/** Swaps the caps. Resolves to how many actually took. */
export async function recapScene(app: Application): Promise<number> {
  let done = 0;

  for (const { target, icon, tint } of RECAPS) {
    const obj = app.findObjectByName(target);
    if (!obj) continue;

    try {
      const canvas = await capFace(icon, tint);
      await app.setMaterial(obj, (three) => {
        const tex = new three.CanvasTexture(canvas);
        tex.colorSpace = three.SRGBColorSpace;
        tex.anisotropy = 8;
        return new three.MeshStandardMaterial({
          map: tex,
          roughness: 0.55,
          metalness: 0.05,
        });
      });
      done++;
    } catch {
      // WebGL backend, or the object refuses a material — leave that cap as it
      // was. A missing swap is a wrong logo; a thrown error is no keyboard.
    }
  }

  return done;
}
