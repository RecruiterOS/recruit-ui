import {
  shouldActivateCandidateCard
} from "./chunk-NBZS6VTO.js";
import {
  CandidateCoverHeader
} from "./chunk-G4E57GP4.js";

// src/recruit/candidate-review-card.tsx
import { DefinitionItem, DefinitionList } from "@epicbagel/saas-kit/primitives/definition-list";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Grid } from "@epicbagel/saas-kit/primitives/grid";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { InteractiveCard } from "@epicbagel/saas-kit/primitives/interactive-card";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { Spacer } from "@epicbagel/saas-kit/primitives/spacer";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { useId } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function CandidateReviewCard({
  name,
  avatar,
  cover,
  headline,
  headerActions,
  beforeFacts,
  facts = [],
  insight,
  actions,
  selected = false,
  subdued = false,
  onSelect,
  selectLabel = "Open candidate review",
  "aria-expanded": ariaExpanded,
  className,
  ...props
}) {
  const generatedId = useId();
  const nameId = `${generatedId}-name`;
  const actionId = `${generatedId}-action`;
  return /* @__PURE__ */ jsxs(
    InteractiveCard,
    {
      as: "article",
      "data-slot": "candidate-review-card",
      selected,
      borderWidth: "thin",
      clip: true,
      display: "block",
      opacity: subdued ? "subdued" : "full",
      className,
      ...props,
      children: [
        onSelect ? /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            "data-slot": "candidate-review-card-trigger",
            "aria-label": selectLabel === "Open candidate review" ? void 0 : selectLabel,
            "aria-labelledby": selectLabel === "Open candidate review" ? `${actionId} ${nameId}` : void 0,
            "aria-current": selected || void 0,
            "aria-expanded": ariaExpanded,
            className: "pointer-events-none absolute inset-0 z-10 rounded-[inherit] border-0 bg-transparent p-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            onClick: onSelect,
            children: selectLabel === "Open candidate review" ? /* @__PURE__ */ jsx("span", { id: actionId, className: "sr-only", children: selectLabel }) : null
          }
        ) : null,
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-slot": "candidate-review-card-content",
            className: "h-full",
            onClick: onSelect ? (event) => {
              if (shouldActivateCandidateCard(event)) onSelect();
            } : void 0,
            children: /* @__PURE__ */ jsxs(Stack, { gap: "none", height: "full", children: [
              /* @__PURE__ */ jsxs(FlexItem, { grow: true, minHeight: "zero", children: [
                /* @__PURE__ */ jsx(CandidateCoverHeader, { cover, padding: "lg", children: /* @__PURE__ */ jsxs(
                  Grid,
                  {
                    columns: null,
                    gap: "md",
                    className: "grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start",
                    children: [
                      /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "md", align: "start", minWidth: "zero", children: [
                        avatar,
                        /* @__PURE__ */ jsxs(FlexItem, { grow: true, minWidth: "zero", children: [
                          /* @__PURE__ */ jsx(Heading, { id: nameId, level: 3, children: name }),
                          headline != null ? /* @__PURE__ */ jsx(Text, { variant: "caption", size: "sm", marginTop: "xs", children: headline }) : null
                        ] })
                      ] }),
                      headerActions != null ? /* @__PURE__ */ jsx(
                        "div",
                        {
                          "data-slot": "candidate-review-card-header-actions",
                          className: "justify-self-start sm:justify-self-auto",
                          children: headerActions
                        }
                      ) : null
                    ]
                  }
                ) }),
                beforeFacts,
                facts.length > 0 ? /* @__PURE__ */ jsx(DefinitionList, { inset: "lg", className: "border-y", children: facts.map((fact, index) => /* @__PURE__ */ jsx(DefinitionItem, { label: fact.label, children: fact.value }, index)) }) : null,
                insight != null ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Spacer, { size: "xs" }),
                  /* @__PURE__ */ jsxs(PanelSection, { border: "bottom", surface: "muted", padding: "default", children: [
                    /* @__PURE__ */ jsx(Text, { variant: "eyebrow", marginBottom: "sm", children: insight.label }),
                    /* @__PURE__ */ jsx(Text, { variant: "muted", size: "sm", children: insight.value })
                  ] })
                ] }) : null
              ] }),
              actions,
              /* @__PURE__ */ jsx(Spacer, { size: "md" })
            ] })
          }
        )
      ]
    }
  );
}

export {
  CandidateReviewCard
};
