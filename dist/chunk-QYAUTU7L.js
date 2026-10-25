import {
  formatCalendarDate
} from "./chunk-KCKE3KQE.js";

// src/recruit/candidate-career-history-timeline.tsx
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { List, ListItem } from "@epicbagel/saas-kit/primitives/list";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Separator } from "@epicbagel/saas-kit/primitives/separator";
import { Skeleton } from "@epicbagel/saas-kit/primitives/skeleton";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function CareerDateRange({
  start,
  end,
  current = false,
  presentLabel = "Present",
  locale = "en"
}) {
  const startLabel = formatCalendarDate(start, locale);
  const endLabel = current ? presentLabel : formatCalendarDate(end, locale);
  if (!startLabel && !endLabel) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    startLabel,
    startLabel && endLabel ? /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: " \u2013 " }) : null,
    endLabel
  ] });
}
function companyGroupKey(item) {
  if (item.companyGroup?.trim()) return item.companyGroup.trim().toLocaleLowerCase();
  return typeof item.company === "string" ? item.company.trim().toLocaleLowerCase() || null : null;
}
function groupConsecutiveEmployments(items) {
  return items.reduce((groups, item) => {
    const key = companyGroupKey(item);
    const previous = groups.at(-1);
    if (key && previous?.key === key) {
      previous.items.push(item);
    } else {
      groups.push({ key, items: [item] });
    }
    return groups;
  }, []);
}
function descriptionParts(description) {
  const parts = description.split(/\r?\n|\s+[•●]\s+/).map((part) => part.replace(/^[-–—•●]\s*/, "").trim()).filter(Boolean);
  return parts.length > 0 ? parts : [description.trim()];
}
function CareerDescription({ description }) {
  const [expanded, setExpanded] = useState(false);
  if (typeof description !== "string") {
    return /* @__PURE__ */ jsx(Text, { as: "div", variant: "caption", size: "xs", tone: "subtle", children: description });
  }
  const trimmed = description.trim();
  if (!trimmed) return null;
  const parts = descriptionParts(trimmed);
  const hasMore = parts.length > 3 || parts.length === 1 && trimmed.length > 180;
  const visibleParts = expanded ? parts : parts.slice(0, 3);
  return /* @__PURE__ */ jsxs(Stack, { gap: "xs", children: [
    parts.length > 1 ? /* @__PURE__ */ jsx(
      List,
      {
        marker: "disc",
        spacing: "tight",
        textSize: "xs",
        tone: "muted",
        className: "leading-relaxed",
        children: visibleParts.map((part, index) => /* @__PURE__ */ jsx(ListItem, { children: part }, index))
      }
    ) : /* @__PURE__ */ jsx(
      Text,
      {
        variant: "caption",
        size: "xs",
        tone: "subtle",
        lineClamp: !expanded && hasMore ? 3 : void 0,
        children: trimmed
      }
    ),
    hasMore ? /* @__PURE__ */ jsx(
      Button,
      {
        type: "button",
        variant: "link-muted",
        size: "bare",
        "aria-expanded": expanded,
        onClick: () => setExpanded((value) => !value),
        children: expanded ? "Show less" : "Show more"
      }
    ) : null
  ] });
}
function CareerRole({
  item,
  detailed,
  locale,
  presentLabel
}) {
  const date = item.dateRange ?? /* @__PURE__ */ jsx(
    CareerDateRange,
    {
      start: item.startDate,
      end: item.endDate,
      current: item.current,
      locale,
      presentLabel
    }
  );
  const hasDate = item.dateRange != null || item.startDate != null || item.endDate != null || item.current;
  return /* @__PURE__ */ jsxs(Stack, { gap: "xs", minWidth: "zero", children: [
    /* @__PURE__ */ jsx(Heading, { level: 5, children: item.title }),
    item.company != null || hasDate ? /* @__PURE__ */ jsxs(Text, { variant: "caption", size: "xs", children: [
      item.company,
      item.company != null && hasDate ? /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: " \xB7 " }) : null,
      hasDate ? date : null
    ] }) : null,
    detailed && item.description != null ? /* @__PURE__ */ jsx(CareerDescription, { description: item.description }) : null
  ] });
}
function CandidateCareerHistoryTimeline({
  items,
  loading = false,
  empty,
  emptyTitle,
  emptyDescription,
  earlierLabel = "Earlier",
  presentLabel = "Present",
  detailedCompanyGroups = 2,
  locale = "en",
  className
}) {
  if (loading && items.length === 0) {
    return /* @__PURE__ */ jsxs(Stack, { "data-slot": "candidate-career-history-loading", gap: "compact", className, children: [
      /* @__PURE__ */ jsx(Skeleton, { preset: "row-compact" }),
      /* @__PURE__ */ jsx(Skeleton, { preset: "row-compact" })
    ] });
  }
  if (items.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyState,
      {
        variant: "empty",
        size: "inline",
        title: empty?.title ?? emptyTitle ?? "No career history yet",
        description: empty ? empty.description : emptyDescription ?? "Career history is not available.",
        className
      }
    );
  }
  const groups = groupConsecutiveEmployments(items);
  const detailedItems = groups.slice(0, detailedCompanyGroups).flatMap((group) => group.items);
  const earlierItems = groups.slice(detailedCompanyGroups).flatMap((group) => group.items);
  return /* @__PURE__ */ jsxs(Stack, { "data-slot": "candidate-career-history", gap: "lg", className, children: [
    /* @__PURE__ */ jsx(Stack, { gap: "lg", children: detailedItems.map((item, index) => /* @__PURE__ */ jsx(
      CareerRole,
      {
        item,
        detailed: true,
        locale,
        presentLabel
      },
      index
    )) }),
    earlierItems.length > 0 ? /* @__PURE__ */ jsxs(Stack, { gap: "md", children: [
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsx(SectionHeader, { label: earlierLabel, spacing: "none" }),
      /* @__PURE__ */ jsx(List, { spacing: "normal", children: earlierItems.map((item, index) => /* @__PURE__ */ jsx(ListItem, { children: /* @__PURE__ */ jsx(
        CareerRole,
        {
          item,
          detailed: false,
          locale,
          presentLabel
        }
      ) }, index)) })
    ] }) : null
  ] });
}

export {
  CareerDateRange,
  CandidateCareerHistoryTimeline
};
