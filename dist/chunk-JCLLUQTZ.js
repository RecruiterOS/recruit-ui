import {
  usePendingCall
} from "./chunk-SBRXJRL4.js";
import {
  COARSE_POINTER_TOUCH_TARGET,
  COARSE_POINTER_TOUCH_TARGETS_WITHIN
} from "./chunk-YKEE5RQG.js";

// src/recruit/job-brief-card.tsx
import { Alert, AlertDescription } from "@epicbagel/saas-kit/primitives/alert";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Card } from "@epicbagel/saas-kit/primitives/card";
import { CollapsibleSection } from "@epicbagel/saas-kit/primitives/collapsible-section";
import { DefinitionItem, DefinitionList } from "@epicbagel/saas-kit/primitives/definition-list";
import { EditableList } from "@epicbagel/saas-kit/primitives/editable-list";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { List, ListItem } from "@epicbagel/saas-kit/primitives/list";
import { Skeleton } from "@epicbagel/saas-kit/primitives/skeleton";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { FileText, Loader2 } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_LABELS = {
  mustHaves: "Must haves",
  niceToHaves: "Nice to haves",
  redFlags: "Red flags",
  mustHaveItem: "must have",
  niceToHaveItem: "nice to have",
  redFlagItem: "red flag",
  processing: "Reading your document. The brief will fill in shortly.",
  processingTitle: "Reading your document",
  processingDescription: "The brief will fill in shortly.",
  showMore: (hidden) => hidden > 0 ? `Show full brief (${hidden} more)` : "Show full brief",
  showLess: "Show less"
};
var RULE_KINDS = ["mustHaves", "niceToHaves", "redFlags"];
var NO_ITEMS = [];
var NO_FACTS = [];
var NO_SECTIONS = [];
var SENTIMENT = {
  mustHaves: "positive",
  niceToHaves: "warning",
  redFlags: "negative"
};
var ITEM_NAME = {
  mustHaves: "mustHaveItem",
  niceToHaves: "niceToHaveItem",
  redFlags: "redFlagItem"
};
var SECTION_LABEL = "text-xs font-medium uppercase tracking-wider";
var RULE_LIST = "[&_li]:[overflow-wrap:anywhere] [&_li>*]:min-w-0";
var EDITABLE_LIST = [
  "pointer-coarse:[&_button]:opacity-100",
  "pointer-coarse:[&_input]:min-h-[max(44px,2.75rem)]",
  "pointer-coarse:[&_li]:items-center",
  "pointer-coarse:[&_li>:first-child]:mt-0",
  COARSE_POINTER_TOUCH_TARGETS_WITHIN
].join(" ");
function present(value) {
  return value != null && value !== false && value !== "";
}
function sectionRows(section) {
  return (section.facts?.length ?? 0) + (section.items?.length ?? 0);
}
function BriefFacts({ facts, bordered }) {
  return /* @__PURE__ */ jsx(DefinitionList, { variant: "divided", className: bordered ? "border-t" : void 0, children: facts.map((fact) => /* @__PURE__ */ jsx(DefinitionItem, { label: fact.label, children: fact.value }, fact.id)) });
}
function RuleList({
  kind,
  items,
  label,
  itemName,
  level,
  onRulesChange
}) {
  const [pending, save, sent] = usePendingCall(onRulesChange);
  const shown = pending && sent ? sent[1] : items;
  if (!onRulesChange && shown.length === 0) return null;
  return /* @__PURE__ */ jsx(Stack, { "data-slot": "job-brief-rule-list", "data-kind": kind, "aria-busy": pending || void 0, gap: "none", children: /* @__PURE__ */ jsx(
    EditableList,
    {
      label: /* @__PURE__ */ jsx("span", { role: "heading", "aria-level": level, children: label }),
      itemName,
      sentiment: SENTIMENT[kind],
      items: [...shown],
      onChange: onRulesChange ? (next) => save(kind, next) : void 0,
      className: onRulesChange ? `${RULE_LIST} ${EDITABLE_LIST}` : RULE_LIST
    }
  ) });
}
function BriefSection({ section, level }) {
  const facts = section.facts ?? NO_FACTS;
  const items = section.items ?? [];
  if (facts.length === 0 && items.length === 0) return null;
  return /* @__PURE__ */ jsxs(Stack, { "data-slot": "job-brief-section", border: "top", paddingTop: "base", gap: "compact", children: [
    /* @__PURE__ */ jsx(Text, { as: `h${level}`, variant: "inherit", children: /* @__PURE__ */ jsx(Text, { as: "span", variant: "caption", className: SECTION_LABEL, children: section.title }) }),
    facts.length > 0 ? /* @__PURE__ */ jsx(BriefFacts, { facts }) : null,
    items.length > 0 ? (
      // The rule lists' rhythm: small type, 12px between entries.
      /* @__PURE__ */ jsx(
        List,
        {
          ordered: section.ordered,
          marker: section.ordered ? "decimal" : "disc",
          spacing: "normal",
          textSize: "sm",
          children: items.map((item, index) => /* @__PURE__ */ jsx(ListItem, { children: item }, index))
        }
      )
    ) : null
  ] });
}
function JobBriefCard({
  presentation = "collapsible",
  title = "Job brief",
  titleLevel = 2,
  status,
  description,
  facts = NO_FACTS,
  mustHaves = NO_ITEMS,
  niceToHaves = NO_ITEMS,
  redFlags = NO_ITEMS,
  rules = RULE_KINDS,
  onRulesChange,
  sections = NO_SECTIONS,
  footer,
  processing = false,
  loading = false,
  open,
  defaultOpen = false,
  onOpenChange,
  previewCount = 3,
  empty = { title: "No brief yet" },
  labels,
  ...props
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const titleId = useId();
  const bodyId = useId();
  const [openState, setOpenState] = useState(defaultOpen);
  const expanded = open ?? openState;
  const setExpanded = (next) => {
    if (open === void 0) setOpenState(next);
    onOpenChange?.(next);
  };
  const returnTo = useRef(null);
  useEffect(() => {
    const card = returnTo.current;
    if (expanded || !card) return;
    returnTo.current = null;
    if (typeof card.scrollIntoView === "function") card.scrollIntoView({ block: "nearest" });
  }, [expanded]);
  const lists = { mustHaves, niceToHaves, redFlags };
  const shownRules = rules.filter((kind, index) => RULE_KINDS.includes(kind) && rules.indexOf(kind) === index);
  const editable = onRulesChange != null;
  const subLevel = presentation === "collapsible" ? titleLevel : titleLevel + 1;
  const hasDescription = present(description);
  const hasContent = hasDescription || facts.length > 0 || shownRules.some((kind) => lists[kind].length > 0) || sections.some((section) => sectionRows(section) > 0);
  const state = hasContent ? "content" : loading ? "loading" : editable ? "content" : processing ? "processing" : "empty";
  const blank = state === "loading" ? /* @__PURE__ */ jsxs(Stack, { "data-slot": "job-brief-loading", "aria-busy": true, gap: "sm", children: [
    /* @__PURE__ */ jsx(Skeleton, { preset: "line-full" }),
    /* @__PURE__ */ jsx(Skeleton, { preset: "line-wide" }),
    /* @__PURE__ */ jsx(Skeleton, { preset: "row-compact" }),
    /* @__PURE__ */ jsx(Skeleton, { preset: "row-compact" })
  ] }) : state === "processing" ? /* @__PURE__ */ jsx(
    EmptyState,
    {
      variant: "empty",
      size: "inline",
      icon: Loader2,
      iconMotion: "spin",
      title: text.processingTitle,
      description: text.processingDescription
    }
  ) : state === "empty" ? /* @__PURE__ */ jsx(
    EmptyState,
    {
      variant: "empty",
      size: "inline",
      icon: FileText,
      title: empty.title,
      description: empty.description ?? ""
    }
  ) : null;
  const notice = processing ? /* @__PURE__ */ jsxs(Alert, { children: [
    /* @__PURE__ */ jsx(Icon, { icon: Loader2, size: "sm", spin: true }),
    /* @__PURE__ */ jsx(AlertDescription, { children: text.processing })
  ] }) : null;
  const ruleList = (kind, items, canEdit) => /* @__PURE__ */ jsx(
    RuleList,
    {
      kind,
      items,
      label: text[kind],
      itemName: text[ITEM_NAME[kind]],
      level: subLevel,
      onRulesChange: canEdit ? onRulesChange : void 0
    },
    kind
  );
  const fullBody = /* @__PURE__ */ jsxs(Fragment, { children: [
    notice,
    hasDescription ? /* @__PURE__ */ jsx(Text, { as: "div", variant: "caption", children: description }) : null,
    facts.length > 0 ? /* @__PURE__ */ jsx(BriefFacts, { facts, bordered: true }) : null,
    shownRules.map((kind) => ruleList(kind, lists[kind], editable)),
    sections.map((section) => /* @__PURE__ */ jsx(BriefSection, { section, level: subLevel }, section.id))
  ] });
  if (presentation === "collapsible") {
    const label = /* @__PURE__ */ jsx("span", { id: titleId, children: title });
    return /* @__PURE__ */ jsx(
      Stack,
      {
        as: "section",
        "data-slot": "job-brief-card",
        "data-presentation": "collapsible",
        "aria-labelledby": titleId,
        gap: "none",
        ...props,
        children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(
          CollapsibleSection,
          {
            title: present(status) ? /* @__PURE__ */ jsxs(Stack, { as: "span", direction: "horizontal", gap: "sm", align: "center", minWidth: "zero", children: [
              label,
              status
            ] }) : label,
            open,
            defaultOpen,
            onOpenChange,
            density: "roomy",
            divided: false,
            inset: "default",
            children: [
              blank ?? fullBody,
              state === "loading" ? null : footer
            ]
          }
        ) })
      }
    );
  }
  const count = Math.max(0, Math.floor(previewCount));
  const first = shownRules.find((kind) => lists[kind].length > 0) ?? shownRules[0];
  const hidden = Math.max(0, facts.length - count) + shownRules.reduce(
    (sum, kind) => sum + (kind === first ? Math.max(0, lists[kind].length - count) : lists[kind].length),
    0
  ) + sections.reduce((sum, section) => sum + sectionRows(section), 0);
  const hasToggle = state === "content" && (hidden > 0 || editable);
  const full = !hasToggle || expanded;
  return /* @__PURE__ */ jsx(
    Stack,
    {
      as: "section",
      "data-slot": "job-brief-card",
      "data-presentation": "preview",
      "aria-labelledby": titleId,
      gap: "none",
      ...props,
      children: /* @__PURE__ */ jsx(Card, { padding: "md", children: /* @__PURE__ */ jsxs(Stack, { gap: "md", children: [
        /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "md", align: "start", justify: "between", children: [
          /* @__PURE__ */ jsx(FlexItem, { grow: true, minWidth: "zero", children: /* @__PURE__ */ jsx(Heading, { id: titleId, level: 3, as: `h${titleLevel}`, children: title }) }),
          present(status) ? /* @__PURE__ */ jsx(FlexItem, { shrink: false, children: status }) : null
        ] }),
        blank ?? /* @__PURE__ */ jsx(Stack, { id: bodyId, gap: "md", children: full ? fullBody : /* @__PURE__ */ jsxs(Fragment, { children: [
          notice,
          hasDescription ? /* @__PURE__ */ jsx(Text, { as: "div", variant: "caption", lineClamp: 2, children: description }) : null,
          count > 0 && facts.length > 0 ? /* @__PURE__ */ jsx(BriefFacts, { facts: facts.slice(0, count), bordered: true }) : null,
          count > 0 && first ? ruleList(first, lists[first].slice(0, count), false) : null
        ] }) }),
        hasToggle ? /* @__PURE__ */ jsx(Stack, { direction: "horizontal", gap: "none", children: /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "link-muted",
            size: "bare",
            align: "start",
            "aria-expanded": expanded,
            "aria-controls": expanded ? bodyId : void 0,
            onClick: (event) => {
              if (expanded) {
                returnTo.current = event.currentTarget.closest('[data-slot="job-brief-card"]');
              }
              setExpanded(!expanded);
            },
            className: COARSE_POINTER_TOUCH_TARGET,
            children: expanded ? text.showLess : text.showMore(hidden)
          }
        ) }) : null,
        state === "loading" ? null : footer
      ] }) })
    }
  );
}

export {
  JobBriefCard
};
