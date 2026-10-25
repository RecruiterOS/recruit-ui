// src/recruit/candidate-selectable-avatar.tsx
import { SelectionOverlay } from "@epicbagel/saas-kit/primitives/selection-overlay";
import { Toggle } from "@epicbagel/saas-kit/primitives/toggle";
import { jsx, jsxs } from "react/jsx-runtime";
function CandidateSelectableAvatar({
  selected,
  onToggle,
  label,
  title,
  children,
  onClick,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    Toggle,
    {
      pressed: selected,
      "aria-label": label,
      title: title ?? (selected ? "Deselect" : "Select"),
      onPressedChange: () => onToggle(),
      onClick: (event) => {
        event.stopPropagation();
        onClick?.(event);
      },
      size: "avatar",
      "data-slot": "candidate-selectable-avatar",
      ...props,
      children: [
        children,
        selected && /* @__PURE__ */ jsx(SelectionOverlay, {})
      ]
    }
  );
}

export {
  CandidateSelectableAvatar
};
