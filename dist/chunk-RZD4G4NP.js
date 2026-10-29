import {
  CandidateStageSelect
} from "./chunk-VOKP2HLR.js";

// src/recruit/candidate-pipeline-list.tsx
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { List, ListItem } from "@epicbagel/saas-kit/primitives/list";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { SentimentDot } from "@epicbagel/saas-kit/primitives/sentiment-dot";
import { Skeleton } from "@epicbagel/saas-kit/primitives/skeleton";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Briefcase, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
function present(value) {
  return value != null && value !== false && value !== "";
}
function CandidatePipelineList({
  title = "Pipeline",
  rows,
  loading = false,
  action,
  empty = { title: "No roles yet" },
  labels,
  border = "bottom",
  ...props
}) {
  const openLabel = labels?.open ?? "Open pipeline";
  return /* @__PURE__ */ jsxs(PanelSection, { "data-slot": "candidate-pipeline-list", border, ...props, children: [
    /* @__PURE__ */ jsx(SectionHeader, { label: title, count: loading ? void 0 : rows.length, action }),
    loading ? /* @__PURE__ */ jsx(Stack, { direction: "vertical", gap: "sm", children: /* @__PURE__ */ jsx(Skeleton, { preset: "control" }) }) : rows.length === 0 ? /* @__PURE__ */ jsx(
      EmptyState,
      {
        variant: "empty",
        size: "inline",
        icon: Briefcase,
        title: empty.title,
        description: empty.description
      }
    ) : /* @__PURE__ */ jsx(Stack, { direction: "vertical", gap: "sm", children: rows.map((row) => /* @__PURE__ */ jsxs(
      Stack,
      {
        direction: "vertical",
        gap: "xs",
        radius: "md",
        surface: "muted",
        padding: "sm",
        interaction: "group-hover-accent",
        children: [
          /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                onClick: () => row.onOpen?.(),
                size: "bare",
                minWidth: "zero",
                grow: true,
                align: "start",
                textAlign: "start",
                title: openLabel,
                children: /* @__PURE__ */ jsxs(Stack, { gap: "none", width: "full", children: [
                  /* @__PURE__ */ jsxs(Text, { size: "sm", weight: "medium", truncate: true, display: "inline-flex", children: [
                    row.title,
                    row.grade,
                    /* @__PURE__ */ jsx(Icon, { icon: ChevronRight, size: "xs", tone: "muted", visibility: "parent-hover" })
                  ] }),
                  present(row.subtitle) && /* @__PURE__ */ jsx(Text, { size: "xs", tone: "muted", truncate: true, children: row.subtitle })
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              CandidateStageSelect,
              {
                value: row.stage.value,
                options: row.stage.options,
                onChange: row.stage.onChange,
                controlSize: "compact",
                width: "compact",
                textSize: "xs",
                shrink: false
              }
            )
          ] }),
          row.children
        ]
      },
      row.id
    )) })
  ] });
}
var BULLET_LABELS = {
  generate: "Generate summary",
  refresh: "Refresh summary",
  generating: "Generating\u2026",
  sentiment: {
    positive: "Positive",
    neutral: "Neutral",
    warning: "Caution",
    negative: "Negative"
  }
};
function CandidateSummaryBullets({
  bullets,
  presentation = "compact",
  onGenerate,
  generating = false,
  generated = false,
  error,
  labels,
  ...props
}) {
  const wording = {
    ...BULLET_LABELS,
    ...labels,
    sentiment: { ...BULLET_LABELS.sentiment, ...labels?.sentiment }
  };
  return /* @__PURE__ */ jsxs(Stack, { "data-slot": "candidate-summary-bullets", gap: "none", ...props, children: [
    bullets.length > 0 ? /* @__PURE__ */ jsx(List, { spacing: "normal", inset: "xs", children: bullets.map((bullet, index) => /* @__PURE__ */ jsxs(
      ListItem,
      {
        layout: "row",
        textSize: presentation === "body" ? "sm" : "xs",
        tone: presentation === "body" ? "inherit" : "soft",
        children: [
          /* @__PURE__ */ jsx(SentimentDot, { sentiment: bullet.sentiment }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", "data-slot": "candidate-summary-bullet-sentiment", children: `${bullet.sentimentLabel ?? wording.sentiment[bullet.sentiment]}: ` }),
          /* @__PURE__ */ jsx(Text, { variant: "inherit", as: "span", grow: true, children: bullet.text })
        ]
      },
      index
    )) }) : null,
    onGenerate && /* @__PURE__ */ jsxs(
      Button,
      {
        type: "button",
        variant: "link-muted",
        size: "bare",
        marginTop: "xs",
        gap: "xs",
        onClick: () => onGenerate(),
        disabled: generating,
        children: [
          generating ? /* @__PURE__ */ jsx(Icon, { icon: Loader2, size: "xs", spin: true }) : /* @__PURE__ */ jsx(Icon, { icon: Sparkles, size: "xs" }),
          generating ? wording.generating : generated ? wording.refresh : wording.generate
        ]
      }
    ),
    present(error) && /* @__PURE__ */ jsx(Text, { variant: "micro", tone: "destructive", marginTop: "tight", children: error })
  ] });
}

export {
  CandidatePipelineList,
  CandidateSummaryBullets
};
