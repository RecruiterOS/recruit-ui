"use client";

import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type AnchorHTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface AnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "unstyled" | "text" | "muted" | "foreground";
  size?: "inherit" | "xs" | "sm";
  display?: "inline" | "inline-flex" | "block";
  underline?: boolean;
  asChild?: boolean;
  border?: "none" | "bottom";
  weight?: "normal" | "medium";
}

/** Router-agnostic native anchor owned by the design system. */
export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(function Anchor(
  { variant = "unstyled", size = "inherit", display = "inline", underline = false, asChild = false, border = "none", weight = "normal", className, ...props },
  ref,
) {
  const Component = asChild ? Slot : "a";
  return (
    <Component
      ref={ref}
      className={cn(
        variant === "text" && "font-medium text-primary underline-offset-4 hover:underline",
        variant === "muted" && "text-muted-foreground underline underline-offset-2 hover:text-foreground",
        variant === "foreground" && "text-foreground underline-offset-2 hover:underline",
        size === "xs" && "text-xs",
        size === "sm" && "text-sm",
        display === "inline-flex" && "inline-flex items-center gap-1",
        display === "block" && "block",
        border === "bottom" && "border-b last:border-b-0",
        weight === "medium" && "font-medium",
        underline && "underline",
        className,
      )}
      {...props}
    />
  );
});
