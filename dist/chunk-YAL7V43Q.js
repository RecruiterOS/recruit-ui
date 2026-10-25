// src/recruit/candidate-decision-buttons.tsx
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsxs(
    Stack,
    {
      "data-slot": "candidate-decision-buttons",
      direction: "horizontal",
      gap: "sm",
      grow: stretch,
      ...props,
      onClick: (event) => {
        event.stopPropagation();
        onClick?.(event);
      },
      children: [
        /* @__PURE__ */ jsxs(Button, { grow: stretch, size, variant: "outline", onClick: () => onChoose("yes"), children: [
          /* @__PURE__ */ jsx(Icon, { icon: ThumbsUp, size: "sm" }),
          " ",
          text.yes
        ] }),
        /* @__PURE__ */ jsxs(Button, { grow: stretch, size, variant: "outline", onClick: () => onChoose("no"), children: [
          /* @__PURE__ */ jsx(Icon, { icon: ThumbsDown, size: "sm" }),
          " ",
          text.no
        ] }),
        children
      ]
    }
  );
}

export {
  CandidateDecisionButtons
};
