/** DOM silhouette of the 3D board, shown in its place while the scene downloads. */
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
            // Matches the board's resting pose.
            transform: "perspective(900px) rotateX(52deg) rotateZ(-24deg)",
          }}
        >
          {Array.from({ length: ROWS * COLS }).map((_, i) => (
            <span
              key={i}
              className="aspect-square rounded-[22%] bg-foreground"
              style={{
                opacity: 0.35 + (Math.floor(i / COLS) / ROWS) * 0.5,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
