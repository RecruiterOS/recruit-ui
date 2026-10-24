"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunk42BCVSWNcjs = require('./chunk-42BCVSWN.cjs');

// vendor/core/files/src/primitives/flex-item.tsx
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var FlexItem = _react.forwardRef.call(void 0,
  function FlexItem2({ grow = false, minWidth = "auto", shrink = true, basis = "auto", overflow = "visible", minHeight = "auto", className, ...props }, ref) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      "div",
      {
        ref,
        className: _chunk42BCVSWNcjs.cn.call(void 0,
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



exports.FlexItem = FlexItem;
