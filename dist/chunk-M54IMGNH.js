import {
  cn
} from "./chunk-WTFE3OMU.js";

// vendor/core/files/src/primitives/heading.tsx
import { forwardRef } from "react";
import { jsx } from "react/jsx-runtime";
var levelStyles = {
  // Page title (e.g. "Candidates", "Settings"). One per page.
  1: "text-2xl md:text-3xl font-semibold tracking-tight leading-tight",
  // Section title within a page.
  2: "text-xl md:text-2xl font-semibold tracking-tight leading-tight",
  // Card title.
  3: "text-lg font-semibold leading-snug",
  // Subsection / minor heading.
  4: "text-base font-semibold leading-snug",
  // Inline emphasis heading.
  5: "text-sm font-semibold leading-snug",
  // Eyebrow-style heading (uppercase, tracked). For all-caps labels
  // above a heading, prefer the dedicated <Eyebrow> primitive.
  6: "text-xs font-semibold uppercase tracking-[0.12em] leading-snug"
};
var Heading = forwardRef(
  function Heading2({ level = 1, appearance = "default", spacing = "none", truncate = false, as, className, ...props }, ref) {
    const Tag = as ?? `h${level}`;
    return /* @__PURE__ */ jsx(
      Tag,
      {
        ref,
        className: cn(
          appearance === "default" && levelStyles[level],
          appearance === "compact" && "text-sm font-medium leading-snug",
          appearance === "compact-strong" && "text-sm font-semibold leading-snug",
          appearance === "eyebrow" && "text-xs font-semibold uppercase tracking-[0.12em] leading-snug text-muted-foreground",
          appearance === "section" && "text-lg font-semibold leading-snug",
          spacing === "section" && "mt-8 mb-2",
          spacing === "after-xs" && "mb-1",
          spacing === "after" && "mb-2",
          spacing === "after-lg" && "mb-8",
          truncate && "truncate",
          className
        ),
        ...props
      }
    );
  }
);

export {
  Heading
};
