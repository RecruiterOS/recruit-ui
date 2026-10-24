"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkJIEUQ5CKcjs = require('./chunk-JIEUQ5CK.cjs');


var _chunkRTB3COSUcjs = require('./chunk-RTB3COSU.cjs');


var _chunkR52RM2CDcjs = require('./chunk-R52RM2CD.cjs');


var _chunkYMPXXC7Bcjs = require('./chunk-YMPXXC7B.cjs');

// src/recruit/candidate-quote.tsx
var _jsxruntime = require('react/jsx-runtime');
function CandidateQuote({
  children,
  attribution,
  action,
  lineClamp,
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _chunkR52RM2CDcjs.PanelSection,
    {
      as: "blockquote",
      "data-slot": "candidate-quote",
      padding: "default",
      ...props,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkRTB3COSUcjs.Text, { as: "div", variant: "muted", size: "sm", italic: true, lineClamp, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": true, children: "\u201C" }),
          children,
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": true, children: "\u201D" })
        ] }),
        attribution != null || action != null ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkYMPXXC7Bcjs.Stack, { direction: "horizontal", gap: "compact", align: "center", marginTop: "sm", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkJIEUQ5CKcjs.FlexItem, { grow: true, minWidth: "zero", children: attribution != null ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkRTB3COSUcjs.Text, { as: "span", variant: "caption", size: "xs", tone: "subtle", children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": true, children: "\u2014 " }),
            attribution
          ] }) : null }),
          action
        ] }) : null
      ]
    }
  );
}



exports.CandidateQuote = CandidateQuote;
