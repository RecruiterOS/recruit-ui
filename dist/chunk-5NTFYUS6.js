// src/recruit/candidate-signal-list.tsx
import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Card } from "@epicbagel/saas-kit/primitives/card";
import { DefinitionItem, DefinitionList } from "@epicbagel/saas-kit/primitives/definition-list";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Skeleton } from "@epicbagel/saas-kit/primitives/skeleton";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Radar } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
function CandidateSignalList({
  title,
  items,
  loading = false,
  error,
  empty = { title: "No signals yet" },
  ...props
}) {
  const hasError = error != null && error !== false && error !== "";
  return /* @__PURE__ */ jsxs(PanelSection, { "data-slot": "candidate-signal-list", ...props, children: [
    /* @__PURE__ */ jsx(SectionHeader, { label: title, count: loading ? void 0 : items.length }),
    loading ? /* @__PURE__ */ jsxs(Stack, { gap: "sm", marginTop: "md", children: [
      /* @__PURE__ */ jsx(Skeleton, { preset: "card-sm", radius: "xl" }),
      /* @__PURE__ */ jsx(Skeleton, { preset: "card-sm", radius: "xl" })
    ] }) : hasError ? /* @__PURE__ */ jsx(Text, { size: "sm", tone: "destructive", marginTop: "md", children: error }) : items.length === 0 ? /* @__PURE__ */ jsx(
      EmptyState,
      {
        variant: "empty",
        size: "inline",
        icon: Radar,
        title: empty.title,
        description: empty.description
      }
    ) : /* @__PURE__ */ jsx(Stack, { gap: "md", marginTop: "md", children: items.map((item) => /* @__PURE__ */ jsx(Card, { padding: "row", surface: "muted", children: /* @__PURE__ */ jsxs(Stack, { gap: "md", children: [
      /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "start", justify: "between", children: [
        /* @__PURE__ */ jsxs(Stack, { gap: "xs", children: [
          /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "xs", align: "center", children: [
            /* @__PURE__ */ jsx(Badge, { size: "micro", transform: "uppercase", font: "sans", weight: "semibold", children: item.kind }),
            item.status != null && item.status !== false && /* @__PURE__ */ jsx(Badge, { size: "micro", variant: "outline", transform: "uppercase", font: "sans", children: item.status })
          ] }),
          item.detectedAt
        ] }),
        item.actions
      ] }),
      /* @__PURE__ */ jsx(Text, { size: "sm", weight: "medium", children: item.summary }),
      item.details && item.details.length > 0 && /* @__PURE__ */ jsx(DefinitionList, { variant: "divided", children: item.details.map((detail, index) => /* @__PURE__ */ jsx(DefinitionItem, { label: detail.label, children: /* @__PURE__ */ jsx(Text, { size: "sm", children: detail.value }) }, index)) })
    ] }) }, item.id)) })
  ] });
}

export {
  CandidateSignalList
};
