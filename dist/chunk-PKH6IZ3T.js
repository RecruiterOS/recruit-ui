import {
  CandidateActionMenu
} from "./chunk-ASGWN3F6.js";

// src/recruit/candidate-signal-menu.tsx
import { jsx } from "react/jsx-runtime";
function CandidateSignalMenu({
  items,
  onSelect,
  disabled,
  label = "Signal actions"
}) {
  return /* @__PURE__ */ jsx(
    CandidateActionMenu,
    {
      items,
      onSelect,
      disabled,
      label,
      triggerIconSize: "sm",
      isolateClicks: true
    }
  );
}

export {
  CandidateSignalMenu
};
