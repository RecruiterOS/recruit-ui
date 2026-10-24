import {
  cn
} from "./chunk-WTFE3OMU.js";

// vendor/core/files/src/primitives/badge.tsx
import { cva } from "class-variance-authority";
import { jsx } from "react/jsx-runtime";
var badgeVariants = cva(
  "inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:border-border dark:focus:ring-ring",
  {
    variants: {
      variant: {
        default: "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Semantic variants for status badges
        success: "border-transparent bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-100/80",
        warning: "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 hover:bg-yellow-100/80",
        error: "border-transparent bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100/80",
        info: "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100/80",
        neutral: "border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100/80"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, weight = "semibold", gap = "xs", size = "default", padding = "default", shrink = false, interactive = false, marginStart = "none", transform = "none", shape = "pill", marginTop = "none", font = "sans", titleCase = "preserve", as, ...props }) {
  const Component = as ?? "div";
  return /* @__PURE__ */ jsx(Component, { "data-slot": "badge", "data-variant": variant ?? "default", "data-size": size, "data-padding": padding, "data-shape": shape, className: cn(
    badgeVariants({ variant }),
    weight === "normal" && "font-normal",
    weight === "bold" && "font-bold",
    gap === "xs" && "gap-1",
    size === "compact" && "px-1.5 py-0.5 text-[11px] leading-none",
    size === "micro" && "text-[10px]",
    size === "micro-compact" && "px-1.5 py-0 text-[10px] leading-none",
    size === "tiny" && "h-3.5 px-1 py-0 text-[9px]",
    size === "counter" && "h-5 min-w-5 justify-center px-1.5",
    size === "tile" && "h-8 w-8 justify-center p-0 text-sm",
    size === "rule" && "px-3 py-1.5 text-sm",
    padding === "roomy" && "px-3 py-1",
    shrink && "shrink-0",
    interactive && "cursor-pointer hover:bg-muted",
    marginStart === "md" && "ml-2",
    transform === "uppercase" && "uppercase tracking-wide",
    shape === "rounded" && "rounded-md",
    marginTop === "tight" && "mt-0.5",
    font === "mono" && "font-mono",
    titleCase === "capitalize" && "capitalize",
    className
  ), ...props });
}

export {
  Badge
};
