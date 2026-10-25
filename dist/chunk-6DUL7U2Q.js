// src/recruit/candidate-header-actions.tsx
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { jsx } from "react/jsx-runtime";
function CandidateHeaderActions({ children, ...props }) {
  return /* @__PURE__ */ jsx(
    Stack,
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
  return /* @__PURE__ */ jsx(
    Button,
    {
      size: "icon-sm",
      variant: "quiet",
      title,
      ...props,
      onClick: (event) => {
        event.stopPropagation();
        onClick?.(event);
      },
      children: /* @__PURE__ */ jsx(Icon, { icon, size: "md" })
    }
  );
}

export {
  CandidateHeaderActions,
  CandidateIconAction
};
