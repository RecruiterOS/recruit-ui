"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/recruit/candidate-decision-summary.tsx
var _badge = require('@epicbagel/saas-kit/primitives/badge');
var _card = require('@epicbagel/saas-kit/primitives/card');
var _flexitem = require('@epicbagel/saas-kit/primitives/flex-item');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _statusicontile = require('@epicbagel/saas-kit/primitives/status-icon-tile');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
var _jsxruntime = require('react/jsx-runtime');
function CandidateDecisionSummary({
  decision,
  assessment,
  ...props
}) {
  if (!decision && !assessment) return null;
  const positive = _optionalChain([decision, 'optionalAccess', _ => _.tone]) === "positive";
  const reason = _optionalChain([decision, 'optionalAccess', _2 => _2.reason]);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _panelsection.PanelSection, { "data-slot": "candidate-decision-summary", border: "bottom", surface: "muted", ...props, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _card.Card, { overflow: "hidden", children: [
    decision && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "start", padding: "compact", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _statusicontile.StatusIconTile, { icon: _lucidereact.Flag, tone: positive ? "success" : "destructive" }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _flexitem.FlexItem, { minWidth: "zero", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "eyebrow", weight: "semibold", children: decision.heading }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "xs", marginTop: "xs", align: "baseline", textSize: "sm", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "inherit", as: "span", weight: "semibold", tone: positive ? "success" : "destructive", children: decision.verdict }),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { variant: "inherit", as: "span", tone: "muted", children: [
            "\xB7 ",
            decision.stage
          ] })
        ] }),
        reason != null && reason !== false && reason !== "" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "muted", marginTop: "tight", whitespace: "pre-wrap", children: reason })
      ] })
    ] }),
    assessment && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
      _stack.Stack,
      {
        direction: "horizontal",
        gap: "compact",
        align: "start",
        paddingX: "md",
        paddingY: "section",
        border: decision ? "top" : "none",
        children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _badge.Badge,
            {
              variant: assessment.tone,
              size: "tile",
              shape: "rounded",
              weight: "bold",
              shrink: true,
              marginTop: "tight",
              title: assessment.title,
              children: assessment.letter
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _flexitem.FlexItem, { minWidth: "zero", children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "eyebrow", weight: "semibold", children: assessment.heading }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "muted", marginTop: "tight", children: assessment.label })
          ] })
        ]
      }
    )
  ] }) });
}



exports.CandidateDecisionSummary = CandidateDecisionSummary;
