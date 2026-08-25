"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { RoundedBox } from "@react-three/drei";
import { keycaps, type Keycap } from "@/data/portfolio";
import { capAndInk, keycapTexture } from "./keycap-texture";
import { CAP_GEOMETRY } from "./keycap-geometry";
import { floatCeilingAt, opacityAt, poseAt, type Anchor } from "./poses";

const COLS = 6;
const ROWS = keycaps.length;
const PITCH = 0.86;
// Each row steps right a little, the way real keyboard rows are staggered.
const ROW_STAGGER = 0.14;
const BASE_W = COLS * PITCH + ROW_STAGGER * 3 + 0.5;
const BASE_D = ROWS * PITCH + 0.5;

/** Exponential damping — frame-rate independent, unlike a raw lerp factor. */
function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

type CapProps = {
  cap: Keycap;
  position: [number, number, number];
  index: number;
  row: number;
  col: number;
  /** Grid position of whatever is hovered, so neighbours can react. */
  hoverPos: { r: number; c: number } | null;
  active: boolean;
  pinned: boolean;
  /** 0 = seated on the board, 1 = fully adrift. Updated every frame, so it is
   *  a ref rather than a prop — a prop would re-render all 30 caps on every
   *  scroll event. */
  floatRef: RefObject<number>;
  onHover: (cap: Keycap | null) => void;
  onPress: (cap: Keycap) => void;
};

function Cap({
  cap,
  position,
  index,
  row,
  col,
  hoverPos,
  active,
  pinned,
  floatRef,
  onHover,
  onPress,
}: CapProps) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  /** Decaying 0..1 impulse, set on click, drives the pop. */
  const pop = useRef(0);
  /** Decaying 1..0 impulse that drives a full tumble when a cap is clicked. */
  const flip = useRef(0);
  /** Damped base pitch, kept apart from the tumble offset — see below. */
  const restX = useRef(0);
  // Cap colour and legend ink are chosen together, so a logo can never end up
  // the same colour as the plastic it sits on.
  const { cap: capHex, ink } = useMemo(() => capAndInk(cap.color), [cap.color]);
  const texture = useMemo(() => keycapTexture(cap, capHex, ink), [cap, capHex, ink]);

  // Each cap gets its own phase so the teardown float does not move in lockstep.
  const phase = useMemo(() => (index * 137.5) % (Math.PI * 2), [index]);
  const drift = useMemo(() => 1.4 + ((index * 37) % 100) / 60, [index]);

  // Row profile: on a real board every row is moulded at its own angle, and
  // the outer rows sit higher than the middle. Uniform caps look injection
  // -moulded in one go, which is exactly the cheap tell.
  const rowTilt = (row - (ROWS - 1) / 2) * -0.075;
  const rowLift = Math.abs(row - (ROWS - 1) / 2) * 0.016;

  // A little deterministic variance so 24 caps are not one repeated surface.
  const roughness = useMemo(() => 0.52 + ((index * 53) % 17) / 260, [index]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const lift = floatRef.current ?? 0;
    const adrift = lift > 0.002;

    // A pinned cap stays down; a hovered one bottoms out; otherwise it rests.
    // Neighbours dip toward whatever is hovered — the board reacts as a
    // surface rather than 30 independent objects.
    let ripple = 0;
    if (hoverPos && !active && !adrift) {
      const d = Math.hypot(row - hoverPos.r, col - hoverPos.c);
      if (d < 2.6) ripple = -0.035 * Math.exp(-d * 0.9);
    }

    // Gentle idle float, so the board breathes instead of sitting dead. Each
    // cap has its own phase, which keeps it from looking like one rigid slab.
    const idleFloat = Math.sin(t * 0.9 + phase) * 0.014;

    // Scroll lifts the caps off the board and sets them drifting. Everything is
    // scaled by `lift`, so it is a continuous departure rather than a switch.
    const scattered = lift * (1.35 + Math.sin(t * 0.9 + phase) * drift);
    const seated = pinned ? -0.12 : active ? -0.09 : ripple + idleFloat;
    const targetY = seated * (1 - lift) + scattered;

    // Damping loosens as they leave: drifting keys feel weightless, a seated
    // key still snaps under the finger.
    g.position.y = damp(g.position.y, targetY, 18 - lift * 15.5, dt);

    // Click impulses: a quick overshoot, and a full tumble that unwinds.
    pop.current = damp(pop.current, 0, 6, dt);
    flip.current = damp(flip.current, 0, 3.2, dt);

    const spin = Math.sin(t * 0.5 + phase) * 0.6 * lift;
    g.rotation.z = damp(g.rotation.z, spin + pop.current * 0.5, 2, dt);
    // Base and offset are tracked separately on purpose. Damping g.rotation.x
    // and then adding the tumble to it feeds the offset back in as next
    // frame's starting value, so the rotation accumulates and the caps end up
    // arbitrarily upside-down.
    restX.current = damp(restX.current, Math.cos(t * 0.4 + phase) * 0.4 * lift, 2, dt);
    g.rotation.x = restX.current + flip.current * Math.PI * 2;

    const base = active || pinned ? 1.05 : 1;
    g.scale.setScalar(damp(g.scale.x, base + pop.current * 0.16, 14, dt));

    // Glow ONLY on interaction. A permanent emissive bloom is what made these
    // read as cheap backlit plastic — at rest the cap is lit, not lit up.
    if (material.current) {
      const targetGlow = pinned ? 0.85 : active ? 0.55 : 0;
      material.current.emissiveIntensity = damp(
        material.current.emissiveIntensity,
        targetGlow,
        12,
        dt
      );

    }
  });

  return (
    // Outer group holds the static grid offset; the inner one is what the frame
    // loop moves. Keeping them separate matters: React re-applies `position` on
    // every re-render, so animating y on the same group would snap it back to
    // the resting height each time `active` flips.
    <group position={[position[0], position[1] + rowLift, position[2]]} rotation={[rowTilt, 0, 0]}>
      <group ref={group}>
        <mesh
          geometry={CAP_GEOMETRY}
          castShadow
          receiveShadow
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(cap);
          }}
          // No stopPropagation here on purpose: react-three-fiber tears down
          // its internal raycast state before pointer-out fires, and calling
          // stopPropagation on that event throws.
          onPointerOut={() => onHover(null)}
          onClick={(e) => {
            e.stopPropagation();
            pop.current = 1;
            flip.current = 1;
            onPress(cap);
          }}
        >
          <meshStandardMaterial
            ref={material}
            // Cap colour is baked into the texture, so the material tint is
            // white and the map supplies both the colour and the logo.
            map={texture}
            color="#ffffff"
            roughness={roughness}
            metalness={0}
            envMapIntensity={0.08}
            emissive={cap.color}
            emissiveIntensity={0}
          />
        </mesh>

      </group>
    </group>
  );
}

