"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/candidate-assessment.tsx
var _definitionlist = require('@epicbagel/saas-kit/primitives/definition-list');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _sectionheader = require('@epicbagel/saas-kit/primitives/section-header');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _jsxruntime = require('react/jsx-runtime');
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
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "sm", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sectionheader.SectionHeader, { label, spacing: "none" }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "div", variant: "muted", size: "sm", children })
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
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _panelsection.PanelSection, { "data-slot": "candidate-assessment", ...props, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "lg", children: [
    grade,
    facts.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionList, { children: facts.map((fact, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionItem, { label: fact.label, children: fact.value }, index)) }) : null,
    summary != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, AssessmentSection, { label: resolvedLabels.summary, children: summary }) : null,
    evidence != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, AssessmentSection, { label: resolvedLabels.evidence, children: evidence }) : null,
    caveats != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, AssessmentSection, { label: resolvedLabels.caveats, children: caveats }) : null,
    signals != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, AssessmentSection, { label: resolvedLabels.signals, children: signals }) : null
  ] }) });
}



exports.CandidateAssessment = CandidateAssessment;
