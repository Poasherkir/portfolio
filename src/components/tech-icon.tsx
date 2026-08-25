import { keycapList } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/**
 * Flat version of a keycap logo, for the experience timeline and the project
 * modals. Reads the same Devicon file the 3D board uses, so a technology looks
 * identical everywhere it appears.
 */
export default function TechIcon({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const cap = keycapList.find((c) => c.id === id);
  if (!cap) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/assets/devicon/${cap.icon}`}
      alt=""
      aria-hidden
      loading="lazy"
      className={cn("h-3.5 w-3.5 object-contain", className)}
    />
  );
}
