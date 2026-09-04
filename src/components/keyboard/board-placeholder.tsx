/**
 * Stands in for the 3D board while its chunk downloads.
 *
 * three.js and the scene are a few hundred kilobytes, and until they arrive the
 * right half of the hero is simply empty — which is the first thing a visitor
 * sees. This is the board's silhouette in plain DOM: no canvas, no JS, no
 * measurable cost, and it occupies the same corner so nothing shifts when the
 * real one takes over.
 */
export default function BoardPlaceholder() {
  const ROWS = 5;
  const COLS = 6;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute right-[-6%] top-1/2 hidden -translate-y-1/2 md:block">
        <div
          className="grid gap-[7px] opacity-[0.16]"
          style={{
            gridTemplateColumns: `repeat(${COLS}, clamp(38px, 4.4vw, 68px))`,
            // Roughly the board's resting attitude, so the swap does not jump.
            transform: "perspective(900px) rotateX(52deg) rotateZ(-24deg)",
          }}
        >
          {Array.from({ length: ROWS * COLS }).map((_, i) => (
            <span
              key={i}
              className="aspect-square rounded-[22%] bg-foreground"
              style={{
                // Front rows fractionally brighter, which reads as depth
                // rather than as a flat sheet of squares.
                opacity: 0.35 + (Math.floor(i / COLS) / ROWS) * 0.5,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
