"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkRTB3COSUcjs = require('./chunk-RTB3COSU.cjs');

// src/recruit/current-company-label.tsx
var _jsxruntime = require('react/jsx-runtime');
function CurrentCompanyLabel({
  company,
  tenure,
  suffix,
  size = "sm",
  tone = "muted",
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _chunkRTB3COSUcjs.Text,
    {
      as: "span",
      "data-slot": "current-company-label",
      variant: "inherit",
      size,
      tone,
      ...props,
      children: [
        company,
        tenure != null ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": true, children: " \xB7 " }),
          tenure
        ] }) : null,
        suffix
      ]
    }
  );
}



exports.CurrentCompanyLabel = CurrentCompanyLabel;
