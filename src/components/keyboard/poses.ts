/**
 * Keyframes for the board, one per section. The scene lerps between whichever
 * two the scroll position falls between.
 *
 * rotation.x must be positive — the board is modelled flat with caps at +Y and
 * the camera at +Z, so a negative angle shows the underside. 1.571 is face-on.
 */
export type Section =
  | "hero"
  | "flagship"
  | "projects"
  | "skills"
  | "capabilities"
  | "services"
  | "contact";

/** Document order. Anchors are re-sorted from the real DOM at runtime. */
export const SECTION_IDS: Section[] = [
  "hero",
  "flagship",
  "projects",
  "skills",
  "capabilities",
  "services",
  "contact",
];

export type Pose = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

type PoseSet = { desktop: Pose; mobile: Pose };

export const POSES: Record<Section, PoseSet> = {
  // Low and right, clear of the hero copy.
  hero: {
    desktop: { position: [3.94, -0.13, -1.8], rotation: [1.0, -0.5, -0.18], scale: 0.853 },
    mobile: { position: [0, -1.64, -3.8], rotation: [1.05, -0.25, -0.06], scale: 0.529 },
  },


  // Centred and tipped toward the viewer. Every cap must stay hoverable here.
  skills: {
    desktop: { position: [0, -0.95, -0.1], rotation: [1.16, 0, 0], scale: 0.751 },
    // Pulled back rather than scaled down — the frustum widens with distance.
    mobile: { position: [0, -1.25, -4.6], rotation: [1.2, 0, 0], scale: 0.605 },
  },



  // Deep background — the flagship case study owns this section.
  flagship: {
    desktop: { position: [4.77, -0.69, -3.6], rotation: [1.02, -0.44, -0.2], scale: 0.932 },
    mobile: { position: [0, -1.91, -4.6], rotation: [1.06, -0.28, -0.1], scale: 0.504 },
  },

  // Receding: swung left and back so the project cards own the frame.
  projects: {
    desktop: { position: [-4.39, 0.5, -2.6], rotation: [0.86, 0.62, 0.3], scale: 0.858 },
    mobile: { position: [0, 1.72, -3.8], rotation: [0.9, 0.4, 0.18], scale: 0.474 },
  },

  // Behind the capability grid: low and right, out from under the cards.
  capabilities: {
    desktop: { position: [4.39, -0.41, -2.2], rotation: [1.12, -0.42, -0.2], scale: 0.796 },
    mobile: { position: [0, -1.67, -3.4], rotation: [1.14, -0.28, -0.12], scale: 0.446 },
  },

  // Low and left, out from under the service cards.
  services: {
    desktop: { position: [-4.13, -0.53, -1.9], rotation: [1.2, 0.45, 0.22], scale: 0.806 },
    mobile: { position: [0, -1.64, -3.2], rotation: [1.2, 0.3, 0.12], scale: 0.452 },
  },


  // Teardown: pitched almost face-on while the caps drift off the board.
  contact: {
    desktop: { position: [3.17, -0.06, -1.2], rotation: [1.44, 0.18, 0.4], scale: 0.798 },
    mobile: { position: [0, -1.21, -2.6], rotation: [1.4, 0.14, 0.28], scale: 0.442 },
  },
};

/**
 * Canvas opacity per section. Keyed to sections rather than to a fraction of
 * total scroll, which goes out of tune whenever a section is added.
 */
export const OPACITY: Record<Section, number> = {
  hero: 1,
  flagship: 0.3,
  projects: 0.3,
  services: 0.3,
  skills: 1,
  capabilities: 0.3,
  contact: 0.3,
};

/**
 * How far the caps drift off the board, per section. Builds toward a full
 * teardown at the bottom; the stack section dips so the board still reads as a
 * keyboard while you are hovering keys on it.
 */
export const FLOAT_AMOUNT: Record<Section, number> = {
  hero: 0.35,
  flagship: 0.5,
  projects: 0.62,
  services: 0.68,
  skills: 0.22,
  capabilities: 0.55,
  contact: 1,
};

/**
 * How much of the viewport the board should cover, per section.
 *
 * The camera's field of view is vertical, so a fixed world-space scale makes
 * the board shrink on short windows and balloon on tall ones — measured, it
 * ranged from 27% of the screen on a wide monitor to 94% on a tablet held
 * upright. These are solved against the live viewport every frame instead, so
 * the board is the same size everywhere.
 *
 * `w` is the share of viewport width; `h` caps the share of height, which is
 * what stops a tall narrow window turning the board into a wall.
 */
const COVER: Record<Section, { w: number; h: number }> = {
  hero: { w: 0.4, h: 0.85 },
  flagship: { w: 0.37, h: 0.8 },
  projects: { w: 0.37, h: 0.8 },
  skills: { w: 0.44, h: 0.86 },
  capabilities: { w: 0.36, h: 0.78 },
  services: { w: 0.37, h: 0.8 },
  contact: { w: 0.4, h: 0.82 },
};

/** Mobile is portrait and the copy stacks above, so it takes more width and far less height. */
const COVER_MOBILE: Record<Section, { w: number; h: number }> = {
  hero: { w: 0.78, h: 0.36 },
  flagship: { w: 0.7, h: 0.32 },
  projects: { w: 0.7, h: 0.32 },
  skills: { w: 0.86, h: 0.4 },
  capabilities: { w: 0.68, h: 0.3 },
  services: { w: 0.7, h: 0.32 },
  contact: { w: 0.72, h: 0.34 },
};

