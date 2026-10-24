"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _chunk32U4U2ULcjs = require('./chunk-32U4U2UL.cjs');


var _chunkPF3673C2cjs = require('./chunk-PF3673C2.cjs');


var _chunkRTB3COSUcjs = require('./chunk-RTB3COSU.cjs');


var _chunkR52RM2CDcjs = require('./chunk-R52RM2CD.cjs');


var _chunkYMPXXC7Bcjs = require('./chunk-YMPXXC7B.cjs');

// src/recruit/candidate-assessment.tsx
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
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkYMPXXC7Bcjs.Stack, { gap: "sm", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkPF3673C2cjs.SectionHeader, { label, spacing: "none" }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkRTB3COSUcjs.Text, { as: "div", variant: "muted", size: "sm", children })
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
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkR52RM2CDcjs.PanelSection, { "data-slot": "candidate-assessment", ...props, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkYMPXXC7Bcjs.Stack, { gap: "lg", children: [
    grade,
    facts.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk32U4U2ULcjs.DefinitionList, { children: facts.map((fact, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk32U4U2ULcjs.DefinitionItem, { label: fact.label, children: fact.value }, index)) }) : null,
    summary != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, AssessmentSection, { label: resolvedLabels.summary, children: summary }) : null,
    evidence != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, AssessmentSection, { label: resolvedLabels.evidence, children: evidence }) : null,
    caveats != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, AssessmentSection, { label: resolvedLabels.caveats, children: caveats }) : null,
    signals != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, AssessmentSection, { label: resolvedLabels.signals, children: signals }) : null
  ] }) });
}



exports.CandidateAssessment = CandidateAssessment;
