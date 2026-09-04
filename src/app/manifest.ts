import type { MetadataRoute } from "next";
import { profile } from "@/data/portfolio";

/**
 * Present so an installed shortcut carries the right name and colours instead
 * of the URL and a white bar. Deliberately not a full PWA manifest: there is
 * no service worker here and no offline story, so claiming display:standalone
 * would open the site in a chrome-less window with no way back.
 */
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
