import {
  shouldActivateCandidateCard
} from "./chunk-NBZS6VTO.js";
import {
  CandidateCoverHeader
} from "./chunk-NBAJDT3O.js";

// src/recruit/candidate-pipeline-card.tsx
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { InteractiveCard } from "@epicbagel/saas-kit/primitives/interactive-card";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { jsx, jsxs } from "react/jsx-runtime";
function shown(node) {
  return node != null && node !== false && node !== "";
}
function CandidatePipelineCard({
  name,
  headline,
  company,
  cover,
  badges,
  actions,
  onSelect,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    InteractiveCard,
    {
      radius: "lg",
      textSize: "sm",
      onClick: (event) => {
        if (shouldActivateCandidateCard(event)) onSelect();
      },
      clip: true,
      "data-slot": "candidate-pipeline-card",
      ...props,
      children: /* @__PURE__ */ jsx(CandidateCoverHeader, { cover, padding: "compact", children: /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "xs", align: "start", children: [
        /* @__PURE__ */ jsx(FlexItem, { grow: true, minWidth: "zero", children: /* @__PURE__ */ jsxs(Stack, { gap: "none", children: [
          /* @__PURE__ */ jsx(Text, { weight: "medium", truncate: true, children: name }),
          shown(headline) ? /* @__PURE__ */ jsx(Text, { size: "xs", tone: "muted", truncate: true, marginTop: "tight", children: headline }) : null,
          company,
          shown(badges) ? /* @__PURE__ */ jsx(Stack, { direction: "horizontal", gap: "xs", align: "center", marginTop: "sm", children: badges }) : null
        ] }) }),
        actions
      ] }) })
    }
  );
}

export {
  CandidatePipelineCard
};
