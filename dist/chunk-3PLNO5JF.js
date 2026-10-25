// src/recruit/candidate-shared-profile-button.tsx
import { Anchor } from "@epicbagel/saas-kit/primitives/anchor";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Eye } from "lucide-react";
import { jsx } from "react/jsx-runtime";
function CandidateSharedProfileButton({
  href,
  label,
  size = "default",
  onClick,
  ...props
}) {
  return /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: size === "compact" ? "icon-xs" : "icon-sm", shrink: true, children: /* @__PURE__ */ jsx(
    Anchor,
    {
      href,
      target: "_blank",
      rel: "noreferrer",
      title: label,
      "aria-label": label,
      onClick: (event) => {
        event.stopPropagation();
        onClick?.(event);
      },
      ...props,
      children: /* @__PURE__ */ jsx(Icon, { icon: Eye, size: size === "compact" ? "sm" : "md" })
    }
  ) });
}

export {
  CandidateSharedProfileButton
};
