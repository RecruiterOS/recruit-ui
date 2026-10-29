import {
  jobBriefLabels,
  jobBriefVersionLabel
} from "./chunk-A3XKZFTB.js";
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
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { List, ListItem } from "@epicbagel/saas-kit/primitives/list";
import { Skeleton } from "@epicbagel/saas-kit/primitives/skeleton";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { StatusBadge } from "@epicbagel/saas-kit/primitives/status-badge";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { FileText, Loader2 } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_LABELS = {
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
var COLLAPSIBLE_TRIGGER = "gap-4 p-[26px] text-[length:inherit] data-[state=open]:pb-4";
var COLLAPSIBLE_BODY = "px-[26px] pb-[26px]";
var SECTION_LABEL = "text-xs font-medium uppercase tracking-wider";
var EDITABLE_LIST = [
  "pointer-coarse:[&_button]:opacity-100",
  "pointer-coarse:[&_input]:min-h-[max(44px,2.75rem)]",
  COARSE_POINTER_TOUCH_TARGETS_WITHIN
].join(" ");
function present(value) {
  return value != null && value !== false && value !== "";
}
function sectionRows(section) {
  return (section.facts?.length ?? 0) + (section.items?.length ?? 0);
}
function versionBadges(version) {
  if (!version) return null;
  const secondary = version.secondaryLabel?.trim();
  return (
    // Phrasing content throughout, so it can sit in the collapsible's trigger.
    /* @__PURE__ */ jsxs(
      Stack,
      {
        as: "span",
        "data-slot": "job-brief-version",
        "data-current": version.current ? "true" : "false",
        direction: "horizontal",
        gap: "xs",
        align: "center",
        children: [
          /* @__PURE__ */ jsx(StatusBadge, { as: "span", tone: version.current ? "success" : "neutral", children: jobBriefVersionLabel(version) }),
          secondary ? /* @__PURE__ */ jsx(StatusBadge, { as: "span", tone: "neutral", children: secondary }) : null
        ]
      }
    )
  );
}
function BriefHeader({
  title,
  status,
  version,
  titleId,
  statusId,
  heading
}) {
  const as = heading ? "div" : "span";
  const hasStatus = present(status);
  return (
    // In the trigger the row takes the width the chevron leaves.
    /* @__PURE__ */ jsxs(Stack, { as, direction: "horizontal", gap: "md", align: "start", justify: "between", grow: !heading, minWidth: "zero", children: [
      /* @__PURE__ */ jsx(Stack, { as, grow: true, minWidth: "zero", children: /* @__PURE__ */ jsx(Heading, { id: titleId, level: 3, as: heading ?? "span", children: title }) }),
      version ? /* @__PURE__ */ jsxs(Stack, { as, id: statusId, shrink: false, direction: "horizontal", gap: "xs", align: "center", children: [
        version,
        hasStatus ? status : null
      ] }) : hasStatus ? /* @__PURE__ */ jsx(Stack, { as, id: statusId, shrink: false, children: status }) : null
    ] })
  );
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
      className: onRulesChange ? EDITABLE_LIST : void 0
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
      // The same kit bullet row EditableList uses for the requirements.
      /* @__PURE__ */ jsx(
        List,
        {
          ordered: section.ordered,
          marker: section.ordered ? "decimal" : "none",
          spacing: "normal",
          textSize: "sm",
          children: items.map((item, index) => /* @__PURE__ */ jsx(ListItem, { layout: section.ordered ? "plain" : "bullet", children: item }, index))
        }
      )
    ) : null
  ] });
}
function JobBriefCard({
  presentation = "collapsible",
  title = jobBriefLabels.title,
  titleLevel = 2,
  status,
  version,
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
  ruleLabels,
  labels,
  ...props
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const ruleText = { ...jobBriefLabels, ...ruleLabels };
  const titleId = useId();
  const statusId = useId();
  const bodyId = useId();
  const versionStatus = versionBadges(version);
  const labelledBy = versionStatus || present(status) ? `${titleId} ${statusId}` : titleId;
  const header = (heading) => /* @__PURE__ */ jsx(
    BriefHeader,
    {
      title,
      status,
      version: versionStatus,
      titleId,
      statusId,
      heading
    }
  );
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
      label: ruleText[kind],
      itemName: ruleText[ITEM_NAME[kind]],
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
    return /* @__PURE__ */ jsx(
      Stack,
      {
        as: "section",
        "data-slot": "job-brief-card",
        "data-presentation": "collapsible",
        "aria-labelledby": labelledBy,
        gap: "none",
        ...props,
        children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(
          CollapsibleSection,
          {
            title: header(),
            open,
            defaultOpen,
            onOpenChange,
            density: "roomy",
            divided: false,
            inset: "none",
            triggerClassName: COLLAPSIBLE_TRIGGER,
            contentClassName: COLLAPSIBLE_BODY,
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
  const hasBody = full || notice !== null || hasDescription || count > 0 && (facts.length > 0 || first !== void 0 && lists[first].length > 0);
  return /* @__PURE__ */ jsx(
    Stack,
    {
      as: "section",
      "data-slot": "job-brief-card",
      "data-presentation": "preview",
      "aria-labelledby": labelledBy,
      gap: "none",
      ...props,
      children: /* @__PURE__ */ jsx(Card, { padding: "md", children: /* @__PURE__ */ jsxs(Stack, { gap: "md", children: [
        header(`h${titleLevel}`),
        blank ?? (hasBody ? /* @__PURE__ */ jsx(Stack, { id: bodyId, gap: "md", children: full ? fullBody : /* @__PURE__ */ jsxs(Fragment, { children: [
          notice,
          hasDescription ? /* @__PURE__ */ jsx(Text, { as: "div", variant: "caption", lineClamp: 2, children: description }) : null,
          count > 0 && facts.length > 0 ? /* @__PURE__ */ jsx(BriefFacts, { facts: facts.slice(0, count), bordered: true }) : null,
          count > 0 && first ? ruleList(first, lists[first].slice(0, count), false) : null
        ] }) }) : null),
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
