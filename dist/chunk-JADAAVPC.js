import {
  DefinitionItem,
  DefinitionList
} from "./chunk-QH22TH6O.js";
import {
  SectionHeader
} from "./chunk-GUEDPBI2.js";
import {
  Text
} from "./chunk-BUGVD7FT.js";
import {
  PanelSection
} from "./chunk-BS52KYLO.js";
import {
  Stack
} from "./chunk-PPARPLPM.js";

// src/recruit/candidate-assessment.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_LABELS = {
  summary: "Assessment",
  evidence: "Evidence",
  caveats: "Caveats",
  signals: "Signals"
};
function AssessmentSection({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs(Stack, { gap: "sm", children: [
    /* @__PURE__ */ jsx(SectionHeader, { label, spacing: "none" }),
    /* @__PURE__ */ jsx(Text, { as: "div", variant: "muted", size: "sm", children })
  ] });
}
function CandidateAssessment({
  grade,
  facts = [],
  summary,
  evidence,
  caveats,
  signals,
  labels,
  ...props
}) {
  const resolvedLabels = { ...DEFAULT_LABELS, ...labels };
  return /* @__PURE__ */ jsx(PanelSection, { "data-slot": "candidate-assessment", ...props, children: /* @__PURE__ */ jsxs(Stack, { gap: "lg", children: [
    grade,
    facts.length > 0 ? /* @__PURE__ */ jsx(DefinitionList, { children: facts.map((fact, index) => /* @__PURE__ */ jsx(DefinitionItem, { label: fact.label, children: fact.value }, index)) }) : null,
    summary != null ? /* @__PURE__ */ jsx(AssessmentSection, { label: resolvedLabels.summary, children: summary }) : null,
    evidence != null ? /* @__PURE__ */ jsx(AssessmentSection, { label: resolvedLabels.evidence, children: evidence }) : null,
    caveats != null ? /* @__PURE__ */ jsx(AssessmentSection, { label: resolvedLabels.caveats, children: caveats }) : null,
    signals != null ? /* @__PURE__ */ jsx(AssessmentSection, { label: resolvedLabels.signals, children: signals }) : null
  ] }) });
}

export {
  CandidateAssessment
};
