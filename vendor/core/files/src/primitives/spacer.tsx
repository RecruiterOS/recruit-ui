"use client";

import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface SpacerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  paddingBottom?: "none" | "sm";
}

const sizes = {
  xs: "h-1",
  sm: "h-2",
  md: "h-3",
  lg: "h-6",
  xl: "h-24",
} as const;

/** Intentional vertical whitespace on the shared spacing scale. */
export function Spacer({ size = "md", paddingBottom = "none", className, "aria-hidden": ariaHidden = true, ...props }: SpacerProps) {
  return <div aria-hidden={ariaHidden} className={cn(sizes[size], paddingBottom === "sm" && "pb-2", className)} {...props} />;
}
