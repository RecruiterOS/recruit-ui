// src/recruit/candidate-job-evidence.tsx
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { jsx, jsxs } from "react/jsx-runtime";
function CandidateJobEvidence({
  sourced,
  feedback,
  padding = "compact",
  border = "none",
  ...props
}) {
  if (!sourced && !feedback) return null;
  const byline = feedback?.byline;
  return /* @__PURE__ */ jsx(PanelSection, { "data-slot": "candidate-job-evidence", padding, border, ...props, children: /* @__PURE__ */ jsxs(Stack, { gap: "sm", children: [
    sourced && /* @__PURE__ */ jsxs(Stack, { gap: "xs", children: [
      /* @__PURE__ */ jsx(Text, { size: "sm", weight: "semibold", children: sourced.title }),
      /* @__PURE__ */ jsx(Text, { size: "sm", whitespace: "pre-wrap", children: sourced.text })
    ] }),
    feedback && /* @__PURE__ */ jsxs(Stack, { gap: "xs", children: [
      /* @__PURE__ */ jsx(Text, { size: "sm", weight: "semibold", children: feedback.title }),
      /* @__PURE__ */ jsx(Text, { size: "sm", whitespace: "pre-wrap", children: feedback.text }),
      byline != null && byline !== false && byline !== "" && /* @__PURE__ */ jsx(Text, { size: "xs", tone: "muted", children: byline })
    ] })
  ] }) });
}

export {
  CandidateJobEvidence
};
