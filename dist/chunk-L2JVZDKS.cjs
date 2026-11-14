"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkD5BXTRVNcjs = require('./chunk-D5BXTRVN.cjs');

// src/recruit/choice-chips.tsx
var _utils = require('@epicbagel/saas-kit/lib/utils');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _toggle = require('@epicbagel/saas-kit/primitives/toggle');
var _jsxruntime = require('react/jsx-runtime');
var PRESSED_CHIP_STATES = "text-muted-foreground hover:text-foreground data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:font-medium data-[state=on]:text-foreground";
var CHIP_CLASSES = `h-auto min-h-9 py-1.5 text-left ${PRESSED_CHIP_STATES} ${_chunkD5BXTRVNcjs.COARSE_POINTER_TOUCH_TARGET}`;
var HELD_CHIP = "aria-disabled:pointer-events-none aria-disabled:opacity-50";
function ChoiceChips({
  chips,
  value,
  onChange,
  disabled = false,
  held = false,
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { role: "group", direction: "horizontal", gap: "sm", wrap: true, ...props, children: chips.map((chip) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _toggle.Toggle,
    {
      pressed: chip.id === value,
      onPressedChange: () => {
        if (!held && chip.id !== value) onChange(chip.id);
      },
      disabled,
      "aria-disabled": held || void 0,
      variant: "outline",
      size: "sm",
      className: _utils.cn.call(void 0, CHIP_CLASSES, HELD_CHIP),
      children: [
        chip.leading != null && chip.leading !== false ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "span", variant: "inherit", display: "inline-flex", shrink: false, "aria-hidden": "true", children: chip.leading }) : null,
        chip.label,
        chip.trailing
      ]
    },
    chip.id
  )) });
}




exports.PRESSED_CHIP_STATES = PRESSED_CHIP_STATES; exports.ChoiceChips = ChoiceChips;
