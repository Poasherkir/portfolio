import type { MetadataRoute } from "next";
import { profile } from "@/data/portfolio";

/** Name and colours for home-screen shortcuts. Not a PWA: there is no service worker. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} — ${profile.role}`,
    short_name: profile.name,
    description: `${profile.name} — ${profile.role} in ${profile.location}.`,
    start_url: "/",
    display: "browser",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
