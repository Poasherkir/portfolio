import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * A phone screenshot in a device bezel. Aspect is fixed and the image is
 * cover-cropped from the top — captures vary by a few pixels between devices,
 * and a row of phones at their own heights looks ragged.
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
