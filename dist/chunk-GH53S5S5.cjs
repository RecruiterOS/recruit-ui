"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/candidate-filter-chips.tsx
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _toggle = require('@epicbagel/saas-kit/primitives/toggle');
var _jsxruntime = require('react/jsx-runtime');
function CandidateFilterChips({
  value,
  onChange,
  allLabel,
  options,
  context,
  action,
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { gap: "none", border: "bottom", "data-slot": "candidate-filter-chips", ...props, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "xs", align: "center", paddingY: "sm", overflow: "x-auto", children: [
    context,
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _toggle.Toggle, { pressed: !value, onPressedChange: () => onChange(null), variant: "outline", size: "chip", children: allLabel }),
    options.map((option) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
      _toggle.Toggle,
      {
        pressed: value === option.value,
        onPressedChange: () => onChange(option.value),
        variant: "outline",
        size: "chip",
        children: [
          option.icon && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: option.icon, size: "xs" }),
          option.label
        ]
      },
      option.value
    )),
    action && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { marginStart: "auto", shrink: false, children: action })
  ] }) });
}



exports.CandidateFilterChips = CandidateFilterChips;
