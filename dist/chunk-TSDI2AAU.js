import {
  Stack
} from "./chunk-PPARPLPM.js";
import {
  Button
} from "./chunk-A7XOSQ7J.js";
import {
  cn
} from "./chunk-WTFE3OMU.js";

// vendor/core/files/src/primitives/decision-actions.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function DecisionActions({
  options,
  value,
  onChange,
  disabled = false,
  ariaLabel = "Decision",
  trailing,
  layout = "inline"
}) {
  const fill = layout === "fill";
  return /* @__PURE__ */ jsxs(
    Stack,
    {
      direction: "horizontal",
      gap: "sm",
      align: "center",
      wrap: !fill,
      grow: fill,
      width: fill ? "full" : "auto",
      role: "group",
      "aria-label": ariaLabel,
      children: [
        options.map((option) => {
          const selected = option.value === value;
          return /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              size: "compact",
              grow: fill,
              className: cn(
                "h-auto",
                fill ? "min-h-11 px-5 py-2.5" : "px-4 py-2",
                selected && "border border-transparent"
              ),
              variant: selected ? "default" : "outline",
              disabled,
              "aria-pressed": selected,
              onClick: () => onChange(option.value),
              children: option.label
            },
            option.value
          );
        }),
        trailing
      ]
    }
  );
}

// src/recruit/candidate-decision-bar.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
function CandidateDecisionBar({
  options,
  value,
  onChange,
  disabled = false,
  ariaLabel = "Candidate decision",
  trailing,
  layout = "fill"
}) {
  return /* @__PURE__ */ jsx2(
    DecisionActions,
    {
      options,
      value,
      onChange,
      disabled,
      ariaLabel,
      trailing,
      layout
    }
  );
}

export {
  CandidateDecisionBar
};
