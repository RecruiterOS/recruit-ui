"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkFO63JBU3cjs = require('./chunk-FO63JBU3.cjs');

// src/recruit/candidate-career-history-timeline.tsx
var _button = require('@epicbagel/saas-kit/primitives/button');
var _emptystate = require('@epicbagel/saas-kit/primitives/empty-state');
var _heading = require('@epicbagel/saas-kit/primitives/heading');
var _list = require('@epicbagel/saas-kit/primitives/list');
var _sectionheader = require('@epicbagel/saas-kit/primitives/section-header');
var _separator = require('@epicbagel/saas-kit/primitives/separator');
var _skeleton = require('@epicbagel/saas-kit/primitives/skeleton');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
function CareerDateRange({
  start,
  end,
  current = false,
  presentLabel = "Present",
  locale = "en"
}) {
  const startLabel = _chunkFO63JBU3cjs.formatCalendarDate.call(void 0, start, locale);
  const endLabel = current ? presentLabel : _chunkFO63JBU3cjs.formatCalendarDate.call(void 0, end, locale);
  if (!startLabel && !endLabel) return null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    startLabel,
    startLabel && endLabel ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": true, children: " \u2013 " }) : null,
    endLabel
  ] });
}
function companyGroupKey(item) {
  if (_optionalChain([item, 'access', _ => _.companyGroup, 'optionalAccess', _2 => _2.trim, 'call', _3 => _3()])) return item.companyGroup.trim().toLocaleLowerCase();
  return typeof item.company === "string" ? item.company.trim().toLocaleLowerCase() || null : null;
}
function groupConsecutiveEmployments(items) {
  return items.reduce((groups, item) => {
    const key = companyGroupKey(item);
    const previous = groups.at(-1);
    if (key && _optionalChain([previous, 'optionalAccess', _4 => _4.key]) === key) {
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
  const [expanded, setExpanded] = _react.useState.call(void 0, false);
  if (typeof description !== "string") {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "div", variant: "caption", size: "xs", tone: "subtle", children: description });
  }
  const trimmed = description.trim();
  if (!trimmed) return null;
  const parts = descriptionParts(trimmed);
  const hasMore = parts.length > 3 || parts.length === 1 && trimmed.length > 180;
  const visibleParts = expanded ? parts : parts.slice(0, 3);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", children: [
    parts.length > 1 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _list.List,
      {
        marker: "disc",
        spacing: "tight",
        textSize: "xs",
        tone: "muted",
        className: "leading-relaxed",
        children: visibleParts.map((part, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _list.ListItem, { children: part }, index))
      }
    ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _text.Text,
      {
        variant: "caption",
        size: "xs",
        tone: "subtle",
        lineClamp: !expanded && hasMore ? 3 : void 0,
        children: trimmed
      }
    ),
    hasMore ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _button.Button,
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
  const date = _nullishCoalesce(item.dateRange, () => ( /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    CareerDateRange,
    {
      start: item.startDate,
      end: item.endDate,
      current: item.current,
      locale,
      presentLabel
    }
  )));
  const hasDate = item.dateRange != null || item.startDate != null || item.endDate != null || item.current;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", minWidth: "zero", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _heading.Heading, { level: 5, children: item.title }),
    item.company != null || hasDate ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { variant: "caption", size: "xs", children: [
      item.company,
      item.company != null && hasDate ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": true, children: " \xB7 " }) : null,
      hasDate ? date : null
    ] }) : null,
    detailed && item.description != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, CareerDescription, { description: item.description }) : null
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
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { "data-slot": "candidate-career-history-loading", gap: "compact", className, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _skeleton.Skeleton, { preset: "row-compact" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _skeleton.Skeleton, { preset: "row-compact" })
    ] });
  }
  if (items.length === 0) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _emptystate.EmptyState,
      {
        variant: "empty",
        size: "inline",
        title: _nullishCoalesce(_nullishCoalesce(_optionalChain([empty, 'optionalAccess', _5 => _5.title]), () => ( emptyTitle)), () => ( "No career history yet")),
        description: empty ? empty.description : _nullishCoalesce(emptyDescription, () => ( "Career history is not available.")),
        className
      }
    );
  }
  const groups = groupConsecutiveEmployments(items);
  const detailedItems = groups.slice(0, detailedCompanyGroups).flatMap((group) => group.items);
  const earlierItems = groups.slice(detailedCompanyGroups).flatMap((group) => group.items);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { "data-slot": "candidate-career-history", gap: "lg", className, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { gap: "lg", children: detailedItems.map((item, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      CareerRole,
      {
        item,
        detailed: true,
        locale,
        presentLabel
      },
      index
    )) }),
    earlierItems.length > 0 ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "md", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _separator.Separator, {}),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sectionheader.SectionHeader, { label: earlierLabel, spacing: "none" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _list.List, { spacing: "normal", children: earlierItems.map((item, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _list.ListItem, { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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




exports.CareerDateRange = CareerDateRange; exports.CandidateCareerHistoryTimeline = CandidateCareerHistoryTimeline;
