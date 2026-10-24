"use client";

import { forwardRef, type ElementType, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

/**
 * Stack — flex container with a canonical gap scale.
 *
 * Consumers stop guessing between `gap-2`, `gap-3`, `gap-4`, etc.
 * Five sizes map to the shared spacing scale from no gap through large.
 */
type StackGap = "none" | "xs" | "sm" | "compact" | "md" | "lg";
type StackDirection = "vertical" | "horizontal";

interface StackProps extends HTMLAttributes<HTMLElement> {
  gap?: StackGap;
  direction?: StackDirection;
  reverse?: boolean;
  /** Cross-axis alignment (defaults to stretch). */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  /** Main-axis distribution. */
  justify?: "start" | "center" | "end" | "between";
  /** Allow children to wrap onto additional lines. */
  wrap?: boolean;
  grow?: boolean;
  shrink?: boolean;
  minWidth?: "auto" | "zero";
  minHeight?: "auto" | "zero";
  height?: "auto" | "full";
  overflow?: "visible" | "hidden" | "auto" | "x-auto" | "y-auto";
  marginTop?: "none" | "xs" | "sm" | "md" | "lg";
  marginBottom?: "none" | "md" | "lg";
  marginEnd?: "none" | "negative-xs";
  marginStart?: "none" | "auto";
  overlap?: "none" | "sm";
  padding?: "none" | "xs" | "sm" | "control" | "compact" | "md" | "lg" | "action-row" | "card-header" | "card-footer";
  paddingX?: "none" | "md" | "lg";
  paddingY?: "none" | "sm" | "compact" | "section" | "md" | "lg" | "xl" | "hero";
  paddingTop?: "none" | "tight" | "md" | "base" | "lg" | "safe";
  paddingBottom?: "none" | "sm" | "md";
  border?: "none" | "top" | "bottom" | "dashed";
  tone?: "inherit" | "muted" | "subtle" | "primary" | "warning" | "destructive";
  textSize?: "inherit" | "xs" | "sm";
  surface?: "none" | "background" | "card" | "muted";
  radius?: "none" | "md" | "lg" | "xl";
  width?: "auto" | "fit" | "full";
  textAlign?: "start" | "center";
  columnGap?: "none" | "md";
  rowGap?: "none" | "xs";
  font?: "sans" | "mono";
  transform?: "none" | "uppercase";
  tracking?: "normal" | "wide";
  maxWidth?: "none" | "xl";
  maxHeight?: "none" | "viewport";
  centered?: boolean;
  opacity?: "full" | "soft";
  interaction?: "none" | "group" | "hover-accent" | "group-hover-accent";
  selected?: boolean;
  divided?: boolean;
  gridSpan?: "auto" | "full";
  /** Semantic element used for the stack. */
  as?: ElementType;
}

const gapStyles: Record<StackGap, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  compact: "gap-3",
  md: "gap-4",
  lg: "gap-6",
};

const directionStyles: Record<StackDirection, string> = {
  vertical: "flex flex-col",
  horizontal: "flex flex-row",
};

const alignStyles = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
} as const;

const justifyStyles = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const;

