"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

/** Hint that the page continues. Disappears the moment anyone scrolls. */
export default function ScrollCue() {
  const [show, setShow] = useState(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setShow(y < 20));

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-2"
          aria-hidden
        >
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-muted-foreground">
            Scroll
          </span>
          <div className="flex h-10 w-6 justify-center rounded-full border border-border p-1.5">
            <motion.span
              animate={{ y: [0, 14], opacity: [1, 0] }}
              transition={{ duration: 1.2, ease: "easeOut", repeat: Infinity, repeatDelay: 0.5 }}
              className="h-1.5 w-1.5 rounded-full bg-brand"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
