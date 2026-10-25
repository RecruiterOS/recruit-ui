// src/recruit/candidate-filter-chips.tsx
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Toggle } from "@epicbagel/saas-kit/primitives/toggle";
import { jsx, jsxs } from "react/jsx-runtime";
function CandidateFilterChips({
  value,
  onChange,
  allLabel,
  options,
  context,
  action,
  ...props
}) {
  return /* @__PURE__ */ jsx(Stack, { gap: "none", border: "bottom", "data-slot": "candidate-filter-chips", ...props, children: /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "xs", align: "center", paddingY: "sm", overflow: "x-auto", children: [
    context,
    /* @__PURE__ */ jsx(Toggle, { pressed: !value, onPressedChange: () => onChange(null), variant: "outline", size: "chip", children: allLabel }),
    options.map((option) => /* @__PURE__ */ jsxs(
      Toggle,
      {
        pressed: value === option.value,
        onPressedChange: () => onChange(option.value),
        variant: "outline",
        size: "chip",
        children: [
          option.icon && /* @__PURE__ */ jsx(Icon, { icon: option.icon, size: "xs" }),
          option.label
        ]
      },
      option.value
    )),
    action && /* @__PURE__ */ jsx(Stack, { marginStart: "auto", shrink: false, children: action })
  ] }) });
}

export {
  CandidateFilterChips
};
