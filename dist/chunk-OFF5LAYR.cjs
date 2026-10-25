"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/recruit/candidate-decision-buttons.tsx
var _button = require('@epicbagel/saas-kit/primitives/button');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _lucidereact = require('lucide-react');
var _jsxruntime = require('react/jsx-runtime');
var DEFAULT_LABELS = {
  yes: "Yes",
  no: "No"
};
function CandidateDecisionButtons({
  onChoose,
  size = "sm",
  stretch = false,
  labels,
  children,
  onClick,
  ...props
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _stack.Stack,
    {
      "data-slot": "candidate-decision-buttons",
      direction: "horizontal",
      gap: "sm",
      grow: stretch,
      ...props,
      onClick: (event) => {
        event.stopPropagation();
        _optionalChain([onClick, 'optionalCall', _ => _(event)]);
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _button.Button, { grow: stretch, size, variant: "outline", onClick: () => onChoose("yes"), children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.ThumbsUp, size: "sm" }),
          " ",
          text.yes
        ] }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _button.Button, { grow: stretch, size, variant: "outline", onClick: () => onChoose("no"), children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.ThumbsDown, size: "sm" }),
          " ",
          text.no
        ] }),
        children
      ]
    }
  );
}



exports.CandidateDecisionButtons = CandidateDecisionButtons;
