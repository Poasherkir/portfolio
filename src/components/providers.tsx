"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "./ui/tooltip";
import { Toaster } from "./ui/toaster";
import Preloader from "./preloader";

export function Providers({ children }: { children: ReactNode }) {
  return (
    // Light by default, regardless of the OS setting.
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
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
