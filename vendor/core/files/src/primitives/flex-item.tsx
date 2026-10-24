"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface FlexItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Allow this item to consume the remaining space in a flex layout. */
  grow?: boolean;
  /** Prevent intrinsic content width from overflowing its flex container. */
  minWidth?: "auto" | "zero";
  /** Keep the item from shrinking when adjacent content grows. */
  shrink?: boolean;
  basis?: "auto" | "sm" | "md" | "lg";
  overflow?: "visible" | "hidden" | "y-auto";
  minHeight?: "auto" | "zero";
}

/** A flex child with explicit growth and intrinsic-width behaviour. */
export const FlexItem = forwardRef<HTMLDivElement, FlexItemProps>(
  function FlexItem(
    { grow = false, minWidth = "auto", shrink = true, basis = "auto", overflow = "visible", minHeight = "auto", className, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          grow && "flex-1",
          minWidth === "zero" && "min-w-0",
          !shrink && "shrink-0",
          basis === "sm" && "basis-48",
          basis === "md" && "basis-64",
          basis === "lg" && "basis-80",
          overflow === "hidden" && "overflow-hidden",
          overflow === "y-auto" && "overflow-y-auto overflow-x-hidden",
          minHeight === "zero" && "min-h-0",
          className,
        )}
        {...props}
      />
    );
  },
);
