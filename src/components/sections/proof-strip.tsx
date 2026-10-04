import { proofStrip } from "@/data/portfolio";

/**
 * Scrolling marquee. The list is rendered twice so the -50% translate loops;
 * the copy is aria-hidden.
 */
export default function ProofStrip() {
  return (
    <div className="relative border-y border-border bg-background/90 py-4">
      <div className="mask-fade-x flex overflow-hidden">
        <ul className="flex shrink-0 animate-marquee items-center gap-10 pr-10 motion-reduce:animate-none">
          {proofStrip.map((fact) => (
            <Item key={fact} text={fact} />
          ))}
        </ul>
        <ul
          aria-hidden
          className="flex shrink-0 animate-marquee items-center gap-10 pr-10 motion-reduce:hidden"
        >
          {proofStrip.map((fact) => (
            <Item key={`dup-${fact}`} text={fact} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function Item({ text }: { text: string }) {
  return (
    <li className="flex shrink-0 items-center gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
      {text}
      <span className="h-1 w-1 rounded-full bg-foreground/30" aria-hidden />
    </li>
  );
}
