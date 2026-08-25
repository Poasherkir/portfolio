"use client";

import dynamic from "next/dynamic";

/**
 * The 3D scene is client-only and lazily loaded, so three.js never lands in the
 * server bundle or the critical path. Until it arrives (and forever, for anyone
 * on prefers-reduced-motion or without WebGL) the page falls back to the flat
 * background layer, which is a complete design on its own.
 */
const KeyboardScene = dynamic(() => import("./keyboard-scene"), { ssr: false });

export default function Keyboard3D() {
  return <KeyboardScene />;
}
