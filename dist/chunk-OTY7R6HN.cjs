"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }// src/recruit/candidate-activity-timeline.tsx
var _button = require('@epicbagel/saas-kit/primitives/button');
var _emptystate = require('@epicbagel/saas-kit/primitives/empty-state');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _sectionheader = require('@epicbagel/saas-kit/primitives/section-header');
var _skeleton = require('@epicbagel/saas-kit/primitives/skeleton');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _timeline = require('@epicbagel/saas-kit/primitives/timeline');
var _lucidereact = require('lucide-react');




var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var DEFAULT_LABELS = {
  showBody: "Show full text",
  hideBody: "Hide full text"
};
function present(value) {
  return value != null && value !== false && value !== "";
}
function ActivityBody({
  body,
  label,
  labels
}) {
  const [open, setOpen] = _react.useState.call(void 0, false);
  const bodyId = _react.useId.call(void 0, );
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", marginTop: "xs", align: "start", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _button.Button,
      {
        type: "button",
        variant: "link-muted",
        size: "bare",
        align: "start",
        "aria-expanded": open,
        "aria-controls": open ? bodyId : void 0,
        onClick: () => setOpen((value) => !value),
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "inherit", as: "span", size: "xs", children: open ? labels.hideBody : present(label) ? label : labels.showBody })
      }
    ),
    open ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { id: bodyId, gap: "none", surface: "muted", radius: "md", padding: "sm", width: "full", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "div", size: "xs", tone: "muted", whitespace: "pre-wrap", children: body }) }) : null
  ] });
}
var RowButton = _react.forwardRef.call(void 0,
  function RowButton2(props, ref) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { ref, type: "button", ...props });
  }
);
function ActivityRow({
  item,
  labels
}) {
  const icon = item.icon ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: item.icon, size: "sm", tone: _nullishCoalesce(item.iconTone, () => ( "muted")), align: "start" }) : void 0;
  const title = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "line-clamp-2 whitespace-normal", children: item.title });
  const shared = { icon, title, subtitle: item.subtitle, timestamp: item.timestamp };
  if (item.href != null || item.onSelect != null) {
    const select = item.onSelect;
    const onClick = select ? (event) => select(event) : void 0;
    return item.href != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _timeline.TimelineRow, { ...shared, as: "a", href: item.href, interactive: true, onClick }) : (
      // A button centres its text; the row reads from the start like the others.
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _timeline.TimelineRow, { ...shared, as: RowButton, interactive: true, onClick, className: "w-full text-left" })
    );
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _timeline.TimelineRow, { ...shared, children: present(item.body) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ActivityBody, { body: item.body, label: item.bodyLabel, labels }) : null });
}
function CandidateActivityTimeline({
  groups,
  loading = false,
  empty = { title: "No activity yet" },
  spacing = "tight",
  labels,
  role,
  ...rest
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const labelled = rest["aria-label"] != null || rest["aria-labelledby"] != null;
  const props = { ...rest, role: _nullishCoalesce(role, () => ( (labelled ? "region" : void 0))) };
  const shown = groups.filter((group) => group.items.length > 0);
  if (loading && shown.length === 0) {
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { "data-slot": "candidate-activity-timeline", "aria-busy": true, gap: "xs", ...props, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _skeleton.Skeleton, { preset: "row-compact" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _skeleton.Skeleton, { preset: "row-compact" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _skeleton.Skeleton, { preset: "row-compact" })
    ] });
  }
  if (shown.length === 0) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { "data-slot": "candidate-activity-timeline", gap: "none", ...props, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _emptystate.EmptyState,
      {
        variant: "empty",
        size: "inline",
        icon: _lucidereact.History,
        title: empty.title,
        description: _nullishCoalesce(empty.description, () => ( ""))
      }
    ) });
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { "data-slot": "candidate-activity-timeline", gap: "lg", ...props, children: shown.map((group) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { as: "section", "data-slot": "candidate-activity-period", gap: "none", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sectionheader.SectionHeader, { label: group.label, count: group.count }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _timeline.Timeline, { spacing, children: group.items.map((item) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ActivityRow, { item, labels: text }, item.id)) })
  ] }, group.id)) });
}



exports.CandidateActivityTimeline = CandidateActivityTimeline;
