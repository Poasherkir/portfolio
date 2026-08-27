"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { RoundedBox } from "@react-three/drei";
import { keycaps, type Keycap } from "@/data/portfolio";
import { capAndInk, keycapTexture } from "./keycap-texture";
import { CAP_GEOMETRY } from "./keycap-geometry";
import { floatAmountAt, opacityAt, poseAt, type Anchor } from "./poses";

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
  /** 0 = seated, 1 = fully adrift. A ref, so scrolling does not re-render 30 caps. */
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
  /** Smoothed drift amount. Damping happens here, never on the orbit itself. */
  const liftSmooth = useRef(0);
  /** Damped seated height, so hover and click still snap under the finger. */
  const seatedY = useRef(0);
  // Cap colour and legend ink are chosen together, so a logo can never end up
  // the same colour as the plastic it sits on.
  const { cap: capHex, ink } = useMemo(() => capAndInk(cap.color), [cap.color]);
  const texture = useMemo(() => keycapTexture(cap, capHex, ink), [cap, capHex, ink]);

  // Golden-angle phase, so no two caps reach the top of their arc together.
  const phase = useMemo(() => (index * 137.5) % (Math.PI * 2), [index]);
  // Each cap orbits at its own speed. Without this every cap shares one
  // frequency and the whole board pulses in time, which reads as a wobble
  // rather than as thirty objects floating independently.
  const speed = useMemo(() => 0.34 + ((index * 29) % 13) / 90, [index]);
  // Bounded radii. The board is ~4.3 units across, so anything much beyond
  // half a unit throws caps clear of it and across the page copy.
  const radius = useMemo(
    () => ({
      x: 0.3 + ((index * 17) % 11) / 44,
      y: 0.34 + ((index * 23) % 9) / 34,
      z: 0.18 + ((index * 31) % 7) / 46,
    }),
    [index]
  );

  // Real boards mould each row at its own angle, with the outer rows higher.
  const rowTilt = (row - (ROWS - 1) / 2) * -0.075;
  const rowLift = Math.abs(row - (ROWS - 1) / 2) * 0.016;

  // Deterministic variance, so the caps are not one repeated surface.
  const roughness = useMemo(() => 0.52 + ((index * 53) % 17) / 260, [index]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;

    // Damp the drift AMOUNT, not the drift itself. The orbit below is already
    // continuous, and running a sine through an exponential follower both
    // delays it and eats its amplitude — that lag was the motion reading as
    // sluggish rather than weightless.
    liftSmooth.current = damp(liftSmooth.current, floatRef.current ?? 0, 2.6, dt);
    const lift = liftSmooth.current;

    // Settled enough to behave like a surface. The caps always carry some
    // lift, so this cannot test for zero or the ripple never fires.
    const adrift = lift > 0.3;

    // Neighbours dip toward whatever is hovered, so the board reacts as a surface.
    let ripple = 0;
    if (hoverPos && !active && !adrift) {
      const d = Math.hypot(row - hoverPos.r, col - hoverPos.c);
      if (d < 2.6) ripple = -0.035 * Math.exp(-d * 0.9);
    }

    // Per-cap phase, so the idle motion is not one rigid slab.
    const idleFloat = Math.sin(t * speed * 2 + phase) * 0.014;

    // Seated state is the part worth damping: it changes in steps, and a key
    // still has to drop under the finger.
    const seatedTarget = pinned ? -0.12 : active ? -0.09 : ripple + idleFloat;
    seatedY.current = damp(seatedY.current, seatedTarget, 16, dt);

    // Three-axis orbit, applied straight. Incommensurable frequency ratios
    // (1, 0.83, 0.61) mean x, y and z never come back into step, so the path
    // is an open Lissajous curve instead of a closed loop the eye can learn.
    const w = t * speed;
    const orbitX = Math.sin(w + phase) * radius.x;
    const orbitY = Math.sin(w * 0.83 + phase * 1.7) * radius.y;
    const orbitZ = Math.cos(w * 0.61 + phase * 0.6) * radius.z;

    // Rise is what separates "floating" from "vibrating in place", but it is
    // deliberately smaller than the board is tall.
    g.position.x = orbitX * lift;
    g.position.y = seatedY.current * (1 - lift) + lift * (0.72 + orbitY);
    g.position.z = orbitZ * lift;

    // Click impulses: a quick overshoot, and a full tumble that unwinds.
    pop.current = damp(pop.current, 0, 6, dt);
    flip.current = damp(flip.current, 0, 3.2, dt);

    // Rotation follows the same rule: the sway is applied directly, and only
    // the click impulse goes through a damper.
    g.rotation.z = Math.sin(w * 0.77 + phase) * 0.34 * lift + pop.current * 0.5;
    restX.current = Math.cos(w * 0.53 + phase * 1.3) * 0.26 * lift;
    g.rotation.x = restX.current + flip.current * Math.PI * 2;
    g.rotation.y = Math.sin(w * 0.41 + phase * 0.9) * 0.3 * lift;

    const base = active || pinned ? 1.05 : 1;
    g.scale.setScalar(damp(g.scale.x, base + pop.current * 0.16, 14, dt));

    // Glow only on interaction. At rest the cap is lit, not lit up.
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
    // Outer group holds the static grid offset, inner one is animated. React
    // re-applies `position` on re-render and would snap the animated y back.
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
          // No stopPropagation — R3F tears down its raycast state before
          // pointer-out fires and throws if the event is stopped.
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
            // Colour is baked into the texture, so the tint stays white.
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
  /** Normalised cursor position, -1..1 on both axes. */
  pointerRef: RefObject<{ x: number; y: number }>;
  isMobile: boolean;
  activeId: string | null;
  pinnedId: string | null;
  onHover: (cap: Keycap | null) => void;
  onPress: (cap: Keycap) => void;
  /** Written every frame from the same anchors that drive the pose. */
  boardOpacity: MotionValue<number>;
};

export default function Keyboard({
  anchorsRef,
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

    // Straight from the section table, like the pose and the opacity.
    floatRef.current = floatAmountAt(anchorsRef.current ?? [], window.scrollY);

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
    // Breath is added after the damper for the same reason the caps are: a
    // follower chasing a sine lags it and shrinks it.
    g.position.y = damp(g.position.y, target.position[1], 9, dt) + Math.sin(t * 0.5) * 0.05;
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
