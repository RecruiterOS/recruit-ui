import {
  jobBriefChangeLabels,
  jobBriefChangeText
} from "./chunk-A3XKZFTB.js";

// src/recruit/job-brief-changes.tsx
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine
} from "@epicbagel/saas-kit/primitives/trace";
import { ArrowRight, ArrowUpDown, Minus, Plus, RefreshCw } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var CHANGE_ICONS = {
  added: Plus,
  removed: Minus,
  cleared: Minus,
  reworded: ArrowRight,
  set: ArrowRight,
  moved: ArrowUpDown,
  replaced: RefreshCw
};
var DEFAULT_PREVIEW_COUNT = 3;
function ChangeLine({ change, labels }) {
  return /* @__PURE__ */ jsxs(TraceLine, { "data-change-kind": change.kind, children: [
    /* @__PURE__ */ jsx(TraceIcon, { children: /* @__PURE__ */ jsx(Icon, { icon: CHANGE_ICONS[change.kind] ?? ArrowRight }) }),
    /* @__PURE__ */ jsx(Text, { as: "span", variant: "inherit", minWidth: "zero", children: jobBriefChangeText(change, labels) })
  ] });
}
function JobBriefChanges({
  changes,
  version,
  previewCount = DEFAULT_PREVIEW_COUNT,
  labels,
  ...props
}) {
  if (changes.length === 0) return null;
  const words = { ...jobBriefChangeLabels, ...labels };
  const count = Number.isFinite(previewCount) ? Math.max(0, Math.floor(previewCount)) : DEFAULT_PREVIEW_COUNT;
  const lines = changes.map((change, index) => ({ key: change.id ?? String(index), change }));
  const shown = lines.slice(0, count);
  const folded = lines.slice(count);
  return /* @__PURE__ */ jsx(Stack, { "data-slot": "job-brief-changes", role: "group", "aria-label": words.groupName(version), gap: "none", ...props, children: /* @__PURE__ */ jsxs(Trace, { children: [
    shown.map(({ key, change }) => /* @__PURE__ */ jsx(ChangeLine, { change, labels: words }, key)),
    folded.length > 0 ? /* @__PURE__ */ jsxs(TraceCollapsible, { children: [
      /* @__PURE__ */ jsx(TraceCollapsibleTrigger, { children: /* @__PURE__ */ jsx(TraceLine, { children: words.more(folded.length) }) }),
      /* @__PURE__ */ jsx(TraceCollapsibleContent, { children: /* @__PURE__ */ jsx(Trace, { children: folded.map(({ key, change }) => /* @__PURE__ */ jsx(ChangeLine, { change, labels: words }, key)) }) })
    ] }) : null
  ] }) });
}

export {
  JobBriefChanges
};
