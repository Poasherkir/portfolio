"use client";

/**
 * Minimal toast store. Deliberately smaller than the shadcn original: this site
 * only ever shows one toast at a time (contact form success/failure).
 */
import * as React from "react";
import type { ToastProps } from "./toast";

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
};

const TOAST_DURATION = 5000;

let count = 0;
const genId = () => String(++count);

type State = { toasts: ToasterToast[] };
let memoryState: State = { toasts: [] };
const listeners = new Set<(state: State) => void>();

function setState(next: State) {
  memoryState = next;
  listeners.forEach((l) => l(memoryState));
}

function dismiss(id: string) {
  setState({ toasts: memoryState.toasts.filter((t) => t.id !== id) });
}

export function toast(props: Omit<ToasterToast, "id">) {
  const id = genId();
  setState({ toasts: [{ ...props, id }] });
  setTimeout(() => dismiss(id), TOAST_DURATION);
  return { id, dismiss: () => dismiss(id) };
}

export function useToast() {
  const [state, setLocal] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.add(setLocal);
    return () => {
      listeners.delete(setLocal);
    };
  }, []);

  return { ...state, toast, dismiss };
}
