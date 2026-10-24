import {
  cn
} from "./chunk-WTFE3OMU.js";

// vendor/core/files/src/primitives/stack.tsx
import { forwardRef } from "react";
import { jsx } from "react/jsx-runtime";
var gapStyles = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  compact: "gap-3",
  md: "gap-4",
  lg: "gap-6"
};
var directionStyles = {
  vertical: "flex flex-col",
  horizontal: "flex flex-row"
};
var alignStyles = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline"
};
var justifyStyles = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between"
};
var Stack = forwardRef(
  function Stack2({
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
    const Component = as ?? "div";
    return /* @__PURE__ */ jsx(
      Component,
      {
        ref,
        className: cn(
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
          className
        ),
        ...props
      }
    );
  }
);

export {
  Stack
};
