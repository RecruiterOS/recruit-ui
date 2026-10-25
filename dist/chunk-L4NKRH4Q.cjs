"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/recruit/candidate-header-actions.tsx
var _button = require('@epicbagel/saas-kit/primitives/button');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _jsxruntime = require('react/jsx-runtime');
function CandidateHeaderActions({ children, ...props }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _stack.Stack,
    {
      "data-slot": "candidate-header-actions",
      direction: "horizontal",
      gap: "lg",
      align: "center",
      justify: "end",
      wrap: true,
      shrink: false,
      marginEnd: "negative-xs",
      ...props,
      children
    }
  );
}
function CandidateIconAction({ icon, title, onClick, ...props }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _button.Button,
    {
      size: "icon-sm",
      variant: "quiet",
      title,
      ...props,
      onClick: (event) => {
        event.stopPropagation();
        _optionalChain([onClick, 'optionalCall', _ => _(event)]);
      },
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon, size: "md" })
    }
  );
}




exports.CandidateHeaderActions = CandidateHeaderActions; exports.CandidateIconAction = CandidateIconAction;
