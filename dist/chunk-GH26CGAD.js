import {
  cn
} from "./chunk-WTFE3OMU.js";

// vendor/core/files/src/primitives/flex-item.tsx
import { forwardRef } from "react";
import { jsx } from "react/jsx-runtime";
var FlexItem = forwardRef(
  function FlexItem2({ grow = false, minWidth = "auto", shrink = true, basis = "auto", overflow = "visible", minHeight = "auto", className, ...props }, ref) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: cn(
          grow && "flex-1",
          minWidth === "zero" && "min-w-0",
          !shrink && "shrink-0",
          basis === "sm" && "basis-48",
          basis === "md" && "basis-64",
          basis === "lg" && "basis-80",
          overflow === "hidden" && "overflow-hidden",
          overflow === "y-auto" && "overflow-y-auto overflow-x-hidden",
          minHeight === "zero" && "min-h-0",
          className
        ),
        ...props
      }
    );
  }
);

export {
  FlexItem
};
