"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalContextType = { open: boolean; setOpen: (open: boolean) => void };
const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within <Modal>");
  return ctx;
}

export function Modal({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <ModalContext.Provider value={{ open, setOpen }}>{children}</ModalContext.Provider>;
}

export function ModalTrigger({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  /** Accessible name — the trigger's visible content is decorative artwork. */
  label: string;
}) {
  const { setOpen } = useModal();
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-label={label}
      className={cn("relative overflow-hidden text-center", className)}
      onClick={() => setOpen(true)}
    >
      {children}
    </button>
  );
}

export function ModalBody({ children, className }: { children: ReactNode; className?: string }) {
  const { open, setOpen } = useModal();
  const panel = useRef<HTMLDivElement>(null);

  // Escape closes, and the body stops scrolling behind the dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed inset-0 z-[2000] flex h-full w-full items-center justify-center [perspective:800px] [transform-style:preserve-3d]"
        >
          <button
            aria-label="Close dialog"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/60"
          />

          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            className={cn(
              "relative z-50 flex max-h-[90%] min-h-[50%] flex-1 flex-col overflow-hidden border border-transparent bg-white dark:border-neutral-800 dark:bg-neutral-950 md:max-w-[40%] md:rounded-2xl",
              className
            )}
            initial={{ opacity: 0, scale: 0.5, rotateX: 40, y: 40 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 15 }}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="group absolute right-4 top-4 z-10 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ModalContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-1 flex-col overflow-y-auto p-8 md:p-10", className)}>
      {children}
    </div>
  );
}

export function ModalFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex justify-end border-t border-border bg-gray-100 p-4 dark:bg-neutral-900",
        className
      )}
    >
      {children}
    </div>
  );
}
