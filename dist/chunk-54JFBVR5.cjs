"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkD5BXTRVNcjs = require('./chunk-D5BXTRVN.cjs');

// src/recruit/candidate-filter-chips.tsx
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _toggle = require('@epicbagel/saas-kit/primitives/toggle');
var _jsxruntime = require('react/jsx-runtime');
var CHIP_STATES = "text-muted-foreground hover:text-foreground data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:font-medium data-[state=on]:text-foreground";
var CHIP_CLASSES = `${CHIP_STATES} ${_chunkD5BXTRVNcjs.COARSE_POINTER_TOUCH_TARGET}`;
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
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _toggle.Toggle,
      {
        pressed: !value,
        onPressedChange: () => onChange(null),
        variant: "outline",
        size: "chip",
        className: CHIP_CLASSES,
        children: allLabel
      }
    ),
    options.map((option) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
      _toggle.Toggle,
      {
        pressed: value === option.value,
        onPressedChange: () => onChange(option.value),
        variant: "outline",
        size: "chip",
        className: CHIP_CLASSES,
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
