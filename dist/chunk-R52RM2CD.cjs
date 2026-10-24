"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }

var _chunk42BCVSWNcjs = require('./chunk-42BCVSWN.cjs');

// vendor/core/files/src/primitives/panel-section.tsx
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
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
var PanelSection = _react.forwardRef.call(void 0,
  function PanelSection2({ as, border = "none", padding = "default", paddingX = "none", paddingTop = "none", paddingBottom = "none", paddingY = "none", surface = "default", layout = "block", gap = "none", shrink = true, className, ...props }, ref) {
    const Component = _nullishCoalesce(as, () => ( "section"));
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      Component,
      {
        ref,
        className: _chunk42BCVSWNcjs.cn.call(void 0,
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



exports.PanelSection = PanelSection;
