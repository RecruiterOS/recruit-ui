import {
  cn
} from "./chunk-WTFE3OMU.js";

// vendor/core/files/src/primitives/text.tsx
import { forwardRef } from "react";
import { jsx } from "react/jsx-runtime";
var variantStyles = {
  default: "text-base leading-relaxed",
  muted: "text-base leading-relaxed text-muted-foreground",
  lead: "text-lg leading-relaxed",
  small: "text-sm leading-relaxed",
  caption: "text-sm leading-relaxed text-muted-foreground",
  micro: "text-[11px] leading-snug",
  eyebrow: "font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground",
  inherit: ""
};
var sizeStyles = { inherit: "", micro: "text-[11px]", xs: "text-xs", sm: "text-sm", base: "text-base", lg: "text-lg" };
var toneStyles = { inherit: "", muted: "text-muted-foreground", subtle: "text-muted-foreground/60", soft: "text-foreground/90", primary: "text-primary", success: "text-emerald-600 dark:text-emerald-400", warning: "text-amber-600 dark:text-amber-400", destructive: "text-destructive" };
var weightStyles = { normal: "font-normal", medium: "font-medium", semibold: "font-semibold" };
var displayStyles = { inline: "inline", block: "block", "inline-flex": "inline-flex items-center gap-1.5" };
var leadingStyles = { normal: "leading-relaxed", none: "leading-none", snug: "leading-snug" };
var Text = forwardRef(
  function Text2({ variant = "default", size = "inherit", tone = "inherit", weight = "normal", display, truncate, grow = false, minWidth = "auto", font = "sans", align = "start", transform = "none", whitespace = "normal", marginTop = "none", marginBottom = "none", marginStart = "none", padding = "none", paddingY = "none", marginEnd = "none", italic = false, shrink = true, lineClamp, responsiveVisibility = "always", opacity = "full", marginTopNegative = "none", paddingX = "none", numeric = "normal", leading = "normal", decoration = "none", maxWidth = "none", as, className, ...props }, ref) {
    const Tag = as ?? "p";
    return /* @__PURE__ */ jsx(Tag, { ref, className: cn(
      variantStyles[variant],
      sizeStyles[size],
      (leading !== "normal" || variant !== "inherit") && leadingStyles[leading],
      toneStyles[tone],
      weightStyles[weight],
      display && displayStyles[display],
      truncate && "truncate",
      grow && "flex-1",
      minWidth === "zero" && "min-w-0",
      font === "mono" && "font-mono",
      align === "center" && "text-center",
      align === "end" && "text-right",
      transform === "uppercase" && "uppercase",
      transform === "capitalize" && "capitalize",
      whitespace === "pre-wrap" && "whitespace-pre-wrap",
      whitespace === "pre-line" && "whitespace-pre-line",
      whitespace === "nowrap" && "whitespace-nowrap",
      marginTop === "tight" && "mt-0.5",
      marginTop === "xs" && "mt-1",
      marginTop === "sm" && "mt-2",
      marginTop === "md" && "mt-4",
      marginTop === "lg" && "mt-6",
      marginBottom === "xs" && "mb-1",
      marginBottom === "sm" && "mb-2",
      marginBottom === "md" && "mb-4",
      marginBottom === "lg" && "mb-6",
      marginStart === "sm" && "ml-1.5",
      padding === "md" && "p-4",
      paddingY === "sm" && "py-2",
      paddingY === "lg" && "py-6",
      marginEnd === "xs" && "mr-0.5",
      marginEnd === "md" && "mr-2",
      italic && "italic",
      !shrink && "shrink-0",
      lineClamp === 1 && "line-clamp-1",
      lineClamp === 2 && "line-clamp-2",
      lineClamp === 3 && "line-clamp-3",
      responsiveVisibility === "desktop" && "hidden sm:inline",
      opacity === "soft" && "opacity-70",
      marginTopNegative === "xs" && "-mt-1",
      paddingX === "sm" && "px-2",
      paddingX === "md" && "px-3",
      numeric === "tabular" && "tabular-nums",
      decoration === "line-through" && "line-through",
      maxWidth === "sm" && "max-w-36",
      maxWidth === "md" && "max-w-md",
      maxWidth === "lg" && "max-w-lg",
      className
    ), ...props });
  }
);

export {
  Text
};
