"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/candidate-signal-list.tsx
var _badge = require('@epicbagel/saas-kit/primitives/badge');
var _card = require('@epicbagel/saas-kit/primitives/card');
var _definitionlist = require('@epicbagel/saas-kit/primitives/definition-list');
var _emptystate = require('@epicbagel/saas-kit/primitives/empty-state');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _sectionheader = require('@epicbagel/saas-kit/primitives/section-header');
var _skeleton = require('@epicbagel/saas-kit/primitives/skeleton');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
var _jsxruntime = require('react/jsx-runtime');
function CandidateSignalList({
  title,
  items,
  loading = false,
  error,
  empty = { title: "No signals yet" },
  ...props
}) {
  const hasError = error != null && error !== false && error !== "";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _panelsection.PanelSection, { "data-slot": "candidate-signal-list", ...props, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sectionheader.SectionHeader, { label: title, count: loading ? void 0 : items.length }),
    loading ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "sm", marginTop: "md", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _skeleton.Skeleton, { preset: "card-sm", radius: "xl" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _skeleton.Skeleton, { preset: "card-sm", radius: "xl" })
    ] }) : hasError ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "destructive", marginTop: "md", children: error }) : items.length === 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _emptystate.EmptyState,
      {
        variant: "empty",
        size: "inline",
        icon: _lucidereact.Radar,
        title: empty.title,
        description: empty.description
      }
    ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { gap: "md", marginTop: "md", children: items.map((item) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _card.Card, { padding: "row", surface: "muted", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "md", children: [
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "start", justify: "between", children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "xs", align: "center", children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _badge.Badge, { size: "micro", transform: "uppercase", font: "sans", weight: "semibold", children: item.kind }),
            item.status != null && item.status !== false && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _badge.Badge, { size: "micro", variant: "outline", transform: "uppercase", font: "sans", children: item.status })
          ] }),
          item.detectedAt
        ] }),
        item.actions
      ] }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", weight: "medium", children: item.summary }),
      item.details && item.details.length > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionList, { variant: "divided", children: item.details.map((detail, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionItem, { label: detail.label, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", children: detail.value }) }, index)) })
    ] }) }, item.id)) })
  ] });
}



exports.CandidateSignalList = CandidateSignalList;
