// src/recruit/candidate-activity-timeline.tsx
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Skeleton } from "@epicbagel/saas-kit/primitives/skeleton";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Timeline, TimelineRow } from "@epicbagel/saas-kit/primitives/timeline";
import { History } from "lucide-react";
import {
  forwardRef,
  useId,
  useState
} from "react";
import { jsx, jsxs } from "react/jsx-runtime";
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
  const [open, setOpen] = useState(false);
  const bodyId = useId();
  return /* @__PURE__ */ jsxs(Stack, { gap: "xs", marginTop: "xs", align: "start", children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        type: "button",
        variant: "link-muted",
        size: "bare",
        align: "start",
        "aria-expanded": open,
        "aria-controls": open ? bodyId : void 0,
        onClick: () => setOpen((value) => !value),
        children: /* @__PURE__ */ jsx(Text, { variant: "inherit", as: "span", size: "xs", children: open ? labels.hideBody : present(label) ? label : labels.showBody })
      }
    ),
    open ? /* @__PURE__ */ jsx(Stack, { id: bodyId, gap: "none", surface: "muted", radius: "md", padding: "sm", width: "full", children: /* @__PURE__ */ jsx(Text, { as: "div", size: "xs", tone: "muted", whitespace: "pre-wrap", children: body }) }) : null
  ] });
}
var RowButton = forwardRef(
  function RowButton2(props, ref) {
    return /* @__PURE__ */ jsx("button", { ref, type: "button", ...props });
  }
);
function ActivityRow({
  item,
  labels
}) {
  const icon = item.icon ? /* @__PURE__ */ jsx(Icon, { icon: item.icon, size: "sm", tone: item.iconTone ?? "muted", align: "start" }) : void 0;
  const title = /* @__PURE__ */ jsx("span", { className: "line-clamp-2 whitespace-normal", children: item.title });
  const shared = { icon, title, subtitle: item.subtitle, timestamp: item.timestamp };
  if (item.href != null || item.onSelect != null) {
    const select = item.onSelect;
    const onClick = select ? (event) => select(event) : void 0;
    return item.href != null ? /* @__PURE__ */ jsx(TimelineRow, { ...shared, as: "a", href: item.href, interactive: true, onClick }) : (
      // A button centres its text; the row reads from the start like the others.
      /* @__PURE__ */ jsx(TimelineRow, { ...shared, as: RowButton, interactive: true, onClick, className: "w-full text-left" })
    );
  }
  return /* @__PURE__ */ jsx(TimelineRow, { ...shared, children: present(item.body) ? /* @__PURE__ */ jsx(ActivityBody, { body: item.body, label: item.bodyLabel, labels }) : null });
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
  const props = { ...rest, role: role ?? (labelled ? "region" : void 0) };
  const shown = groups.filter((group) => group.items.length > 0);
  if (loading && shown.length === 0) {
    return /* @__PURE__ */ jsxs(Stack, { "data-slot": "candidate-activity-timeline", "aria-busy": true, gap: "xs", ...props, children: [
      /* @__PURE__ */ jsx(Skeleton, { preset: "row-compact" }),
      /* @__PURE__ */ jsx(Skeleton, { preset: "row-compact" }),
      /* @__PURE__ */ jsx(Skeleton, { preset: "row-compact" })
    ] });
  }
  if (shown.length === 0) {
    return /* @__PURE__ */ jsx(Stack, { "data-slot": "candidate-activity-timeline", gap: "none", ...props, children: /* @__PURE__ */ jsx(
      EmptyState,
      {
        variant: "empty",
        size: "inline",
        icon: History,
        title: empty.title,
        description: empty.description ?? ""
      }
    ) });
  }
  return /* @__PURE__ */ jsx(Stack, { "data-slot": "candidate-activity-timeline", gap: "lg", ...props, children: shown.map((group) => /* @__PURE__ */ jsxs(Stack, { as: "section", "data-slot": "candidate-activity-period", gap: "none", children: [
    /* @__PURE__ */ jsx(SectionHeader, { label: group.label, count: group.count }),
    /* @__PURE__ */ jsx(Timeline, { spacing, children: group.items.map((item) => /* @__PURE__ */ jsx(ActivityRow, { item, labels: text }, item.id)) })
  ] }, group.id)) });
}

export {
  CandidateActivityTimeline
};
