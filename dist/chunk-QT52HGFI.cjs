"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkFECY2JGNcjs = require('./chunk-FECY2JGN.cjs');

// src/recruit/candidate-assessment.tsx
var _definitionlist = require('@epicbagel/saas-kit/primitives/definition-list');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _list = require('@epicbagel/saas-kit/primitives/list');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _sectionheader = require('@epicbagel/saas-kit/primitives/section-header');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
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
function EvidenceList({ items }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _list.List, { "data-slot": "candidate-assessment-evidence", spacing: "tight", marker: "none", textSize: "sm", children: items.map((item, index) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _list.ListItem, { layout: "row", gap: "sm", align: "start", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Check, tone: "success", align: "start" }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "span", variant: "inherit", size: "sm", children: item })
  ] }, index)) });
}
function CaveatList({ items }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _list.List, { "data-slot": "candidate-assessment-caveats", spacing: "tight", marker: "disc", textSize: "sm", tone: "muted", children: items.map((item, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _list.ListItem, { children: item }, index)) });
}
function sectionContent(slot, items, draw) {
  if (slot != null) return slot;
  return items && items.length > 0 ? draw(items) : null;
}
function CandidateAssessment({
  grade,
  facts = [],
  summary,
  evidence,
  evidenceItems,
  caveats,
  caveatItems,
  signals,
  signalItems,
  labels,
  padding = "default",
  ...props
}) {
  const resolvedLabels = { ...DEFAULT_LABELS, ...labels };
  const evidenceContent = sectionContent(evidence, evidenceItems, (items) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, EvidenceList, { items }));
  const caveatContent = sectionContent(caveats, caveatItems, (items) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, CaveatList, { items }));
  const signalContent = sectionContent(signals, signalItems, (items) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkFECY2JGNcjs.CandidateSummaryBullets, { bullets: items }));
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _panelsection.PanelSection, { "data-slot": "candidate-assessment", padding, ...props, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "lg", children: [
    grade,
    facts.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionList, { children: facts.map((fact, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionItem, { label: fact.label, children: fact.value }, index)) }) : null,
    summary != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, AssessmentSection, { label: resolvedLabels.summary, children: summary }) : null,
    evidenceContent != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, AssessmentSection, { label: resolvedLabels.evidence, children: evidenceContent }) : null,
    caveatContent != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, AssessmentSection, { label: resolvedLabels.caveats, children: caveatContent }) : null,
    signalContent != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, AssessmentSection, { label: resolvedLabels.signals, children: signalContent }) : null
  ] }) });
}



exports.CandidateAssessment = CandidateAssessment;
