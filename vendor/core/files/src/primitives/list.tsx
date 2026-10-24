"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface ListProps extends HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  ordered?: boolean;
  spacing?: "none" | "tight" | "normal";
  marker?: "none" | "disc" | "decimal";
  divided?: boolean;
  inset?: "none" | "xs" | "md";
  guide?: boolean;
  textSize?: "inherit" | "xs" | "sm";
  tone?: "inherit" | "muted" | "soft";
  marginTop?: "none" | "sm" | "md";
  surface?: "none" | "bordered";
  radius?: "none" | "md";
}

const spacingStyles = { none: "", tight: "space-y-1.5", normal: "space-y-3" } as const;
const markerStyles = {
  none: "list-none",
  disc: "list-disc pl-5",
  decimal: "list-decimal pl-5",
} as const;

/** Semantic ordered or unordered list with controlled rhythm and markers. */
export const List = forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(function List(
  { ordered = false, spacing = "none", marker = "none", divided = false, inset = "none", guide = false, textSize = "inherit", tone = "inherit", marginTop = "none", surface = "none", radius = "none", className, ...props },
  ref,
) {
  const Component = ordered ? "ol" : "ul";
  return (
    <Component
      ref={ref as never}
      className={cn(
        spacingStyles[spacing],
        markerStyles[marker],
        divided && "divide-y divide-border",
        inset === "xs" && "pl-1",
        inset === "md" && "pl-4",
        guide && "border-l border-border",
        textSize === "xs" && "text-xs",
        textSize === "sm" && "text-sm",
        tone === "muted" && "text-muted-foreground",
        tone === "soft" && "text-foreground/80",
        marginTop === "sm" && "mt-2",
        marginTop === "md" && "mt-4",
        surface === "bordered" && "border border-border bg-background",
        radius === "md" && "rounded-md",
        className,
      )}
      {...props}
    />
  );
});

export interface ListItemProps extends HTMLAttributes<HTMLLIElement> {
  layout?: "plain" | "row";
  surface?: "none" | "bordered";
  padding?: "none" | "sm" | "compact" | "md";
  textSize?: "inherit" | "xs" | "sm";
  tone?: "inherit" | "soft";
  position?: "static" | "relative";
  justify?: "start" | "between";
  align?: "start" | "center" | "baseline";
  gap?: "none" | "xs" | "sm";
  interactiveGroup?: boolean;
  radius?: "none" | "md";
  accent?: "none" | "success" | "destructive";
}

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem(
  { className, layout = "plain", surface = "none", padding = "none", textSize = "inherit", tone = "inherit", position = "static", justify = "start", align = "start", gap = "xs", interactiveGroup = false, radius = "none", accent = "none", ...props },
  ref,
) {
  return <li ref={ref} className={cn(
    layout === "row" && "flex items-start",
    surface === "bordered" && "rounded-md border",
    padding === "sm" && "p-2", padding === "md" && "px-3 py-2",
    padding === "compact" && "py-2.5",
    textSize === "xs" && "text-xs", textSize === "sm" && "text-sm",
    tone === "soft" && "text-foreground/80",
    position === "relative" && "relative",
    justify === "between" && "justify-between gap-3",
    align === "center" && "items-center",
    align === "baseline" && "items-baseline",
    gap === "xs" && "gap-1.5",
    gap === "sm" && "gap-2",
    interactiveGroup && "group",
    radius === "md" && "rounded-md",
    accent === "success" && "border-l-2 border-emerald-500 bg-emerald-500/5",
    accent === "destructive" && "border-l-2 border-red-500 bg-red-500/5",
    className,
  )} {...props} />;
});
