"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/candidate-decision-bar.tsx


var _decisionactions = require('@epicbagel/saas-kit/primitives/decision-actions');
var _jsxruntime = require('react/jsx-runtime');
function CandidateDecisionBar({
  options,
  value,
  onChange,
  disabled = false,
  ariaLabel = "Candidate decision",
  trailing,
  layout = "fill"
}) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _decisionactions.DecisionActions,
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



exports.CandidateDecisionBar = CandidateDecisionBar;
