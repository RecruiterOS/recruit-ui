"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/candidate-cover-header.tsx
var _utils = require('@epicbagel/saas-kit/lib/utils');
var _aspectratio = require('@epicbagel/saas-kit/primitives/aspect-ratio');
var _coverbanner = require('@epicbagel/saas-kit/primitives/cover-banner');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _jsxruntime = require('react/jsx-runtime');
function CandidateCoverImage({
  children,
  size = "default",
  softenUntilHover = false,
  className,
  ...props
}) {
  if (children == null) return null;
  const frameProps = {
    "data-slot": "candidate-cover-image",
    className: _utils.cn.call(void 0,
      "w-full overflow-hidden bg-muted [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:object-center",
      size === "compact" && "relative aspect-[4/1] max-h-[96px]",
      softenUntilHover && "[&_img]:opacity-75 [&_img]:grayscale-[0.2] group-hover:[&_img]:opacity-100 group-hover:[&_img]:grayscale-0",
      className
    ),
    ...props
  };
  return size === "compact" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { ...frameProps, children }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _aspectratio.AspectRatio, { ratio: 4, ...frameProps, children });
}
function candidateCoverSeed(seed, name) {
  if (seed !== void 0) return seed;
  return typeof name === "string" || typeof name === "number" ? name : null;
}
var DIALOG_PADDING = "p-4";
function CandidateCoverHeader({
  cover,
  coverFallback = "none",
  coverSeed,
  coverSize = "default",
  children,
  padding = "card-header",
  softenCoverUntilHover = false,
  className,
  ...props
}) {
  const stock = cover === void 0 && coverFallback === "stock";
  const media = stock ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _coverbanner.CoverBanner, { seed: coverSeed }) : cover;
  const clip = media != null || padding !== "none";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      "data-slot": "candidate-cover-header",
      className: _utils.cn.call(void 0, clip && "overflow-hidden", className),
      ...props,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          CandidateCoverImage,
          {
            size: coverSize,
            softenUntilHover: softenCoverUntilHover,
            className: stock ? "print:hidden" : void 0,
            children: media
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _panelsection.PanelSection,
          {
            as: "div",
            padding: padding === "none" || padding === "dialog" ? "none" : padding === "compact" ? "compact" : "default",
            className: _utils.cn.call(void 0, padding === "card-header" && "pb-3 pt-5", padding === "dialog" && DIALOG_PADDING),
            children
          }
        )
      ]
    }
  );
}





exports.CandidateCoverImage = CandidateCoverImage; exports.candidateCoverSeed = candidateCoverSeed; exports.CandidateCoverHeader = CandidateCoverHeader;
