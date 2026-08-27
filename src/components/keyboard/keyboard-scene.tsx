"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { AnimatePresence, motion, useMotionValue } from "motion/react";
import { useTheme } from "next-themes";
import { X } from "lucide-react";
import Link from "next/link";
import { keycapList, keycaps, type Keycap, projects } from "@/data/portfolio";
import {
  initKeyboardAudio,
  isAudioUnlocked,
  playPress,
  playRelease,
  subscribeUnlock,
} from "./keyboard-audio";
import Keyboard from "./keyboard";
import { measureAnchors, type Anchor } from "./poses";
import { useQuality } from "./use-quality";

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}


/**
 * Image-based lighting from three's RoomEnvironment. Without an environment map
 * a physical material has nothing to reflect and reads flat. Generated locally
 * rather than using drei's presets, which fetch an .hdr from a CDN.
 */
function StudioEnvironment() {
  const scene = useThree((s) => s.scene);
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const target = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = target.texture;
    // A bright white studio at full strength floods dark caps to pastel.
    // Keep it as a faint reflection, not a light source.
    scene.environmentIntensity = 0.3;

    // Dev-only handle, so the scene graph can be inspected from the console.
    if (process.env.NODE_ENV !== "production") {
      const w = window as unknown as Record<string, unknown>;
      w.__kbdScene = scene;
      w.__kbdGl = gl;
      w.__kbdCam = camera;
    }
    return () => {
      scene.environmentIntensity = 1;
      scene.environment = null;
      target.dispose();
      pmrem.dispose();
    };
  }, [scene, gl, camera]);

  return null;
}

