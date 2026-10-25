"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/candidate-review-action-row.tsx
var _grid = require('@epicbagel/saas-kit/primitives/grid');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _jsxruntime = require('react/jsx-runtime');
function CandidateReviewActionRow({
  children,
  isolateClicks = false,
  layout = "inline",
  gap = "sm",
  ...props
}) {
  const onClick = isolateClicks ? (event) => event.stopPropagation() : void 0;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _panelsection.PanelSection,
    {
      "data-slot": "candidate-review-action-row",
      padding: "none",
      paddingX: "lg",
      paddingTop: "md",
      paddingBottom: "xs",
      ...props,
      children: layout === "split" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        _grid.Grid,
        {
          columns: 2,
          responsive: false,
          gap: "compact",
          layout: "responsive-actions",
          onClick,
          children
        }
      ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        _stack.Stack,
        {
          "data-slot": "candidate-review-action-row-controls",
          direction: "horizontal",
          gap,
          align: "center",
          wrap: true,
          border: "top",
          paddingTop: "md",
          onClick,
          children
        }
      )
    }
  );
}



exports.CandidateReviewActionRow = CandidateReviewActionRow;
