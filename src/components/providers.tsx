"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "./ui/tooltip";
import { Toaster } from "./ui/toaster";
import Preloader from "./preloader";

export function Providers({ children }: { children: ReactNode }) {
  return (
    // Dark is the default outright rather than "whatever the OS says" — the
    // light theme exists for people who go and ask for it.
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <TooltipProvider delayDuration={200}>
        <Preloader>{children}</Preloader>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}
