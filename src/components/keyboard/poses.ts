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
    desktop: { position: [1.8, -1.12, -1.8], rotation: [1.0, -0.5, -0.18], scale: 2.337 },
    mobile: { position: [0, -1.17, -3.8], rotation: [1.05, -0.25, -0.06], scale: 0.9 },
  },


  // Centred and tipped toward the viewer. Every cap must stay hoverable here.
  skills: {
    desktop: { position: [0, -0.17, -0.1], rotation: [1.16, 0, 0], scale: 1.541 },
    // Pulled back rather than scaled down — the frustum widens with distance.
    mobile: { position: [0, 0.42, -4.6], rotation: [1.2, 0, 0], scale: 0.691 },
  },



  // Deep background — the flagship case study owns this section.
  flagship: {
    desktop: { position: [1.6, -1, -3.6], rotation: [1.02, -0.44, -0.2], scale: 2.845 },
    mobile: { position: [0, -1.08, -4.6], rotation: [1.06, -0.28, -0.1], scale: 0.993 },
  },

  // Receding: swung left and back so the project cards own the frame.
  projects: {
    desktop: { position: [-1.48, 0.7, -2.6], rotation: [0.86, 0.62, 0.3], scale: 2.619 },
    mobile: { position: [0, 1.02, -3.8], rotation: [0.9, 0.4, 0.18], scale: 0.935 },
  },

  // Behind the capability grid: low and right, out from under the cards.
  capabilities: {
    desktop: { position: [1.9, -1.1, -2.2], rotation: [1.12, -0.42, -0.2], scale: 2.5 },
    mobile: { position: [0, -2.3, -3.4], rotation: [1.14, -0.28, -0.12], scale: 0.9 },
  },

  // Low and left, out from under the service cards.
  services: {
    desktop: { position: [-1.39, -0.87, -1.9], rotation: [1.2, 0.45, 0.22], scale: 2.461 },
    mobile: { position: [0, -0.97, -3.2], rotation: [1.2, 0.3, 0.12], scale: 0.891 },
  },


  // Teardown: pitched almost face-on while the caps drift off the board.
  contact: {
    desktop: { position: [1.1, -0.2, -1.2], rotation: [1.44, 0.18, 0.4], scale: 2.207 },
    mobile: { position: [0, -0.78, -2.6], rotation: [1.4, 0.14, 0.28], scale: 0.816 },
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
 * Global size multiplier. Apparent size is scale / (cameraZ - poseZ), so this
 * is equivalent to moving every pose closer without retuning each one.
 * Mobile gets less — the frustum is far narrower and crops sooner.
 */
const BOARD_SCALE = { desktop: 1, mobile: 1 };

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
export function poseAt(anchors: Anchor[], scrollY: number, isMobile: boolean): Pose {
  const key = isMobile ? "mobile" : "desktop";
  const sized = (pose: Pose): Pose => ({
    ...pose,
    scale: pose.scale * BOARD_SCALE[key],
  });
  if (anchors.length === 0) return sized(POSES.hero[key]);
  if (anchors.length === 1) return sized(POSES[anchors[0].section][key]);

  if (scrollY <= anchors[0].at) return sized(POSES[anchors[0].section][key]);

  const last = anchors[anchors.length - 1];
  if (scrollY >= last.at) return sized(POSES[last.section][key]);

  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (scrollY >= a.at && scrollY < b.at) {
      const span = b.at - a.at;
      const t = span <= 0 ? 0 : (scrollY - a.at) / span;
      return sized(lerpPose(POSES[a.section][key], POSES[b.section][key], smooth(t)));
    }
  }

  return sized(POSES[last.section][key]);
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
