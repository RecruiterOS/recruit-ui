// src/recruit/candidate-destination-status.tsx
import {
  ConnectionStatusBar
} from "@epicbagel/saas-kit/primitives/connection-status-bar";
import { jsx } from "react/jsx-runtime";
function CandidateDestinationStatus({
  state,
  name,
  description,
  facts,
  actions,
  progress,
  progressLabel,
  details,
  open,
  defaultOpen,
  onOpenChange,
  className
}) {
  return /* @__PURE__ */ jsx(
    ConnectionStatusBar,
    {
      state,
      name,
      description,
      facts,
      actions,
      progress,
      progressLabel,
      open,
      defaultOpen,
      onOpenChange,
      className,
      children: details
    }
  );
}

export {
  CandidateDestinationStatus
};
