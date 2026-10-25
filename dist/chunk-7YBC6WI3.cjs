"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/recruit/candidate-pending-note.tsx
var _agentcomment = require('@epicbagel/saas-kit/primitives/agent-comment');
var _callout = require('@epicbagel/saas-kit/primitives/callout');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _jsxruntime = require('react/jsx-runtime');
function CandidatePendingNote({
  text,
  timeLabel,
  agent,
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _stack.Stack,
    {
      "data-slot": "candidate-pending-note",
      direction: "vertical",
      gap: "xs",
      padding: "card-footer",
      ...props,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _callout.Callout, { tone: "warning", padding: "compact", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { size: "sm", italic: true, tone: "warning", children: [
          "\u201C",
          text,
          "\u201D",
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { variant: "inherit", as: "span", size: "xs", italic: false, marginStart: "sm", children: [
            "\u2014 ",
            timeLabel
          ] })
        ] }) }),
        _optionalChain([agent, 'optionalAccess', _ => _.thinking]) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _agentcomment.AgentComment, { agent: agent.name, thinking: true, children: "" }) : _optionalChain([agent, 'optionalAccess', _2 => _2.message]) != null && agent.message !== false && agent.message !== "" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _agentcomment.AgentComment, { agent: agent.name, children: agent.message }) : null
      ]
    }
  );
}



exports.CandidatePendingNote = CandidatePendingNote;
