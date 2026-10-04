import { Linkedin, Mail } from "lucide-react";
import { SiGithub, SiUpwork, SiFiverr } from "react-icons/si";
import type { SocialLink } from "@/types";

// LinkedIn comes from Lucide: Simple Icons no longer ships it.
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
