import {
  CandidateSummaryBullets
} from "./chunk-RZD4G4NP.js";

// src/recruit/candidate-assessment.tsx
import { DefinitionItem, DefinitionList } from "@epicbagel/saas-kit/primitives/definition-list";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { List, ListItem } from "@epicbagel/saas-kit/primitives/list";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Check } from "lucide-react";
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
function EvidenceList({ items }) {
  return /* @__PURE__ */ jsx(List, { "data-slot": "candidate-assessment-evidence", spacing: "tight", marker: "none", textSize: "sm", children: items.map((item, index) => /* @__PURE__ */ jsxs(ListItem, { layout: "row", gap: "sm", align: "start", children: [
    /* @__PURE__ */ jsx(Icon, { icon: Check, tone: "success", align: "start" }),
    /* @__PURE__ */ jsx(Text, { as: "span", variant: "inherit", size: "sm", children: item })
  ] }, index)) });
}
function CaveatList({ items }) {
  return /* @__PURE__ */ jsx(List, { "data-slot": "candidate-assessment-caveats", spacing: "tight", marker: "disc", textSize: "sm", tone: "muted", children: items.map((item, index) => /* @__PURE__ */ jsx(ListItem, { children: item }, index)) });
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
  const evidenceContent = sectionContent(evidence, evidenceItems, (items) => /* @__PURE__ */ jsx(EvidenceList, { items }));
  const caveatContent = sectionContent(caveats, caveatItems, (items) => /* @__PURE__ */ jsx(CaveatList, { items }));
  const signalContent = sectionContent(signals, signalItems, (items) => /* @__PURE__ */ jsx(CandidateSummaryBullets, { bullets: items, presentation: "body" }));
  return /* @__PURE__ */ jsx(PanelSection, { "data-slot": "candidate-assessment", padding, ...props, children: /* @__PURE__ */ jsxs(Stack, { gap: "lg", children: [
    grade,
    facts.length > 0 ? /* @__PURE__ */ jsx(DefinitionList, { children: facts.map((fact, index) => /* @__PURE__ */ jsx(DefinitionItem, { label: fact.label, children: fact.value }, index)) }) : null,
    summary != null ? /* @__PURE__ */ jsx(AssessmentSection, { label: resolvedLabels.summary, children: summary }) : null,
    evidenceContent != null ? /* @__PURE__ */ jsx(AssessmentSection, { label: resolvedLabels.evidence, children: evidenceContent }) : null,
    caveatContent != null ? /* @__PURE__ */ jsx(AssessmentSection, { label: resolvedLabels.caveats, children: caveatContent }) : null,
    signalContent != null ? /* @__PURE__ */ jsx(AssessmentSection, { label: resolvedLabels.signals, children: signalContent }) : null
  ] }) });
}

export {
  CandidateAssessment
};
