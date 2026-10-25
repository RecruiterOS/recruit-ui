import {
  shouldActivateCandidateCard
} from "./chunk-NBZS6VTO.js";

// src/recruit/candidate-inline-card.tsx
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { InteractiveCard } from "@epicbagel/saas-kit/primitives/interactive-card";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { useId } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function CandidateInlineCard({
  name,
  avatar,
  headline,
  meta,
  assessment,
  status,
  actions,
  selected = false,
  subdued = false,
  onSelect,
  selectLabel = "Open candidate profile",
  density = "comfortable",
  "aria-expanded": ariaExpanded,
  className,
  ...props
}) {
  const generatedId = useId();
  const nameId = `${generatedId}-name`;
  const actionId = `${generatedId}-action`;
  const compact = density === "compact";
  return /* @__PURE__ */ jsxs(
    InteractiveCard,
    {
      as: "article",
      "data-slot": "candidate-inline-card",
      "data-density": density,
      selected,
      borderWidth: "thin",
      padding: "none",
      opacity: subdued ? "subdued" : "full",
      className,
      ...props,
      children: [
        onSelect ? /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            "data-slot": "candidate-inline-card-trigger",
            "aria-label": selectLabel === "Open candidate profile" ? void 0 : selectLabel,
            "aria-labelledby": selectLabel === "Open candidate profile" ? `${actionId} ${nameId}` : void 0,
            "aria-current": selected || void 0,
            "aria-expanded": ariaExpanded,
            className: "pointer-events-none absolute inset-0 z-10 rounded-[inherit] border-0 bg-transparent p-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            onClick: onSelect,
            children: selectLabel === "Open candidate profile" ? /* @__PURE__ */ jsx("span", { id: actionId, className: "sr-only", children: selectLabel }) : null
          }
        ) : null,
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-slot": "candidate-inline-card-content",
            className: compact ? "h-full px-3 py-2" : "px-5 py-4",
            onClick: onSelect ? (event) => {
              if (shouldActivateCandidateCard(event)) onSelect();
            } : void 0,
            children: /* @__PURE__ */ jsxs(
              Stack,
              {
                direction: "horizontal",
                gap: compact ? "sm" : "compact",
                align: compact ? "center" : "start",
                height: compact ? "full" : "auto",
                children: [
                  avatar,
                  /* @__PURE__ */ jsxs(FlexItem, { grow: true, minWidth: "zero", children: [
                    /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", wrap: !compact, children: [
                      /* @__PURE__ */ jsx(Heading, { id: nameId, level: 5, appearance: compact ? "compact" : "default", truncate: true, children: name }),
                      status
                    ] }),
                    headline != null ? (
                      // A compact row is a fixed height: the caption's relaxed leading would push the lines apart.
                      /* @__PURE__ */ jsx(
                        Text,
                        {
                          variant: "caption",
                          size: compact ? "xs" : "sm",
                          leading: compact ? "snug" : "normal",
                          truncate: true,
                          marginTop: compact ? "none" : "tight",
                          children: headline
                        }
                      )
                    ) : null,
                    meta != null ? /* @__PURE__ */ jsx(
                      Text,
                      {
                        variant: "caption",
                        size: "xs",
                        leading: compact ? "snug" : "normal",
                        truncate: compact,
                        marginTop: compact ? "none" : "xs",
                        children: meta
                      }
                    ) : null,
                    assessment != null ? /* @__PURE__ */ jsx(Stack, { gap: "none", marginTop: compact ? "sm" : "md", children: assessment }) : null
                  ] }),
                  actions
                ]
              }
            )
          }
        )
      ]
    }
  );
}

export {
  CandidateInlineCard
};