/** Board footprint in world units, from the 6x5 grid in keyboard.tsx. */
const BOARD_W = 5.2;
const BOARD_H = 4.3;
/** Must match the Canvas camera. */
const FOV = 34;
const CAM_Z = 9;

/**
 * Scale that puts the board at its target share of the viewport, at the depth
 * this pose sits at. Whichever axis binds first wins.
 */
function coverScale(section: Section, z: number, aspect: number, isMobile: boolean) {
  const t = (isMobile ? COVER_MOBILE : COVER)[section];
  // A hidden or zero-height canvas reports 0x0, which makes aspect 0 or
  // Infinity and would size the board to nothing or to nonsense.
  const a = Number.isFinite(aspect) && aspect > 0.05 ? Math.min(aspect, 6) : 1.6;
  const halfH = Math.tan(((FOV * Math.PI) / 180) / 2) * (CAM_Z - z);
  const halfW = halfH * a;
  return Math.min((t.w * 2 * halfW) / BOARD_W, (t.h * 2 * halfH) / BOARD_H);
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Smoothstep — eases each segment in and out. */
export const smooth = (t: number) => t * t * (3 - 2 * t);

export function lerpPose(a: Pose, b: Pose, t: number): Pose {
  return {
    position: [
      lerp(a.position[0], b.position[0], t),
      lerp(a.position[1], b.position[1], t),
      lerp(a.position[2], b.position[2], t),
    ],
    rotation: [
      lerp(a.rotation[0], b.rotation[0], t),
      lerp(a.rotation[1], b.rotation[1], t),
      lerp(a.rotation[2], b.rotation[2], t),
    ],
    scale: lerp(a.scale, b.scale, t),
  };
}

export type Anchor = { section: Section; at: number };

/**
 * Where each section crosses the trigger line, in document coordinates.
 * Sorted by measurement, not by SECTION_IDS — the DOM order can differ.
 */
export function measureAnchors(): Anchor[] {
  const line = window.innerHeight * 0.45;
  const found: Anchor[] = [];

  for (const section of SECTION_IDS) {
    // A section can nominate its own trigger element via data-kbd-anchor.
    const el =
      document.querySelector<HTMLElement>(`[data-kbd-anchor="${section}"]`) ??
      document.getElementById(section);
    if (!el) continue;
    const top = el.getBoundingClientRect().top + window.scrollY;
    found.push({ section, at: Math.max(0, top - line) });
  }

  return found.sort((a, b) => a.at - b.at);
}

/** The interpolated pose for a given scroll offset. */
export function poseAt(
  anchors: Anchor[],
  scrollY: number,
  isMobile: boolean,
  aspect: number
): Pose {
  const key = isMobile ? "mobile" : "desktop";
  // The pose's own scale is ignored — size comes from the viewport.
  const sizedFor = (section: Section) => (pose: Pose): Pose => ({
    ...pose,
    scale: coverScale(section, pose.position[2], aspect, isMobile),
  });
  if (anchors.length === 0) return sizedFor("hero")(POSES.hero[key]);
  if (anchors.length === 1) return sizedFor(anchors[0].section)(POSES[anchors[0].section][key]);

  if (scrollY <= anchors[0].at) return sizedFor(anchors[0].section)(POSES[anchors[0].section][key]);

  const last = anchors[anchors.length - 1];
  if (scrollY >= last.at) return sizedFor(last.section)(POSES[last.section][key]);

  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (scrollY >= a.at && scrollY < b.at) {
      const span = b.at - a.at;
      const t = span <= 0 ? 0 : (scrollY - a.at) / span;
      // Scale is interpolated between the two sections' own solved sizes, so
      // the transition stays smooth instead of stepping at the boundary.
      const blended = lerpPose(POSES[a.section][key], POSES[b.section][key], smooth(t));
      const sa = coverScale(a.section, blended.position[2], aspect, isMobile);
      const sb = coverScale(b.section, blended.position[2], aspect, isMobile);
      return { ...blended, scale: lerp(sa, sb, smooth(t)) };
    }
  }

  return sizedFor(last.section)(POSES[last.section][key]);
}

/** Samples a per-section table at a scroll offset, easing between neighbours. */
function sampleAt(anchors: Anchor[], scrollY: number, table: Record<Section, number>): number {
  if (anchors.length === 0) return table.hero;
  if (anchors.length === 1) return table[anchors[0].section];
  if (scrollY <= anchors[0].at) return table[anchors[0].section];

  const last = anchors[anchors.length - 1];
  if (scrollY >= last.at) return table[last.section];

  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (scrollY >= a.at && scrollY < b.at) {
      const span = b.at - a.at;
      const t = span <= 0 ? 0 : (scrollY - a.at) / span;
      return lerp(table[a.section], table[b.section], smooth(t));
    }
  }

  return table[last.section];
}

export const opacityAt = (anchors: Anchor[], scrollY: number) =>
  sampleAt(anchors, scrollY, OPACITY);

export const floatAmountAt = (anchors: Anchor[], scrollY: number) =>
  sampleAt(anchors, scrollY, FLOAT_AMOUNT);

/** Which section currently owns the frame — used for the teardown trigger. */
export function sectionAt(anchors: Anchor[], scrollY: number): Section {
  let current: Section = anchors[0]?.section ?? "hero";
  for (const a of anchors) {
    if (scrollY >= a.at) current = a.section;
  }
  return current;
}
