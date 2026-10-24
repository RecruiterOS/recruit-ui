import {
  cn
} from "./chunk-WTFE3OMU.js";

// vendor/core/files/src/primitives/panel-section.tsx
import { forwardRef } from "react";
import { jsx } from "react/jsx-runtime";
var borders = {
  none: "",
  top: "border-t",
  bottom: "border-b"
};
var paddings = {
  none: "",
  compact: "px-[22px] py-[18px]",
  default: "px-[26px] py-[26px]"
};
var PanelSection = forwardRef(
  function PanelSection2({ as, border = "none", padding = "default", paddingX = "none", paddingTop = "none", paddingBottom = "none", paddingY = "none", surface = "default", layout = "block", gap = "none", shrink = true, className, ...props }, ref) {
    const Component = as ?? "section";
    return /* @__PURE__ */ jsx(
      Component,
      {
        ref,
        className: cn(
          borders[border],
          paddings[padding],
          paddingX === "md" && "px-[22px]",
          paddingX === "lg" && "px-[26px]",
          paddingTop === "sm" && "pt-2",
          paddingTop === "md" && "pt-3",
          paddingTop === "lg" && "pt-5",
          paddingBottom === "xs" && "pb-1",
          paddingBottom === "sm" && "pb-2",
          paddingBottom === "md" && "pb-3",
          paddingBottom === "lg" && "pb-4",
          paddingY === "xl" && "py-12",
          surface === "muted" && "bg-muted/40",
          layout === "row" && "flex",
          gap === "sm" && "gap-2",
          !shrink && "shrink-0",
          className
        ),
        ...props
      }
    );
  }
);

export {
  PanelSection
};
