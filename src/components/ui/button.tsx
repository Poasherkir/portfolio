import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-full text-sm font-medium tracking-[-0.005em]",
    // Only the compositor-friendly properties animate.
    "transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    // Press is a real depression, not a colour change.
    "active:scale-[0.98] active:translate-y-px",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    // Arrows lead on hover, wherever a button has one.
    "[&_svg:last-child]:transition-transform [&_svg:last-child]:duration-300",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary — the one red button on a screen. Lifts on hover.
        default: [
          "bg-brand text-brand-foreground",
          "shadow-[0_1px_2px_hsl(var(--brand)/0.28),0_10px_28px_-12px_hsl(var(--brand)/0.7)]",
          "hover:-translate-y-0.5 hover:shadow-[0_2px_4px_hsl(var(--brand)/0.3),0_18px_38px_-14px_hsl(var(--brand)/0.85)]",
          "group-hover/btn:[&_svg:last-child]:translate-x-0.5",
        ].join(" "),
        // Secondary — ink on paper, borders only. Never red.
        outline: [
          "border border-foreground/15 bg-transparent text-foreground",
          "hover:border-foreground/40 hover:bg-foreground/[0.03]",
        ].join(" "),
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        ghost: "hover:bg-foreground/[0.04] hover:text-foreground",
        // Text link — a rule that fills in from the left on hover.
        link: [
          "h-auto rounded-none px-0 text-foreground",
          "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left",
          "after:scale-x-100 after:bg-foreground/25 after:transition-[transform,background-color] after:duration-300",
          "hover:text-brand hover:after:bg-brand",
        ].join(" "),
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-[0.8rem]",
        lg: "h-13 px-8 text-[0.95rem]",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
