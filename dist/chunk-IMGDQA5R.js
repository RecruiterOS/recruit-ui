import {
  CandidateCardRoot,
  candidateCardSelectProps
} from "./chunk-NBZS6VTO.js";
import {
  CandidateCoverHeader
} from "./chunk-IQFISO63.js";

// src/recruit/candidate-relationship-card.tsx
import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { CountBadge } from "@epicbagel/saas-kit/primitives/count-badge";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Grid } from "@epicbagel/saas-kit/primitives/grid";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { InteractiveCard } from "@epicbagel/saas-kit/primitives/interactive-card";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { CheckCircle } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
function shown(node) {
  return node != null && node !== false && node !== "";
}
function Fact({ label, value, detail }) {
  return /* @__PURE__ */ jsxs(Stack, { gap: "xs", minWidth: "zero", children: [
    /* @__PURE__ */ jsx(Text, { size: "xs", tone: "muted", weight: "medium", transform: "uppercase", children: label }),
    /* @__PURE__ */ jsx(Text, { size: "sm", weight: "medium", lineClamp: 2, children: value }),
    shown(detail) && /* @__PURE__ */ jsx(Text, { size: "xs", tone: "muted", lineClamp: 2, children: detail })
  ] });
}
function CandidateRelationshipCard({
  name,
  avatar,
  cover,
  verified = false,
  headline,
  company,
  location,
  actions,
  signal,
  facts,
  suggestion,
  note,
  selected = false,
  onSelect,
  onKeyDown,
  ...props
}) {
  const primaryTitle = suggestion ? suggestion.primaryTitle ?? (typeof suggestion.primary === "string" ? suggestion.primary : void 0) : void 0;
  return /* @__PURE__ */ jsxs(
    InteractiveCard,
    {
      as: CandidateCardRoot,
      height: "full",
      gap: "none",
      selected,
      clip: true,
      "data-slot": "candidate-relationship-card",
      ...props,
      ...candidateCardSelectProps(onSelect, { onKeyDown }),
      children: [
        /* @__PURE__ */ jsx(CandidateCoverHeader, { cover, padding: "lg", softenCoverUntilHover: true, children: /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "md", align: "start", children: [
          avatar,
          /* @__PURE__ */ jsxs(FlexItem, { grow: true, minWidth: "zero", children: [
            /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "xs", align: "center", children: [
              /* @__PURE__ */ jsx(Heading, { level: 3, truncate: true, children: name }),
              verified && /* @__PURE__ */ jsx(Icon, { icon: CheckCircle, size: "sm", tone: "success" })
            ] }),
            shown(headline) && /* @__PURE__ */ jsx(Text, { size: "sm", tone: "muted", truncate: true, children: headline }),
            (shown(company) || shown(location)) && /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "xs", align: "center", minWidth: "zero", children: [
              company,
              shown(location) && /* @__PURE__ */ jsxs(Text, { variant: "inherit", as: "span", size: "sm", tone: "muted", truncate: true, children: [
                shown(company) && "\xB7 ",
                location
              ] })
            ] })
          ] }),
          actions
        ] }) }),
        signal && /* @__PURE__ */ jsxs(Stack, { border: "top", gap: "xs", paddingX: "lg", paddingY: "md", surface: "muted", children: [
          /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", justify: "between", children: [
            /* @__PURE__ */ jsx(Text, { size: "xs", tone: "muted", weight: "medium", transform: "uppercase", children: signal.label }),
            signal.actions
          ] }),
          /* @__PURE__ */ jsx(Text, { size: "sm", weight: "medium", children: signal.summary }),
          shown(signal.more) && /* @__PURE__ */ jsx(Text, { size: "xs", tone: "muted", children: signal.more })
        ] }),
        /* @__PURE__ */ jsx(Stack, { border: "top", padding: "lg", children: /* @__PURE__ */ jsx(Grid, { columns: 3, gap: "lg", responsive: true, children: facts.map((fact, index) => /* @__PURE__ */ jsx(Fact, { label: fact.label, value: fact.value, detail: fact.detail }, fact.id ?? index)) }) }),
        suggestion && /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "bare",
            width: "full",
            align: "start",
            onClick: (event) => {
              event.stopPropagation();
              suggestion.onOpen();
            },
            children: /* @__PURE__ */ jsxs(Stack, { border: "top", direction: "horizontal", gap: "sm", align: "center", padding: "lg", wrap: true, width: "full", children: [
              /* @__PURE__ */ jsx(Text, { size: "xs", tone: "muted", weight: "medium", transform: "uppercase", children: suggestion.label }),
              /* @__PURE__ */ jsx(Badge, { variant: "secondary", size: "compact", title: primaryTitle, children: suggestion.primary }),
              suggestion.grade,
              suggestion.more && /* @__PURE__ */ jsx(CountBadge, { value: suggestion.more.value, variant: "outline", title: suggestion.more.title })
            ] })
          }
        ),
        note && /* @__PURE__ */ jsxs(Stack, { border: "top", gap: "sm", padding: "lg", surface: "muted", children: [
          /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", justify: "between", children: [
            /* @__PURE__ */ jsx(Text, { size: "xs", tone: "muted", weight: "medium", children: note.heading }),
            note.date
          ] }),
          /* @__PURE__ */ jsx(Text, { size: "sm", whitespace: "pre-wrap", lineClamp: 3, children: note.text })
        ] })
      ]
    }
  );
}

export {
  CandidateRelationshipCard
};
