import {
  COARSE_POINTER_TOUCH_TARGET
} from "./chunk-YKEE5RQG.js";

// src/recruit/choice-chips.tsx
import { cn } from "@epicbagel/saas-kit/lib/utils";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Toggle } from "@epicbagel/saas-kit/primitives/toggle";
import { jsx, jsxs } from "react/jsx-runtime";
var PRESSED_CHIP_STATES = "text-muted-foreground hover:text-foreground data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:font-medium data-[state=on]:text-foreground";
var CHIP_CLASSES = `h-auto min-h-9 py-1.5 text-left ${PRESSED_CHIP_STATES} ${COARSE_POINTER_TOUCH_TARGET}`;
var HELD_CHIP = "aria-disabled:pointer-events-none aria-disabled:opacity-50";
function ChoiceChips({
  chips,
  value,
  onChange,
  disabled = false,
  held = false,
  ...props
}) {
  return /* @__PURE__ */ jsx(Stack, { role: "group", direction: "horizontal", gap: "sm", wrap: true, ...props, children: chips.map((chip) => /* @__PURE__ */ jsxs(
    Toggle,
    {
      pressed: chip.id === value,
      onPressedChange: () => {
        if (!held && chip.id !== value) onChange(chip.id);
      },
      disabled,
      "aria-disabled": held || void 0,
      variant: "outline",
      size: "sm",
      className: cn(CHIP_CLASSES, HELD_CHIP),
      children: [
        chip.leading != null && chip.leading !== false ? /* @__PURE__ */ jsx(Text, { as: "span", variant: "inherit", display: "inline-flex", shrink: false, "aria-hidden": "true", children: chip.leading }) : null,
        chip.label,
        chip.trailing
      ]
    },
    chip.id
  )) });
}

export {
  PRESSED_CHIP_STATES,
  ChoiceChips
};
