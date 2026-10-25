"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/recruit/candidate-job-evidence.tsx
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _jsxruntime = require('react/jsx-runtime');
function CandidateJobEvidence({
  sourced,
  feedback,
  padding = "compact",
  border = "none",
  ...props
}) {
  if (!sourced && !feedback) return null;
  const byline = _optionalChain([feedback, 'optionalAccess', _ => _.byline]);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _panelsection.PanelSection, { "data-slot": "candidate-job-evidence", padding, border, ...props, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "sm", children: [
    sourced && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", weight: "semibold", children: sourced.title }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", whitespace: "pre-wrap", children: sourced.text })
    ] }),
    feedback && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", weight: "semibold", children: feedback.title }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", whitespace: "pre-wrap", children: feedback.text }),
      byline != null && byline !== false && byline !== "" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "xs", tone: "muted", children: byline })
    ] })
  ] }) });
}



exports.CandidateJobEvidence = CandidateJobEvidence;
