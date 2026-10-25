// src/recruit/candidate-decision-summary.tsx
import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Card } from "@epicbagel/saas-kit/primitives/card";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { StatusIconTile } from "@epicbagel/saas-kit/primitives/status-icon-tile";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Flag } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
function CandidateDecisionSummary({
  decision,
  assessment,
  ...props
}) {
  if (!decision && !assessment) return null;
  const positive = decision?.tone === "positive";
  const reason = decision?.reason;
  return /* @__PURE__ */ jsx(PanelSection, { "data-slot": "candidate-decision-summary", border: "bottom", surface: "muted", ...props, children: /* @__PURE__ */ jsxs(Card, { overflow: "hidden", children: [
    decision && /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "start", padding: "compact", children: [
      /* @__PURE__ */ jsx(StatusIconTile, { icon: Flag, tone: positive ? "success" : "destructive" }),
      /* @__PURE__ */ jsxs(FlexItem, { minWidth: "zero", children: [
        /* @__PURE__ */ jsx(Text, { variant: "eyebrow", weight: "semibold", children: decision.heading }),
        /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "xs", marginTop: "xs", align: "baseline", textSize: "sm", children: [
          /* @__PURE__ */ jsx(Text, { variant: "inherit", as: "span", weight: "semibold", tone: positive ? "success" : "destructive", children: decision.verdict }),
          /* @__PURE__ */ jsxs(Text, { variant: "inherit", as: "span", tone: "muted", children: [
            "\xB7 ",
            decision.stage
          ] })
        ] }),
        reason != null && reason !== false && reason !== "" && /* @__PURE__ */ jsx(Text, { size: "sm", tone: "muted", marginTop: "tight", whitespace: "pre-wrap", children: reason })
      ] })
    ] }),
    assessment && /* @__PURE__ */ jsxs(
      Stack,
      {
        direction: "horizontal",
        gap: "compact",
        align: "start",
        paddingX: "md",
        paddingY: "section",
        border: decision ? "top" : "none",
        children: [
          /* @__PURE__ */ jsx(
            Badge,
            {
              variant: assessment.tone,
              size: "tile",
              shape: "rounded",
              weight: "bold",
              shrink: true,
              marginTop: "tight",
              title: assessment.title,
              children: assessment.letter
            }
          ),
          /* @__PURE__ */ jsxs(FlexItem, { minWidth: "zero", children: [
            /* @__PURE__ */ jsx(Text, { variant: "eyebrow", weight: "semibold", children: assessment.heading }),
            /* @__PURE__ */ jsx(Text, { size: "sm", tone: "muted", marginTop: "tight", children: assessment.label })
          ] })
        ]
      }
    )
  ] }) });
}

export {
  CandidateDecisionSummary
};
