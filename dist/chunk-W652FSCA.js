import {
  InteractiveCard,
  shouldActivateCandidateCard
} from "./chunk-CPJ5NWOZ.js";
import {
  FlexItem
} from "./chunk-GH26CGAD.js";
import {
  Heading
} from "./chunk-M54IMGNH.js";
import {
  Text
} from "./chunk-BUGVD7FT.js";
import {
  Stack
} from "./chunk-PPARPLPM.js";

// src/recruit/candidate-inline-card.tsx
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
      "data-slot": "candidate-inline-card",
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
            className: "px-5 py-4",
            onClick: onSelect ? (event) => {
              if (shouldActivateCandidateCard(event)) onSelect();
            } : void 0,
            children: /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "compact", align: "start", children: [
              avatar,
              /* @__PURE__ */ jsxs(FlexItem, { grow: true, minWidth: "zero", children: [
                /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", wrap: true, children: [
                  /* @__PURE__ */ jsx(Heading, { id: nameId, level: 5, truncate: true, children: name }),
                  status
                ] }),
                headline != null ? /* @__PURE__ */ jsx(Text, { variant: "caption", size: "sm", truncate: true, marginTop: "tight", children: headline }) : null,
                meta != null ? /* @__PURE__ */ jsx(Text, { variant: "caption", size: "xs", marginTop: "xs", children: meta }) : null,
                assessment != null ? /* @__PURE__ */ jsx(Stack, { gap: "none", marginTop: "md", children: assessment }) : null
              ] }),
              actions
            ] })
          }
        )
      ]
    }
  );
}

export {
  CandidateInlineCard
};
