/**
 * Where the keyboard sits for each section of the page.
 *
 * On rotation.x: the board is modelled lying flat, caps pointing at +Y, and the
 * camera sits on +Z looking at the origin. Rotating about X by θ swings the cap
 * face to (0, cos θ, sin θ) — so θ must be POSITIVE to tip the caps toward the
 * viewer. Negative values turn the board over and show its underside.
 * π/2 (1.571) is dead-on face-to-camera.
 *
 * These are keyframes, not states: the scene interpolates continuously between
 * whichever two the scroll position currently falls between, so the board is
 * always in motion rather than snapping when a threshold trips.
 */
export type Section =
  | "hero"
  | "flagship"
  | "projects"
  | "services"
  | "process"
  | "skills"
  | "about"
  | "experience"
  | "engineering"
  | "contact";

/** Document order. Anchors are re-sorted from the real DOM at runtime. */
export const SECTION_IDS: Section[] = [
  "hero",
  "flagship",
  "projects",
  "services",
  "process",
  "skills",
  "about",
  "experience",
  "engineering",
  "contact",
];

export type Pose = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

type PoseSet = { desktop: Pose; mobile: Pose };

export const POSES: Record<Section, PoseSet> = {
  // Scenery: low and far right, raked away, clear of the hero copy.
  hero: {
    desktop: { position: [4.1, -2.0, -1.8], rotation: [1.0, -0.5, -0.18], scale: 0.92 },
    mobile: { position: [0, -4.5, -3.8], rotation: [1.05, -0.25, -0.06], scale: 0.62 },
  },

  // The run-up. Swinging back across to centre and starting to tip face-on, so
  // arriving at the stack section reads as a landing rather than a cut.
  process: {
    desktop: { position: [2.8, 1.2, -2.6], rotation: [1.1, -0.4, -0.2], scale: 0.86 },
    mobile: { position: [0, 2.6, -3.4], rotation: [1.12, -0.26, -0.1], scale: 0.58 },
  },

  // The subject: centred, tipped toward the viewer, caps readable and live.
  skills: {
    desktop: { position: [0, -0.1, -0.1], rotation: [1.16, 0, 0], scale: 1.0 },
    // Depth, not scale, is the lever on a narrow viewport: the board is a fixed
    // 4.3 units across, so at z=-0.4 it is already wider than the frustum and
    // crops off both edges. Pulling it back widens the frustum around it.
    mobile: { position: [0, 0.9, -4.6], rotation: [1.2, 0, 0], scale: 0.52 },
  },

  // Leaving the stage to the left and turning away — the long sweep back across
  // to the timeline gives the next two sections continuous motion.
  about: {
    // Right-hand side: the About copy is capped at 3xl and left-aligned, so the
    // right third of a wide viewport is the only empty ground on this section.
    desktop: { position: [3.7, -0.6, -2.4], rotation: [1.08, -0.5, -0.24], scale: 0.84 },
    mobile: { position: [0, -2.6, -3.2], rotation: [1.12, 0.32, 0.14], scale: 0.56 },
  },

  // Drifting right and turning, while the timeline reads on the left.
  experience: {
    desktop: { position: [3.2, 0.3, -2.2], rotation: [1.05, -0.62, -0.3], scale: 0.86 },
    mobile: { position: [0, 2.8, -3.4], rotation: [1.1, -0.35, -0.15], scale: 0.6 },
  },

  // Deep background, small and low. The flagship case study is the credibility
  // moment on this page; the board must not compete with it.
  flagship: {
    desktop: { position: [2.9, -2.3, -3.6], rotation: [1.02, -0.44, -0.2], scale: 0.8 },
    mobile: { position: [0, -3.8, -4.6], rotation: [1.06, -0.28, -0.1], scale: 0.5 },
  },

  // Receding: swung left and back so the project cards own the frame.
  projects: {
    desktop: { position: [-3.5, 0.7, -2.6], rotation: [0.86, 0.62, 0.3], scale: 0.96 },
    mobile: { position: [0, 3.0, -3.8], rotation: [0.9, 0.4, 0.18], scale: 0.58 },
  },

  // Low and left, out from under the service cards.
  services: {
    desktop: { position: [-3.2, -1.6, -1.9], rotation: [1.2, 0.45, 0.22], scale: 0.98 },
    mobile: { position: [0, -2.8, -3.2], rotation: [1.2, 0.3, 0.12], scale: 0.6 },
  },

  // High and far back, raked over. Reads as the board settling before the
  // teardown starts on the contact section.
  engineering: {
    desktop: { position: [-3.0, 1.4, -3.0], rotation: [0.94, 0.5, 0.24], scale: 0.9 },
    mobile: { position: [0, 2.8, -4.0], rotation: [1.0, 0.3, 0.12], scale: 0.54 },
  },

  // Teardown: pitched almost face-on while the caps drift off the board.
  contact: {
    desktop: { position: [2.2, -0.2, -1.2], rotation: [1.44, 0.18, 0.4], scale: 0.98 },
    mobile: { position: [0, -1.4, -2.6], rotation: [1.4, 0.14, 0.28], scale: 0.68 },
  },
};

