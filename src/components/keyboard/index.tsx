"use client";

import dynamic from "next/dynamic";

// Client-only and lazy, so three.js stays out of the server bundle. Without
// WebGL the page falls back to the flat background layer.
const KeyboardScene = dynamic(() => import("./keyboard-scene"), { ssr: false });

export default function Keyboard3D() {
  return <KeyboardScene />;
}
