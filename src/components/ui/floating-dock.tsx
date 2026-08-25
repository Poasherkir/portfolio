"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";
import TechIcon from "@/components/tech-icon";

export type DockItem = { id: string; title: string; hasIcon: boolean; color: string };

/**
 * macOS-style magnifying dock, used inside the project modals to show a stack.
 * Icons scale with how close the cursor is to them.
 */
export function FloatingDock({ items, className }: { items: DockItem[]; className?: string }) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto flex h-14 items-end gap-3 rounded-2xl bg-gray-50 px-3 pb-2 dark:bg-neutral-900",
        className
      )}
    >
      {items.map((item) => (
        <DockIcon key={item.id} mouseX={mouseX} item={item} />
      ))}
    </div>
  );
}

function DockIcon({ mouseX, item }: { mouseX: MotionValue<number>; item: DockItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeRaw = useTransform(distance, [-120, 0, 120], [36, 62, 36]);
  const iconRaw = useTransform(distance, [-120, 0, 120], [18, 30, 18]);
  const spring = { mass: 0.1, stiffness: 150, damping: 12 };
  const size = useSpring(sizeRaw, spring);
  const iconSize = useSpring(iconRaw, spring);

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex aspect-square items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-800"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="absolute -top-8 left-1/2 w-fit whitespace-pre rounded-md border border-border bg-popover px-2 py-0.5 text-xs text-popover-foreground"
          >
            {item.title}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        style={{ width: iconSize, height: iconSize, color: item.color }}
        className="flex items-center justify-center"
      >
        {item.hasIcon ? (
          <TechIcon id={item.id} className="h-full w-full" />
        ) : (
          <span className="text-[0.6rem] font-bold">{item.title.slice(0, 3)}</span>
        )}
      </motion.div>
    </motion.div>
  );
}
