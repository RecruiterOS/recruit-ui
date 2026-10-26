import {
  shouldActivateCandidateCard
} from "./chunk-NBZS6VTO.js";
import {
  COARSE_POINTER_TOUCH_TARGETS_WITHIN
} from "./chunk-YKEE5RQG.js";

// src/recruit/candidate-inline-card.tsx
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { InteractiveCard } from "@epicbagel/saas-kit/primitives/interactive-card";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { useId } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var META_LINE_GLYPHS = "[&>svg]:inline-block [&>svg]:align-[-0.125em] [&>svg]:me-1.5";
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
  nameSize = "default",
  headlineWrap = false,
  actionsAlign = "start",
  "aria-expanded": ariaExpanded,
  className,
  ...props
}) {
  const generatedId = useId();
  const nameId = `${generatedId}-name`;
  const actionId = `${generatedId}-action`;
  const compact = density === "compact";
  const centreActions = !compact && actionsAlign === "center";
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
                      /* @__PURE__ */ jsx(
                        Heading,
                        {
                          id: nameId,
                          level: 5,
                          appearance: compact ? "compact" : nameSize === "lg" ? "section" : "default",
                          truncate: true,
                          children: name
                        }
                      ),
                      status
                    ] }),
                    headline != null ? (
                      // A compact row is a fixed height: the caption's relaxed leading would push the lines apart.
                      /* @__PURE__ */ jsx(
                        Text,
                        {
                          "data-slot": "candidate-inline-card-headline",
                          variant: "caption",
                          size: compact ? "xs" : "sm",
                          leading: compact ? "snug" : "normal",
                          truncate: compact || !headlineWrap,
                          marginTop: compact ? "none" : "tight",
                          children: headline
                        }
                      )
                    ) : null,
                    meta != null ? /* @__PURE__ */ jsx(
                      Text,
                      {
                        "data-slot": "candidate-inline-card-meta",
                        variant: "caption",
                        size: "xs",
                        leading: compact ? "snug" : "normal",
                        truncate: compact,
                        marginTop: compact ? "none" : "xs",
                        className: META_LINE_GLYPHS,
                        children: meta
                      }
                    ) : null,
                    assessment != null ? /* @__PURE__ */ jsx(Stack, { gap: "none", marginTop: compact ? "sm" : "md", children: assessment }) : null
                  ] }),
                  actions != null ? (
                    // No box of its own, so the actions stay items of the row; it
                    // only carries a compact row's touch targets, or the centring, to
                    // its controls.
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        "data-slot": "candidate-inline-card-actions",
                        className: compact ? `contents ${COARSE_POINTER_TOUCH_TARGETS_WITHIN}` : centreActions ? "contents [&>*]:self-center" : "contents",
                        children: actions
                      }
                    )
                  ) : null
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
