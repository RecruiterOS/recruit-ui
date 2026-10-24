import {
  InteractiveCard,
  shouldActivateCandidateCard
} from "./chunk-CPJ5NWOZ.js";
import {
  FlexItem
} from "./chunk-GH26CGAD.js";
import {
  DefinitionItem,
  DefinitionList
} from "./chunk-QH22TH6O.js";
import {
  Heading
} from "./chunk-M54IMGNH.js";
import {
  Text
} from "./chunk-BUGVD7FT.js";
import {
  CandidateCoverHeader
} from "./chunk-THJB574S.js";
import {
  PanelSection
} from "./chunk-BS52KYLO.js";
import {
  Stack
} from "./chunk-PPARPLPM.js";
import {
  cn
} from "./chunk-WTFE3OMU.js";

// vendor/core/files/src/primitives/grid.tsx
import { forwardRef } from "react";
import { jsx } from "react/jsx-runtime";
var fixedColumns = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4"
};
var responsiveColumns = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
};
var gaps = { sm: "gap-2", compact: "gap-3", md: "gap-4", lg: "gap-6" };
var Grid = forwardRef(function Grid2({ columns = 2, gap = "md", responsive = true, layout = "grid", maxWidth = "none", centered = false, template = "equal", as, className, ...props }, ref) {
  const Component = as ?? "div";
  return /* @__PURE__ */ jsx(
    Component,
    {
      ref,
      className: cn(
        layout === "grid" ? "grid" : "grid sm:flex sm:justify-end",
        layout === "grid" && template === "equal" && columns !== null && (responsive ? responsiveColumns[columns] : fixedColumns[columns]),
        layout === "responsive-actions" && columns !== null && fixedColumns[columns],
        template === "compact-leading-three" && "grid-cols-[5rem_1fr_1fr]",
        template === "responsive-form-row-six" && "grid-cols-1 items-center sm:grid-cols-[1fr_1.4fr_1fr_1fr_1fr_auto]",
        template === "master-detail" && "grid-cols-1 lg:grid-cols-[360px_1fr]",
        template === "gallery" && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        gaps[gap],
        maxWidth === "xl" && "max-w-2xl",
        centered && "mx-auto",
        className
      ),
      ...props
    }
  );
});

// vendor/core/files/src/primitives/spacer.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var sizes = {
  xs: "h-1",
  sm: "h-2",
  md: "h-3",
  lg: "h-6",
  xl: "h-24"
};
function Spacer({ size = "md", paddingBottom = "none", className, "aria-hidden": ariaHidden = true, ...props }) {
  return /* @__PURE__ */ jsx2("div", { "aria-hidden": ariaHidden, className: cn(sizes[size], paddingBottom === "sm" && "pb-2", className), ...props });
}

// src/recruit/candidate-review-card.tsx
import { useId } from "react";
import { Fragment, jsx as jsx3, jsxs } from "react/jsx-runtime";
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
        onSelect ? /* @__PURE__ */ jsx3(
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
            children: selectLabel === "Open candidate review" ? /* @__PURE__ */ jsx3("span", { id: actionId, className: "sr-only", children: selectLabel }) : null
          }
        ) : null,
        /* @__PURE__ */ jsx3(
          "div",
          {
            "data-slot": "candidate-review-card-content",
            className: "h-full",
            onClick: onSelect ? (event) => {
              if (shouldActivateCandidateCard(event)) onSelect();
            } : void 0,
            children: /* @__PURE__ */ jsxs(Stack, { gap: "none", height: "full", children: [
              /* @__PURE__ */ jsxs(FlexItem, { grow: true, minHeight: "zero", children: [
                /* @__PURE__ */ jsx3(CandidateCoverHeader, { cover, padding: "lg", children: /* @__PURE__ */ jsxs(
                  Grid,
                  {
                    columns: null,
                    gap: "md",
                    className: "grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start",
                    children: [
                      /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "md", align: "start", minWidth: "zero", children: [
                        avatar,
                        /* @__PURE__ */ jsxs(FlexItem, { grow: true, minWidth: "zero", children: [
                          /* @__PURE__ */ jsx3(Heading, { id: nameId, level: 3, children: name }),
                          headline != null ? /* @__PURE__ */ jsx3(Text, { variant: "caption", size: "sm", marginTop: "xs", children: headline }) : null
                        ] })
                      ] }),
                      headerActions != null ? /* @__PURE__ */ jsx3(
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
                facts.length > 0 ? /* @__PURE__ */ jsx3(DefinitionList, { inset: "lg", className: "border-y", children: facts.map((fact, index) => /* @__PURE__ */ jsx3(DefinitionItem, { label: fact.label, children: fact.value }, index)) }) : null,
                insight != null ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx3(Spacer, { size: "xs" }),
                  /* @__PURE__ */ jsxs(PanelSection, { border: "bottom", surface: "muted", padding: "default", children: [
                    /* @__PURE__ */ jsx3(Text, { variant: "eyebrow", marginBottom: "sm", children: insight.label }),
                    /* @__PURE__ */ jsx3(Text, { variant: "muted", size: "sm", children: insight.value })
                  ] })
                ] }) : null
              ] }),
              actions,
              /* @__PURE__ */ jsx3(Spacer, { size: "md" })
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