export default function KeyboardScene() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== "light";

  const [supported, setSupported] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const quality = useQuality();
  const [hovered, setHovered] = useState<Keycap | null>(null);
  const [pinned, setPinned] = useState<Keycap | null>(null);
  const [audioReady, setAudioReady] = useState(true);

  /**
   * One opacity on the canvas, not per-material transparency: 30 transparent
   * caps land in three's alpha-blended pass, sort unreliably against each other
   * and read as blur wherever they overlap. Written every frame by <Keyboard>.
   */
  const boardOpacity = useMotionValue(1);

  const anchorsRef = useRef<Anchor[]>([]);
  const pointerRef = useRef({ x: 0, y: 0 });
  const hoveredRef = useRef<Keycap | null>(null);
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const byKey = useMemo(() => {
    const map = new Map<string, Keycap>();
    keycapList.forEach((c) => map.set(c.key, c));
    return map;
  }, []);

  /** Pitch rises left to right — switches ring differently across the case. */
  const pitchOf = useMemo(() => {
    const map = new Map<string, number>();
    keycaps.forEach((row, r) =>
      row.forEach((cap, c) => {
        const across = c / Math.max(1, row.length - 1);
        const down = r / Math.max(1, keycaps.length - 1);
        map.set(cap.id, 0.86 + across * 0.26 + down * 0.06);
      })
    );
    return map;
  }, []);

  useEffect(() => {
    initKeyboardAudio();
    setAudioReady(isAudioUnlocked());
    const stop = subscribeUnlock(() => setAudioReady(true));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setSupported(hasWebGL() && !reduced);

    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      stop();
    };
  }, []);

  /** Re-measured whenever the page changes height, or the choreography drifts. */
  useEffect(() => {
    if (!supported) return;

    const remeasure = () => {
      anchorsRef.current = measureAnchors();
    };
    remeasure();

    const observer = new ResizeObserver(remeasure);
    observer.observe(document.body);
    window.addEventListener("resize", remeasure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", remeasure);
    };
  }, [supported]);

  // Cursor position, normalised to -1..1, for the parallax tilt.
  useEffect(() => {
    if (!supported || isMobile) return;
    const onMove = (e: PointerEvent) => {
      pointerRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [supported, isMobile]);

  const onHover = useCallback(
    (cap: Keycap | null) => {
      if (hoveredRef.current?.id === cap?.id) return;
      hoveredRef.current = cap;
      setHovered(cap);
      if (cap) playPress(pitchOf.get(cap.id) ?? 1);
      else playRelease();
    },
    [pitchOf]
  );

  /** Clicking a cap pins it, so the description stays put while you read it. */
  const onPress = useCallback(
    (cap: Keycap) => {
      playPress(pitchOf.get(cap.id) ?? 1);
      setPinned((prev) => (prev?.id === cap.id ? null : cap));
    },
    [pitchOf]
  );

  // Physical keyboard drives the virtual one.
  useEffect(() => {
    if (!supported) return;

    const isTyping = () => {
      const el = document.activeElement as HTMLElement | null;
      return Boolean(
        el &&
          (el.tagName === "INPUT" ||
            el.tagName === "TEXTAREA" ||
            el.tagName === "SELECT" ||
            el.isContentEditable)
      );
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPinned(null);
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping()) return;
      const cap = byKey.get(e.key.toLowerCase());
      if (!cap) return;
      playPress(pitchOf.get(cap.id) ?? 1);
      setPinned(cap);
      if (releaseTimer.current) clearTimeout(releaseTimer.current);
      releaseTimer.current = setTimeout(() => setPinned(null), 2600);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (releaseTimer.current) clearTimeout(releaseTimer.current);
    };
  }, [supported, byKey, pitchOf]);

  if (!supported) return null;

  const shown = pinned ?? hovered;

  // Computed from the real stacks, so a keycap never links to an empty result.
  const projectCount = shown
    ? projects.filter((p) =>
        p.stack.some((tech) => tech.toLowerCase().includes(shown.label.toLowerCase()))
      ).length
    : 0;

  return (
    <>
      <motion.div
        // Never a negative z-index: content behind an opaque ancestor
        // background is dropped from hit-testing and stops receiving hover.
        className="fixed inset-0 z-0"
        style={{ opacity: boardOpacity, cursor: hovered ? "pointer" : "default" }}
        aria-hidden
      >
        <Canvas
          shadows={quality.shadows}
          // Capped by measured device capability, not viewport width. R3F
          // clamps to the display's own ratio on top of this, so the number is
          // a ceiling rather than a target.
          dpr={[1, quality.dpr]}
          // Lets R3F drop resolution on its own when frames start costing too
          // much, so a device that is slower than it looks still stays fluid.
          performance={{ min: 0.5 }}
          camera={{ fov: 34, position: [0, 0, 9] }}
          // ACES rolls saturated colour toward white; neutral keeps the hue.
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            alpha: true,
            toneMapping: THREE.NeutralToneMapping,
            toneMappingExposure: 1.06,
          }}
          style={{ background: "transparent" }}
          onPointerMissed={() => setPinned(null)}
        >
          <StudioEnvironment />
          <ambientLight intensity={dark ? 0.08 : 0.3} />
          <directionalLight
            position={[4, 8, 6]}
            intensity={dark ? 1.35 : 1.8}
            castShadow
            shadow-mapSize={[quality.shadowMap, quality.shadowMap]}
            shadow-bias={-0.0005}
            shadow-normalBias={0.02}
          >
            {/* Sized to the largest pose. The board is scaled per section and
                reaches ~14.8 units across on the background poses, so a box
                fitted to its unscaled footprint clipped the shadows off the
                outer caps. 4096 keeps the texel density up over the wider
                area — at 2048 a cap only got ~90 texels. */}
            <orthographicCamera attach="shadow-camera" args={[-8, 8, 8, -8, 0.1, 26]} />
          </directionalLight>
          {/* Coloured rims, kept low: they shape the case without washing the
              legends out. Point lights decay with distance squared, so these
              read far weaker at the board than the numbers suggest. */}
          <pointLight position={[-4, 2, 5]} intensity={dark ? 12 : 6} color="#e63946" />
          <pointLight position={[5, -1, 4]} intensity={dark ? 7 : 3} color="#70c8ff" />
          <hemisphereLight intensity={dark ? 0.15 : 0.4} groundColor="#0c0c0c" />

          <Keyboard
            anchorsRef={anchorsRef}
            pointerRef={pointerRef}
            isMobile={isMobile}
            activeId={hovered?.id ?? null}
            pinnedId={pinned?.id ?? null}
            onHover={onHover}
            onPress={onPress}
            boardOpacity={boardOpacity}
          />
        </Canvas>
      </motion.div>

      {/* Read-out. Follows whatever is hovered, and stays put once pinned. */}
      <AnimatePresence>
        {shown && (
          <motion.div
            key="readout"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-x-0 bottom-6 z-[900] flex justify-center px-5"
          >
            <div className="pointer-events-auto relative w-full max-w-md rounded-xl border border-border bg-background/90 px-5 py-4 text-center shadow-2xl backdrop-blur-md">
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: shown.color }}
              />
              <p className="font-display text-lg font-semibold tracking-tight">{shown.label}</p>

              {/* The tier travels with the cap. A logo on a keycap reads as
                  "I use this", so anything still on the roadmap has to say so
                  right here rather than quietly implying otherwise. */}
              <span
                className={
                  shown.level === "shipping"
                    ? "mt-2 inline-flex rounded-full border border-brand/40 bg-brand/10 px-2.5 py-0.5 text-[0.65rem] uppercase tracking-[0.14em] text-brand"
                    : shown.level === "working"
                      ? "mt-2 inline-flex rounded-full border border-border bg-secondary/60 px-2.5 py-0.5 text-[0.65rem] uppercase tracking-[0.14em] text-foreground"
                      : "mt-2 inline-flex rounded-full border border-dashed border-border px-2.5 py-0.5 text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground"
                }
              >
                {shown.level === "shipping"
                  ? "Shipping"
                  : shown.level === "working"
                    ? "Working knowledge"
                    : "On the roadmap"}
              </span>

              <p className="mt-2 text-sm font-normal text-muted-foreground">
                {shown.description}
              </p>

              {/* Only rendered where there is an honest answer. A logo on a
                  keycap must not imply a project that does not exist. */}
              {projectCount > 0 && (
                <Link
                  href={`/projects?stack=${encodeURIComponent(shown.label)}`}
                  className="mt-3 inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-brand transition-colors hover:text-brand/80"
                >
                  See {projectCount} {projectCount === 1 ? "project" : "projects"} →
                </Link>
              )}

              {shown.usedIn && (
                <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span className="font-mono uppercase tracking-[0.16em] text-brand">
                    Used in
                  </span>
                  <span className="mt-1 block text-foreground">{shown.usedIn}</span>
                </p>
              )}

              {/* Browsers refuse to start audio before a click or keypress, so
                  the very first hover is always silent. Saying so beats leaving
                  someone wondering why the keyboard is mute. */}
              {!audioReady && (
                <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground/70">
                  Click anywhere to enable key sounds
                </p>
              )}

              {pinned && (
                <button
                  onClick={() => setPinned(null)}
                  aria-label="Dismiss"
                  className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
