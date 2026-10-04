import Image from "next/image";
import { cn } from "@/lib/utils";

/** A 16:10 desktop screenshot in a minimal browser window. */
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
      {/* Title bar */}
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
