// src/recruit/candidate-favourite-button.tsx
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Star } from "lucide-react";
import { jsx } from "react/jsx-runtime";
var DEFAULT_LABELS = {
  add: "Add to favourites",
  remove: "Remove from favourites"
};
function CandidateFavouriteButton({
  favourited,
  onToggle,
  labels,
  idleTone = "muted",
  onClick,
  ...props
}) {
  const label = favourited ? labels?.remove ?? DEFAULT_LABELS.remove : labels?.add ?? DEFAULT_LABELS.add;
  return /* @__PURE__ */ jsx(
    Button,
    {
      type: "button",
      variant: "ghost",
      size: "icon-sm",
      shrink: true,
      "aria-pressed": favourited,
      title: label,
      ...props,
      onClick: (event) => {
        event.stopPropagation();
        onClick?.(event);
        if (!event.defaultPrevented) onToggle();
      },
      children: /* @__PURE__ */ jsx(Icon, { icon: Star, size: "md", tone: favourited ? "warning" : idleTone, filled: favourited })
    }
  );
}

export {
  CandidateFavouriteButton
};