/**
 * How present the board is over each section.
 *
 * Keyed to sections rather than to a fraction of total scroll: the page length
 * changes every time a section is added, and a hard-coded 0.55 stop silently
 * lands somewhere else the moment it does.
 *
 * The board stays genuinely present the whole way down rather than dropping to
 * near-invisible over text. Legibility is bought back where it is actually
 * lost — the surfaces copy sits on are opaque enough to hold their own — not
 * by dimming the thing the page is remembered for.
 */
export const OPACITY: Record<Section, number> = {
  hero: 1,
  flagship: 0.58,
  projects: 0.62,
  services: 0.62,
  process: 0.74,
  skills: 1,
  about: 0.66,
  experience: 0.78,
  engineering: 0.62,
  contact: 0.52,
};

/**
 * How adrift the caps are, per section.
 *
 * This used to be a ceiling multiplied by a ramp keyed to overall page
 * progress, which meant the caps sat dead flat at the top of the page and only
 * came alive past the halfway mark. Driving it straight from the section table
 * — the same way opacity is — says the thing directly instead of deriving it
 * from a proxy, and lets the board be airborne from the first screen.
 *
 * The shape still builds toward a full teardown at the bottom. The stack
 * section is the one deliberate dip: the caps pull back into formation there
 * because that is where you hover a key to read what it is, and a scattered
 * cloud is both harder to aim at and no longer recognisably a keyboard.
 */
export const FLOAT_AMOUNT: Record<Section, number> = {
  hero: 0.35,
  flagship: 0.5,
  projects: 0.62,
  services: 0.68,
  process: 0.5,
  skills: 0.22,
  about: 0.6,
  experience: 0.8,
  engineering: 0.9,
  contact: 1,
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Smoothstep, so a segment eases in and out rather than running linearly. */
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
 * Measures where each section crosses the trigger line, in document
 * coordinates, sorted by actual position on the page. Sorting by measurement
 * rather than by SECTION_IDS order matters — the page does not necessarily lay
 * sections out in the order the choreography lists them.
 */
export function measureAnchors(): Anchor[] {
  const line = window.innerHeight * 0.45;
  const found: Anchor[] = [];

  for (const section of SECTION_IDS) {
    // A section can nominate a different element as its trigger by tagging it
    // `data-kbd-anchor`. The stack section needs this: its pose should peak
    // when the empty stage is on screen, not when the sticky header is — and
    // those are most of a viewport apart.
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
  if (anchors.length === 0) return POSES.hero[key];
  if (anchors.length === 1) return POSES[anchors[0].section][key];

  if (scrollY <= anchors[0].at) return POSES[anchors[0].section][key];

  const last = anchors[anchors.length - 1];
  if (scrollY >= last.at) return POSES[last.section][key];

  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (scrollY >= a.at && scrollY < b.at) {
      const span = b.at - a.at;
      const t = span <= 0 ? 0 : (scrollY - a.at) / span;
      return lerpPose(POSES[a.section][key], POSES[b.section][key], smooth(t));
    }
  }

  return POSES[last.section][key];
}

/** Canvas opacity for a given scroll offset, interpolated like the poses are. */
export function opacityAt(anchors: Anchor[], scrollY: number): number {
  if (anchors.length === 0) return OPACITY.hero;
  if (anchors.length === 1) return OPACITY[anchors[0].section];
  if (scrollY <= anchors[0].at) return OPACITY[anchors[0].section];

  const last = anchors[anchors.length - 1];
  if (scrollY >= last.at) return OPACITY[last.section];

  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (scrollY >= a.at && scrollY < b.at) {
      const span = b.at - a.at;
      const t = span <= 0 ? 0 : (scrollY - a.at) / span;
      return lerp(OPACITY[a.section], OPACITY[b.section], smooth(t));
    }
  }

  return OPACITY[last.section];
}

/** Interpolated drift amount for a scroll offset. Mirrors poseAt's walk. */
export function floatAmountAt(anchors: Anchor[], scrollY: number): number {
  if (anchors.length === 0) return FLOAT_AMOUNT.hero;
  if (anchors.length === 1) return FLOAT_AMOUNT[anchors[0].section];
  if (scrollY <= anchors[0].at) return FLOAT_AMOUNT[anchors[0].section];

  const last = anchors[anchors.length - 1];
  if (scrollY >= last.at) return FLOAT_AMOUNT[last.section];

  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (scrollY >= a.at && scrollY < b.at) {
      const span = b.at - a.at;
      const t = span <= 0 ? 0 : (scrollY - a.at) / span;
      return lerp(FLOAT_AMOUNT[a.section], FLOAT_AMOUNT[b.section], smooth(t));
    }
  }

  return FLOAT_AMOUNT[last.section];
}

/** Which section currently owns the frame — used for the teardown trigger. */
export function sectionAt(anchors: Anchor[], scrollY: number): Section {
  let current: Section = anchors[0]?.section ?? "hero";
  for (const a of anchors) {
    if (scrollY >= a.at) current = a.section;
  }
  return current;
}