export const Stack = forwardRef<HTMLElement, StackProps>(
  function Stack({
    gap = "md",
    direction = "vertical",
    reverse = false,
    align = "stretch",
    justify = "start",
    wrap = false,
    grow = false,
    shrink = true,
    minWidth = "auto",
    minHeight = "auto",
    height = "auto",
    overflow = "visible",
    marginTop = "none",
    marginBottom = "none",
    marginEnd = "none",
    marginStart = "none",
    overlap = "none",
    padding = "none",
    paddingX = "none",
    paddingY = "none",
    paddingTop = "none",
    paddingBottom = "none",
    border = "none",
    tone = "inherit",
    textSize = "inherit",
    surface = "none",
    radius = "none",
    width = "auto",
    textAlign = "start",
    columnGap = "none",
    rowGap = "none",
    font = "sans",
    transform = "none",
    tracking = "normal",
    maxWidth = "none",
    maxHeight = "none",
    centered = false,
    opacity = "full",
    interaction = "none",
    selected = false,
    divided = false,
    gridSpan = "auto",
    as,
    className,
    ...props
  }, ref) {
    const Component = (as ?? "div") as ElementType;
    return (
      <Component
        ref={ref}
        className={cn(
          directionStyles[direction],
          reverse && (direction === "horizontal" ? "flex-row-reverse" : "flex-col-reverse"),
          gapStyles[gap],
          alignStyles[align],
          justifyStyles[justify],
          wrap && "flex-wrap",
          grow && "flex-1",
          !shrink && "shrink-0",
          minWidth === "zero" && "min-w-0",
          minHeight === "zero" && "min-h-0",
          height === "full" && "h-full",
          overflow === "hidden" && "overflow-hidden",
          overflow === "auto" && "overflow-auto",
          overflow === "x-auto" && "overflow-x-auto",
          overflow === "y-auto" && "overflow-y-auto",
          marginTop === "xs" && "mt-1",
          marginTop === "sm" && "mt-2",
          marginTop === "md" && "mt-4",
          marginTop === "lg" && "mt-6",
          marginBottom === "md" && "mb-3",
          marginBottom === "lg" && "mb-8",
          marginEnd === "negative-xs" && "-mr-1",
          marginStart === "auto" && "ml-auto",
          overlap === "sm" && "-space-x-2",
          padding === "xs" && "p-[10px]",
          padding === "sm" && "p-[14px]",
          padding === "control" && "px-3 py-2",
          padding === "compact" && "p-3",
          padding === "md" && "p-[22px]",
          padding === "lg" && "p-[26px]",
          padding === "action-row" && "px-4 py-3",
          padding === "card-header" && "px-5 pt-5 pb-2",
          padding === "card-footer" && "px-5 pb-2",
          paddingX === "md" && "px-[22px]",
          paddingX === "lg" && "px-[26px]",
          paddingY === "sm" && "py-[14px]",
          paddingY === "compact" && "py-2.5",
          paddingY === "section" && "py-3",
          paddingY === "md" && "py-[22px]",
          paddingY === "lg" && "py-[26px]",
          paddingY === "xl" && "py-8",
          paddingY === "hero" && "py-24",
          paddingTop === "tight" && "pt-0.5",
          paddingTop === "md" && "pt-3",
          paddingTop === "base" && "pt-4",
          paddingTop === "lg" && "pt-5",
          paddingTop === "safe" && "pt-[max(env(safe-area-inset-top),0.75rem)]",
          paddingBottom === "sm" && "pb-2",
          paddingBottom === "md" && "pb-3",
          border === "top" && "border-t",
          border === "bottom" && "border-b",
          border === "dashed" && "border border-dashed",
          tone === "muted" && "text-muted-foreground",
          tone === "subtle" && "text-muted-foreground/70",
          tone === "primary" && "text-primary",
          tone === "warning" && "text-amber-700 dark:text-amber-400",
          tone === "destructive" && "text-destructive",
          textSize === "xs" && "text-xs",
          textSize === "sm" && "text-sm",
          surface === "background" && "bg-background",
          surface === "card" && "border bg-card",
          surface === "muted" && "border bg-muted/40",
          radius === "md" && "rounded-md",
          radius === "lg" && "rounded-lg",
          radius === "xl" && "rounded-xl",
          width === "full" && "w-full",
          width === "fit" && "inline-flex w-fit",
          textAlign === "center" && "text-center",
          columnGap === "md" && "gap-x-3",
          rowGap === "xs" && "gap-y-1",
          font === "mono" && "font-mono",
          transform === "uppercase" && "uppercase",
          tracking === "wide" && "tracking-[0.18em]",
          maxWidth === "xl" && "max-w-xl",
          maxHeight === "viewport" && "max-h-[60vh]",
          centered && "mx-auto",
          opacity === "soft" && "opacity-70",
          interaction === "group" && "group",
          interaction === "hover-accent" && "transition-colors hover:bg-accent/40",
          interaction === "group-hover-accent" && "group transition-colors hover:bg-accent/40",
          selected && "border-foreground",
          divided && "divide-y",
          gridSpan === "full" && "sm:col-span-full",
          className,
        )}
        {...props}
      />
    );
  },
);
