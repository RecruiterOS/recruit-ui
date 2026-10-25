// src/recruit/candidate-decision-bar.tsx
import {
  DecisionActions
} from "@epicbagel/saas-kit/primitives/decision-actions";
import { jsx } from "react/jsx-runtime";
function CandidateDecisionBar({
  options,
  value,
  onChange,
  disabled = false,
  ariaLabel = "Candidate decision",
  trailing,
  layout = "fill"
}) {
  return /* @__PURE__ */ jsx(
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
