"use client";

import dynamic from "next/dynamic";
import BoardPlaceholder from "./board-placeholder";

// Client-only and lazy, so three.js stays out of the server bundle. Without
// WebGL the page falls back to the flat background layer.
//
// `loading` matters here: the chunk is a few hundred kilobytes, and without a
// stand-in the right half of the hero is empty for the whole download.
const KeyboardScene = dynamic(() => import("./keyboard-scene"), {
  ssr: false,
  loading: () => <BoardPlaceholder />,
});

export default function Keyboard3D() {
  return <KeyboardScene />;
}
