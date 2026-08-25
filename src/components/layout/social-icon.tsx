import { Linkedin, Mail } from "lucide-react";
import { SiGithub, SiUpwork, SiFiverr } from "react-icons/si";
import type { SocialLink } from "@/types";

/**
 * Simple Icons dropped its LinkedIn glyph over brand restrictions, so that one
 * comes from Lucide. Everything else keeps the brandmark.
 */
const MAP = {
  github: SiGithub,
  linkedin: Linkedin,
  upwork: SiUpwork,
  fiverr: SiFiverr,
  mail: Mail,
} as const;

export default function SocialIcon({
  name,
  className,
}: {
  name: SocialLink["icon"];
  className?: string;
}) {
  const Icon = MAP[name];
  return <Icon className={className} aria-hidden />;
}
