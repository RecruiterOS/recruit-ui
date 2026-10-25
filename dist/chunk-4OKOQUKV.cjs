"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/candidate-cover-header.tsx
var _utils = require('@epicbagel/saas-kit/lib/utils');
var _aspectratio = require('@epicbagel/saas-kit/primitives/aspect-ratio');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _jsxruntime = require('react/jsx-runtime');
function CandidateCoverImage({
  children,
  softenUntilHover = false,
  className,
  ...props
}) {
  if (children == null) return null;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _aspectratio.AspectRatio,
    {
      ratio: 4,
      "data-slot": "candidate-cover-image",
      className: _utils.cn.call(void 0,
        "w-full overflow-hidden bg-muted [&_img]:h-full [&_img]:w-full [&_img]:object-cover",
        softenUntilHover && "[&_img]:opacity-75 [&_img]:grayscale-[0.2] group-hover:[&_img]:opacity-100 group-hover:[&_img]:grayscale-0",
        className
      ),
      ...props,
      children
    }
  );
}
function CandidateCoverHeader({
  cover,
  children,
  padding = "card-header",
  softenCoverUntilHover = false,
  className,
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      "data-slot": "candidate-cover-header",
      className: _utils.cn.call(void 0, "overflow-hidden", className),
      ...props,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, CandidateCoverImage, { softenUntilHover: softenCoverUntilHover, children: cover }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _panelsection.PanelSection,
          {
            as: "div",
            padding: padding === "compact" ? "compact" : "default",
            className: _utils.cn.call(void 0, padding === "card-header" && "pb-3 pt-5"),
            children
          }
        )
      ]
    }
  );
}




exports.CandidateCoverImage = CandidateCoverImage; exports.CandidateCoverHeader = CandidateCoverHeader;
