import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Desktop counterpart to PhoneFrame.
 *
 * A web screenshot dropped straight into a card bleeds to the edges and reads
 * as a stretched image rather than a product. The phones get a frame and a
 * staged backdrop; this gives the same to anything landscape, so a row mixing
 * mobile and web work looks like one set.
 *
 * 16:10 because that is the shape of the captures, and cropping a browser
 * window is what makes it look like a mistake.
 */
export default function BrowserFrame({
  src,
  alt,
  priority = false,
  className,
  sizes = "(max-width: 640px) 80vw, 420px",
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
        "w-full overflow-hidden rounded-lg border border-white/15 bg-[#111111] shadow-2xl",
        className
      )}
    >
      {/* Title bar. Three dots and nothing else — a fake URL would be a
          claim about an address, and the real one is in the case study. */}
      <div className="flex h-5 items-center gap-1.5 bg-[#1c1c1c] px-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
      </div>

      <div className="relative aspect-[16/10] w-full overflow-hidden">
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
