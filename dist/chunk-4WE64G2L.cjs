"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkK3VUGGWHcjs = require('./chunk-K3VUGGWH.cjs');


var _chunk4OKOQUKVcjs = require('./chunk-4OKOQUKV.cjs');

// src/recruit/candidate-pipeline-card.tsx
var _flexitem = require('@epicbagel/saas-kit/primitives/flex-item');
var _interactivecard = require('@epicbagel/saas-kit/primitives/interactive-card');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _jsxruntime = require('react/jsx-runtime');
function shown(node) {
  return node != null && node !== false && node !== "";
}
function CandidatePipelineCard({
  name,
  headline,
  company,
  cover,
  badges,
  actions,
  onSelect,
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _interactivecard.InteractiveCard,
    {
      radius: "lg",
      textSize: "sm",
      onClick: (event) => {
        if (_chunkK3VUGGWHcjs.shouldActivateCandidateCard.call(void 0, event)) onSelect();
      },
      clip: true,
      "data-slot": "candidate-pipeline-card",
      ...props,
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk4OKOQUKVcjs.CandidateCoverHeader, { cover, padding: "compact", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "xs", align: "start", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _flexitem.FlexItem, { grow: true, minWidth: "zero", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "none", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { weight: "medium", truncate: true, children: name }),
          shown(headline) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "xs", tone: "muted", truncate: true, marginTop: "tight", children: headline }) : null,
          company,
          shown(badges) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "horizontal", gap: "xs", align: "center", marginTop: "sm", children: badges }) : null
        ] }) }),
        actions
      ] }) })
    }
  );
}



exports.CandidatePipelineCard = CandidatePipelineCard;
