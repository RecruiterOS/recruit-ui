"use client";

import { forwardRef, type ElementType, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface PanelSectionProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  border?: "none" | "top" | "bottom";
  padding?: "none" | "compact" | "default";
  paddingX?: "none" | "md" | "lg";
  paddingTop?: "none" | "sm" | "md" | "lg";
  paddingBottom?: "none" | "xs" | "sm" | "md" | "lg";
  paddingY?: "none" | "xl";
  surface?: "default" | "muted";
  layout?: "block" | "row";
  gap?: "none" | "sm";
  shrink?: boolean;
}

const borders = {
  none: "",
  top: "border-t",
  bottom: "border-b",
} as const;

const paddings = {
  none: "",
  compact: "px-[22px] py-[18px]",
  default: "px-[26px] py-[26px]",
} as const;

/** A consistently padded, optionally divided section inside a panel or drawer. */
export const PanelSection = forwardRef<HTMLElement, PanelSectionProps>(
  function PanelSection(
    { as, border = "none", padding = "default", paddingX = "none", paddingTop = "none", paddingBottom = "none", paddingY = "none", surface = "default", layout = "block", gap = "none", shrink = true, className, ...props },
    ref,
  ) {
    const Component = (as ?? "section") as ElementType;
    return (
      <Component
        ref={ref}
        className={cn(
          borders[border], paddings[padding],
          paddingX === "md" && "px-[22px]", paddingX === "lg" && "px-[26px]",
          paddingTop === "sm" && "pt-2", paddingTop === "md" && "pt-3",
          paddingTop === "lg" && "pt-5",
          paddingBottom === "xs" && "pb-1", paddingBottom === "sm" && "pb-2", paddingBottom === "md" && "pb-3",
          paddingBottom === "lg" && "pb-4",
          paddingY === "xl" && "py-12",
          surface === "muted" && "bg-muted/40",
          layout === "row" && "flex",
          gap === "sm" && "gap-2",
          !shrink && "shrink-0",
          className,
        )}
        {...props}
      />
    );
  },
);
