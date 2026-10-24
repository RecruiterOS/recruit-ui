"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }


var _chunk5ZGBOOWMcjs = require('./chunk-5ZGBOOWM.cjs');


var _chunkJIEUQ5CKcjs = require('./chunk-JIEUQ5CK.cjs');



var _chunk32U4U2ULcjs = require('./chunk-32U4U2UL.cjs');


var _chunk52HKAJMEcjs = require('./chunk-52HKAJME.cjs');


var _chunkRTB3COSUcjs = require('./chunk-RTB3COSU.cjs');


var _chunkVCJ24CC5cjs = require('./chunk-VCJ24CC5.cjs');


var _chunkR52RM2CDcjs = require('./chunk-R52RM2CD.cjs');


var _chunkYMPXXC7Bcjs = require('./chunk-YMPXXC7B.cjs');


var _chunk42BCVSWNcjs = require('./chunk-42BCVSWN.cjs');

// vendor/core/files/src/primitives/grid.tsx
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
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
var Grid = _react.forwardRef.call(void 0, function Grid2({ columns = 2, gap = "md", responsive = true, layout = "grid", maxWidth = "none", centered = false, template = "equal", as, className, ...props }, ref) {
  const Component = _nullishCoalesce(as, () => ( "div"));
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    Component,
    {
      ref,
      className: _chunk42BCVSWNcjs.cn.call(void 0,
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

var sizes = {
  xs: "h-1",
  sm: "h-2",
  md: "h-3",
  lg: "h-6",
  xl: "h-24"
};
function Spacer({ size = "md", paddingBottom = "none", className, "aria-hidden": ariaHidden = true, ...props }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "aria-hidden": ariaHidden, className: _chunk42BCVSWNcjs.cn.call(void 0, sizes[size], paddingBottom === "sm" && "pb-2", className), ...props });
}

// src/recruit/candidate-review-card.tsx


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
  const generatedId = _react.useId.call(void 0, );
  const nameId = `${generatedId}-name`;
  const actionId = `${generatedId}-action`;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _chunk5ZGBOOWMcjs.InteractiveCard,
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
        onSelect ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
            children: selectLabel === "Open candidate review" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { id: actionId, className: "sr-only", children: selectLabel }) : null
          }
        ) : null,
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "div",
          {
            "data-slot": "candidate-review-card-content",
            className: "h-full",
            onClick: onSelect ? (event) => {
              if (_chunk5ZGBOOWMcjs.shouldActivateCandidateCard.call(void 0, event)) onSelect();
            } : void 0,
            children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkYMPXXC7Bcjs.Stack, { gap: "none", height: "full", children: [
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkJIEUQ5CKcjs.FlexItem, { grow: true, minHeight: "zero", children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVCJ24CC5cjs.CandidateCoverHeader, { cover, padding: "lg", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                  Grid,
                  {
                    columns: null,
                    gap: "md",
                    className: "grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start",
                    children: [
                      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkYMPXXC7Bcjs.Stack, { direction: "horizontal", gap: "md", align: "start", minWidth: "zero", children: [
                        avatar,
                        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkJIEUQ5CKcjs.FlexItem, { grow: true, minWidth: "zero", children: [
                          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk52HKAJMEcjs.Heading, { id: nameId, level: 3, children: name }),
                          headline != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkRTB3COSUcjs.Text, { variant: "caption", size: "sm", marginTop: "xs", children: headline }) : null
                        ] })
                      ] }),
                      headerActions != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
                facts.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk32U4U2ULcjs.DefinitionList, { inset: "lg", className: "border-y", children: facts.map((fact, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk32U4U2ULcjs.DefinitionItem, { label: fact.label, children: fact.value }, index)) }) : null,
                insight != null ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Spacer, { size: "xs" }),
                  /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkR52RM2CDcjs.PanelSection, { border: "bottom", surface: "muted", padding: "default", children: [
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkRTB3COSUcjs.Text, { variant: "eyebrow", marginBottom: "sm", children: insight.label }),
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkRTB3COSUcjs.Text, { variant: "muted", size: "sm", children: insight.value })
                  ] })
                ] }) : null
              ] }),
              actions,
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Spacer, { size: "md" })
            ] })
          }
        )
      ]
    }
  );
}



exports.CandidateReviewCard = CandidateReviewCard;
