import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * A phone screenshot in a device bezel.
 *
 * The app is light-themed and this site is dark, so a bare screenshot would
 * float as a bright rectangle with no edge. The bezel gives it a boundary and
 * reads as "this is a running app" rather than "this is an image".
 *
 * Aspect is fixed at 9:19.5 and the image is cover-cropped from the top —
 * source captures vary by a few pixels between devices, and letting each one
 * set its own height would make a row of phones ragged.
 */
export default function PhoneFrame({
  src,
  alt,
  priority = false,
  className,
  sizes = "(max-width: 640px) 60vw, 260px",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19.5] w-full overflow-hidden rounded-[1.75rem]",
        "border border-white/15 bg-[#0b1220] p-[3px] shadow-2xl",
        className
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[1.55rem]">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}
