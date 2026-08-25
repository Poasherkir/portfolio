import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import PhoneFrame from "./phone-frame";

/**
 * A row of real app screens.
 *
 * Two arrangements. `stage` staggers a few phones on a lit backdrop for use as
 * cover art — the middle one sits forward so the group reads as one object
 * rather than three loose rectangles. `strip` lays them out flat with captions
 * for the case study, where the reader wants to look at each screen properly
 * rather than admire an arrangement.
 */
export default function ScreenGallery({
  screens,
  variant = "stage",
  priority = false,
  className,
}: {
  screens: NonNullable<Project["screens"]>;
  variant?: "stage" | "strip";
  priority?: boolean;
  className?: string;
}) {
  if (screens.length === 0) return null;

  if (variant === "strip") {
    return (
      <ul
        className={cn(
          "grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4",
          className
        )}
      >
        {screens.map((screen, i) => (
          <li key={screen.src}>
            <figure>
              <PhoneFrame
                src={screen.src}
                alt={screen.alt}
                priority={priority && i === 0}
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
              />
              <figcaption className="mt-3 font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground">
                {screen.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    );
  }

  // Stage: at most three, because a fourth phone at this size is unreadable.
  const shown = screens.slice(0, 3);

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden bg-[#080d16] dark:bg-[#070c14]",
        className
      )}
    >
      <div className="instrument-grid absolute inset-0 opacity-30" />
      <div
        className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[80px]"
        style={{ background: "radial-gradient(circle, hsl(var(--brand)) 0%, transparent 65%)" }}
      />

      <div className="absolute inset-0 flex items-center justify-center gap-3 px-6 pt-10 sm:gap-5">
        {shown.map((screen, i) => {
          const isCentre = i === 1 || shown.length === 1;
          return (
            <div
              key={screen.src}
              className={cn(
                "w-[27%] max-w-[190px] shrink-0 transition-transform duration-500",
                // The centre phone stands forward; the outer two sit back and
                // tilt away, which turns a row into a group.
                isCentre
                  ? "z-10 -translate-y-3 scale-[1.06]"
                  : "z-0 translate-y-4 scale-[0.94] opacity-90",
                !isCentre && i === 0 && "-rotate-[5deg]",
                !isCentre && i === 2 && "rotate-[5deg]"
              )}
            >
              <PhoneFrame
                src={screen.src}
                alt={screen.alt}
                priority={priority && isCentre}
                sizes="(max-width: 640px) 30vw, 190px"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
