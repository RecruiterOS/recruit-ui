// src/recruit/candidate-profile-link-button.tsx
import { Anchor } from "@epicbagel/saas-kit/primitives/anchor";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { jsx, jsxs } from "react/jsx-runtime";
function CandidateProfileLinkButton({
  href,
  title,
  icon,
  size = "default",
  presentation = "icon",
  buttonLabel = "Open profile",
  iconTone = "info",
  onClick,
  ...props
}) {
  if (presentation === "button") {
    return /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", size: "sm", shrink: true, children: /* @__PURE__ */ jsxs(Anchor, { href, target: "_blank", rel: "noreferrer", title, onClick, ...props, children: [
      /* @__PURE__ */ jsx(Icon, { icon, size: "md", tone: iconTone }),
      " ",
      buttonLabel
    ] }) });
  }
  return /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: size === "lg" ? "icon-md" : "icon-sm", shrink: true, children: /* @__PURE__ */ jsx(
    Anchor,
    {
      href,
      target: "_blank",
      rel: "noreferrer",
      onClick: (event) => {
        event.stopPropagation();
        onClick?.(event);
      },
      title,
      ...props,
      children: /* @__PURE__ */ jsx(Icon, { icon, size: size === "lg" ? "lg" : "md", tone: iconTone })
    }
  ) });
}

export {
  CandidateProfileLinkButton
};
