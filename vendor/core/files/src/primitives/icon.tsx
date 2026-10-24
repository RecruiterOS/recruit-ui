"use client";

import { createElement, type ElementType, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface IconProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  icon: ElementType;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  tone?: "inherit" | "muted" | "primary" | "info" | "success" | "warning" | "destructive" | "disabled";
  spin?: boolean;
  strokeWidth?: number;
  align?: "center" | "start";
  filled?: boolean;
  visibility?: "visible" | "hidden" | "parent-hover";
  marginEnd?: "none" | "md";
  marginStart?: "none" | "sm";
  motion?: "none" | "parent-nudge";
  rotation?: "none" | "half";
  marginBottom?: "none" | "sm" | "md";
}

const sizes = {
  xs: "size-3",
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
  xl: "size-6",
} as const;

const tones = {
  inherit: "text-current",
  muted: "text-muted-foreground",
  primary: "text-primary",
  info: "text-blue-600 dark:text-blue-400",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  destructive: "text-destructive",
  disabled: "text-muted-foreground/40",
} as const;

/** Canonically sized and coloured decorative icon. */
export function Icon({ icon, size = "md", tone = "inherit", spin = false, align = "center", filled = false, visibility = "visible", marginEnd = "none", marginStart = "none", motion = "none", rotation = "none", marginBottom = "none", className, ...props }: IconProps) {
  return createElement(icon, {
    "aria-hidden": true,
    className: cn("shrink-0", typeof size === "number" ? undefined : sizes[size], tones[tone], spin && "animate-spin", align === "start" && "mt-0.5", filled && "fill-current", visibility === "hidden" && "opacity-0", visibility === "parent-hover" && "opacity-0 transition-opacity group-hover:opacity-100", marginEnd === "md" && "mr-2", marginStart === "sm" && "ml-1", motion === "parent-nudge" && "transition-transform duration-200 ease-out group-hover:translate-x-1", rotation === "half" && "rotate-180 transition-transform", marginBottom === "sm" && "mb-2", marginBottom === "md" && "mb-3", className),
    ...(typeof size === "number" ? { size } : {}),
    ...props,
  });
}
