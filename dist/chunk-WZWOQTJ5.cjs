"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }


var _chunk4X4JMHXAcjs = require('./chunk-4X4JMHXA.cjs');

// src/recruit/candidate-card-list.tsx
var _grid = require('@epicbagel/saas-kit/primitives/grid');
var _resourcelist = require('@epicbagel/saas-kit/primitives/resource-list');
var _scrollnavigator = require('@epicbagel/saas-kit/primitives/scroll-navigator');
var _skeleton = require('@epicbagel/saas-kit/primitives/skeleton');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
function CandidateCardList({
  getItemKey,
  columnsViewId,
  columnsLabels,
  scrollNavigation,
  renderItem,
  renderLoading,
  actions,
  filterActions,
  ...props
}) {
  const { columns, setColumns } = _chunk4X4JMHXAcjs.useCandidateCardColumns.call(void 0, columnsViewId);
  const renderGrid = (items) => scrollNavigation ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "vertical", gap: "none", "data-slot": "candidate-card-list", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _scrollnavigator.ScrollNavigator,
    {
      label: scrollNavigation.label,
      topOffset: scrollNavigation.topOffset,
      columns,
      items: items.map((item, index) => ({
        ...scrollNavigation.getItem(item, index),
        id: String(getItemKey(item, index)),
        content: renderItem(item, index)
      }))
    }
  ) }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _grid.Grid, { columns, gap: "md", responsive: true, "data-slot": "candidate-card-list", children: items.map((item, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _react.Fragment, { children: renderItem(item, index) }, getItemKey(item, index))) });
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _resourcelist.ResourceList,
    {
      ...props,
      showTitle: false,
      variant: "flush",
      quickFiltersAppearance: "underline",
      showViewToggle: false,
      viewMode: "table",
      actions,
      filterActions: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "center", children: [
        filterActions,
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunk4X4JMHXAcjs.CandidateCardColumnsToggle,
          {
            columns,
            onChange: setColumns,
            roomy: true,
            labels: columnsLabels
          }
        )
      ] }),
      renderItem,
      renderTable: renderGrid,
      renderLoading: _nullishCoalesce(renderLoading, () => ( (() => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _grid.Grid, { columns, gap: "md", responsive: true, "data-slot": "candidate-card-list-loading", children: [1, 2, 3, 4].map((item) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _skeleton.Skeleton, { preset: "panel", radius: "xl" }, item)) }))))
    }
  );
}



exports.CandidateCardList = CandidateCardList;
