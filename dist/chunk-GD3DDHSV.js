import {
  CandidateCardColumnsToggle,
  useCandidateCardColumns
} from "./chunk-4JMEZ7QY.js";

// src/recruit/candidate-card-list.tsx
import { Grid } from "@epicbagel/saas-kit/primitives/grid";
import { ResourceList } from "@epicbagel/saas-kit/primitives/resource-list";
import { ScrollNavigator } from "@epicbagel/saas-kit/primitives/scroll-navigator";
import { Skeleton } from "@epicbagel/saas-kit/primitives/skeleton";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
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
  const { columns, setColumns } = useCandidateCardColumns(columnsViewId);
  const renderGrid = (items) => scrollNavigation ? /* @__PURE__ */ jsx(Stack, { direction: "vertical", gap: "none", "data-slot": "candidate-card-list", children: /* @__PURE__ */ jsx(
    ScrollNavigator,
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
  ) }) : /* @__PURE__ */ jsx(Grid, { columns, gap: "md", responsive: true, "data-slot": "candidate-card-list", children: items.map((item, index) => /* @__PURE__ */ jsx(Fragment, { children: renderItem(item, index) }, getItemKey(item, index))) });
  return /* @__PURE__ */ jsx(
    ResourceList,
    {
      ...props,
      showTitle: false,
      variant: "flush",
      quickFiltersAppearance: "underline",
      showViewToggle: false,
      viewMode: "table",
      actions,
      filterActions: /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", children: [
        filterActions,
        /* @__PURE__ */ jsx(
          CandidateCardColumnsToggle,
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
      renderLoading: renderLoading ?? (() => /* @__PURE__ */ jsx(Grid, { columns, gap: "md", responsive: true, "data-slot": "candidate-card-list-loading", children: [1, 2, 3, 4].map((item) => /* @__PURE__ */ jsx(Skeleton, { preset: "panel", radius: "xl" }, item)) }))
    }
  );
}

export {
  CandidateCardList
};
