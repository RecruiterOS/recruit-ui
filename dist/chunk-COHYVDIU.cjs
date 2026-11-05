"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }



var _chunkCP5HCQPWcjs = require('./chunk-CP5HCQPW.cjs');

// src/recruit/job-brief-changes.tsx
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');







var _trace = require('@epicbagel/saas-kit/primitives/trace');
var _lucidereact = require('lucide-react');
var _jsxruntime = require('react/jsx-runtime');
var CHANGE_ICONS = {
  added: _lucidereact.Plus,
  removed: _lucidereact.Minus,
  cleared: _lucidereact.Minus,
  reworded: _lucidereact.ArrowRight,
  set: _lucidereact.ArrowRight,
  moved: _lucidereact.ArrowUpDown,
  replaced: _lucidereact.RefreshCw
};
var DEFAULT_PREVIEW_COUNT = 3;
function ChangeLine({ change, labels }) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _trace.TraceLine, { "data-change-kind": change.kind, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _trace.TraceIcon, { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _nullishCoalesce(CHANGE_ICONS[change.kind], () => ( _lucidereact.ArrowRight)) }) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "span", variant: "inherit", minWidth: "zero", children: _chunkCP5HCQPWcjs.jobBriefChangeText.call(void 0, change, labels) })
  ] });
}
function JobBriefChanges({
  changes,
  version,
  previewCount = DEFAULT_PREVIEW_COUNT,
  groupAbove,
  labels,
  ...props
}) {
  if (changes.length === 0) return null;
  const words = { ..._chunkCP5HCQPWcjs.jobBriefChangeLabels, ...labels };
  const count = Number.isFinite(previewCount) ? Math.max(0, Math.floor(previewCount)) : DEFAULT_PREVIEW_COUNT;
  const ids = new Map(changes.map((change, index) => [change, _nullishCoalesce(change.id, () => ( String(index)))]));
  const lines = _chunkCP5HCQPWcjs.groupJobBriefChanges.call(void 0, changes, groupAbove).map((change, index) => ({
    key: _nullishCoalesce(_nullishCoalesce(ids.get(change), () => ( change.id)), () => ( `group-${index}`)),
    change
  }));
  const shown = lines.slice(0, count);
  const folded = lines.slice(count);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { "data-slot": "job-brief-changes", role: "group", "aria-label": words.groupName(version), gap: "none", ...props, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _trace.Trace, { children: [
    shown.map(({ key, change }) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChangeLine, { change, labels: words }, key)),
    folded.length > 0 ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _trace.TraceCollapsible, { children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _trace.TraceCollapsibleTrigger, { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _trace.TraceLine, { children: words.more(folded.length) }) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _trace.TraceCollapsibleContent, { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _trace.Trace, { children: folded.map(({ key, change }) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChangeLine, { change, labels: words }, key)) }) })
    ] }) : null
  ] }) });
}



exports.JobBriefChanges = JobBriefChanges;
