"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _chunkR52RM2CDcjs = require('./chunk-R52RM2CD.cjs');


var _chunk42BCVSWNcjs = require('./chunk-42BCVSWN.cjs');

// vendor/core/files/src/primitives/aspect-ratio.tsx
var _reactaspectratio = require('@radix-ui/react-aspect-ratio'); var AspectRatioPrimitive = _interopRequireWildcard(_reactaspectratio);
var AspectRatio = AspectRatioPrimitive.Root;

// src/recruit/candidate-cover-header.tsx
var _jsxruntime = require('react/jsx-runtime');
function CandidateCoverImage({
  children,
  softenUntilHover = false,
  className,
  ...props
}) {
  if (children == null) return null;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    AspectRatio,
    {
      ratio: 4,
      "data-slot": "candidate-cover-image",
      className: _chunk42BCVSWNcjs.cn.call(void 0,
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
      className: _chunk42BCVSWNcjs.cn.call(void 0, "overflow-hidden", className),
      ...props,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, CandidateCoverImage, { softenUntilHover: softenCoverUntilHover, children: cover }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkR52RM2CDcjs.PanelSection,
          {
            as: "div",
            padding: padding === "compact" ? "compact" : "default",
            className: _chunk42BCVSWNcjs.cn.call(void 0, padding === "card-header" && "pb-3 pt-5"),
            children
          }
        )
      ]
    }
  );
}




exports.CandidateCoverImage = CandidateCoverImage; exports.CandidateCoverHeader = CandidateCoverHeader;