export type KeyboardProps = {
  anchorsRef: RefObject<Anchor[]>;
  /** Cached scrollable height, refreshed on resize — never read per frame. */
  maxScrollRef: RefObject<number>;
  /** Normalised cursor position, -1..1 on both axes. */
  pointerRef: RefObject<{ x: number; y: number }>;
  isMobile: boolean;
  activeId: string | null;
  pinnedId: string | null;
  onHover: (cap: Keycap | null) => void;
  onPress: (cap: Keycap) => void;
  /** Driven from here rather than useScroll — see opacityAt for why. */
  boardOpacity: MotionValue<number>;
};

export default function Keyboard({
  anchorsRef,
  maxScrollRef,
  pointerRef,
  isMobile,
  activeId,
  pinnedId,
  onHover,
  onPress,
  boardOpacity,
}: KeyboardProps) {
  const root = useRef<THREE.Group>(null);
  const settled = useRef(false);
  /** How far the caps have drifted off the board, 0..1, driven by scroll. */
  const floatRef = useRef(0);

  // Grid position of the hovered cap, so its neighbours can ripple toward it.
  const hoverPos = useMemo(() => {
    if (!activeId) return null;
    for (let r = 0; r < keycaps.length; r++) {
      const c = keycaps[r].findIndex((k) => k.id === activeId);
      if (c !== -1) return { r, c };
    }
    return null;
  }, [activeId]);

  // Grow in from nothing on first paint rather than popping into frame.
  useEffect(() => {
    if (root.current) root.current.scale.setScalar(0.01);
  }, []);

  useFrame((state, dt) => {
    const g = root.current;
    if (!g) return;
    const t = state.clock.elapsedTime;

    // Caps lift off the board across the back half of the page, so by the time
    // the visitor reaches the bottom the keyboard has come apart around them.
    //
    // maxScroll is READ FROM A CACHE, never measured here. Touching
    // scrollHeight forces a synchronous layout, and doing that every frame
    // while Lenis is writing scroll positions thrashes layout — measured, it
    // took frame time from 17ms idle to 32ms while scrolling.
    const max = maxScrollRef.current ?? 0;
    const progress = max > 0 ? window.scrollY / max : 0;
    // Tuned to hit: 0 at the top, ~0.30 at a quarter, ~0.92 at half, and fully
    // adrift by three quarters — so the caps spend the last stretch of the page
    // floating rather than only breaking apart at the very end.
    const ramp = Math.min(Math.max((progress - 0.05) / 0.545, 0), 1);
    const drift = ramp * ramp * (3 - 2 * ramp); // smoothstep
    // ...then clamped by the section, so the caps reassemble into a keyboard
    // over the stack section and come apart again after it.
    floatRef.current =
      drift * floatCeilingAt(anchorsRef.current ?? [], window.scrollY);

    // Scrubbed, not switched: the pose is interpolated from the live scroll
    // offset every frame, so the board moves continuously with the page rather
    // than lurching when a section boundary trips.
    const target = poseAt(anchorsRef.current ?? [], window.scrollY, isMobile);

    // Same anchors, same interpolation — so how present the board is stays in
    // step with where it is, instead of drifting apart as the page grows.
    boardOpacity.set(opacityAt(anchorsRef.current ?? [], window.scrollY));

    // Cursor parallax, plus a slow idle drift so it is never quite still.
    const p = pointerRef.current ?? { x: 0, y: 0 };
    const idle = Math.sin(t * 0.2) * 0.12;
    const parallaxY = isMobile ? 0 : p.x * 0.22;
    const parallaxX = isMobile ? 0 : -p.y * 0.14;

    // Position tracks scroll tightly; rotation is looser so the cursor
    // parallax feels weighted rather than twitchy.
    g.position.x = damp(g.position.x, target.position[0], 9, dt);
    g.position.y = damp(g.position.y, target.position[1] + Math.sin(t * 0.5) * 0.05, 9, dt);
    g.position.z = damp(g.position.z, target.position[2], 9, dt);

    g.rotation.x = damp(g.rotation.x, target.rotation[0] + parallaxX, 4, dt);
    g.rotation.y = damp(g.rotation.y, target.rotation[1] + idle + parallaxY, 4, dt);
    g.rotation.z = damp(g.rotation.z, target.rotation[2], 4, dt);

    const s = damp(g.scale.x, target.scale, settled.current ? 9 : 2.4, dt);
    g.scale.setScalar(s);
    if (!settled.current && s > target.scale * 0.95) settled.current = true;
  });

  return (
    <group ref={root} dispose={null}>
      {/* Case */}
      <RoundedBox
        args={[BASE_W, 0.44, BASE_D]}
        radius={0.14}
        smoothness={5}
        position={[0, -0.24, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#191d24"
          roughness={0.34}
          metalness={0.65}
          clearcoat={0.35}
          clearcoatRoughness={0.4}
          envMapIntensity={0.75}
        />
      </RoundedBox>

      {/* Plate the caps sit on — darker, so the caps read against it */}
      <RoundedBox
        args={[BASE_W - 0.22, 0.14, BASE_D - 0.22]}
        radius={0.05}
        smoothness={3}
        position={[0, -0.03, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color="#0d1116"
          roughness={0.7}
          metalness={0.3}
          envMapIntensity={0.35}
        />
      </RoundedBox>

      {keycaps.map((row, r) =>
        row.map((cap, c) => (
          <Cap
            key={cap.id}
            cap={cap}
            index={r * COLS + c}
            row={r}
            col={c}
            hoverPos={hoverPos}
            position={[
              (c - (COLS - 1) / 2) * PITCH + (r - (ROWS - 1) / 2) * ROW_STAGGER,
              0.16,
              (r - (ROWS - 1) / 2) * PITCH,
            ]}
            active={activeId === cap.id}
            pinned={pinnedId === cap.id}
            floatRef={floatRef}
            onHover={onHover}
            onPress={onPress}
          />
        ))
      )}
    </group>
  );
}
