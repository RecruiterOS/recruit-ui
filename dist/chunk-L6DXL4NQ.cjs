"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkK3VUGGWHcjs = require('./chunk-K3VUGGWH.cjs');


var _chunkZJZS63R6cjs = require('./chunk-ZJZS63R6.cjs');

// src/recruit/candidate-review-card.tsx
var _definitionlist = require('@epicbagel/saas-kit/primitives/definition-list');
var _flexitem = require('@epicbagel/saas-kit/primitives/flex-item');
var _grid = require('@epicbagel/saas-kit/primitives/grid');
var _heading = require('@epicbagel/saas-kit/primitives/heading');
var _interactivecard = require('@epicbagel/saas-kit/primitives/interactive-card');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _spacer = require('@epicbagel/saas-kit/primitives/spacer');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
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
    _interactivecard.InteractiveCard,
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
              if (_chunkK3VUGGWHcjs.shouldActivateCandidateCard.call(void 0, event)) onSelect();
            } : void 0,
            children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "none", height: "full", children: [
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _flexitem.FlexItem, { grow: true, minHeight: "zero", children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkZJZS63R6cjs.CandidateCoverHeader, { cover, padding: "lg", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                  _grid.Grid,
                  {
                    columns: null,
                    gap: "md",
                    className: "grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start",
                    children: [
                      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "md", align: "start", minWidth: "zero", children: [
                        avatar,
                        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _flexitem.FlexItem, { grow: true, minWidth: "zero", children: [
                          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _heading.Heading, { id: nameId, level: 3, children: name }),
                          headline != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "caption", size: "sm", marginTop: "xs", children: headline }) : null
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
                facts.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionList, { inset: "lg", className: "border-y", children: facts.map((fact, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionItem, { label: fact.label, children: fact.value }, index)) }) : null,
                insight != null ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _spacer.Spacer, { size: "xs" }),
                  /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _panelsection.PanelSection, { border: "bottom", surface: "muted", padding: "default", children: [
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "eyebrow", marginBottom: "sm", children: insight.label }),
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "muted", size: "sm", children: insight.value })
                  ] })
                ] }) : null
              ] }),
              actions,
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _spacer.Spacer, { size: "md" })
            ] })
          }
        )
      ]
    }
  );
}



exports.CandidateReviewCard = CandidateReviewCard;
