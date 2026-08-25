"use client";

import type { ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

/** Client island so the CV page itself can stay a server component. */
export default function PrintButton({
  children,
  variant = "outline",
}: {
  children: ReactNode;
  variant?: ButtonProps["variant"];
}) {
  return (
    <Button type="button" variant={variant} onClick={() => window.print()}>
      {children}
    </Button>
  );
}
