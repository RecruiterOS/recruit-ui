// src/recruit/candidate-assessment.tsx
import { DefinitionItem, DefinitionList } from "@epicbagel/saas-kit/primitives/definition-list";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
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
