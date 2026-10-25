"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkHUCMR5O6cjs = require('./chunk-HUCMR5O6.cjs');

// src/recruit/candidate-pipeline-list.tsx
var _button = require('@epicbagel/saas-kit/primitives/button');
var _emptystate = require('@epicbagel/saas-kit/primitives/empty-state');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _list = require('@epicbagel/saas-kit/primitives/list');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _sectionheader = require('@epicbagel/saas-kit/primitives/section-header');
var _sentimentdot = require('@epicbagel/saas-kit/primitives/sentiment-dot');
var _skeleton = require('@epicbagel/saas-kit/primitives/skeleton');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
var _jsxruntime = require('react/jsx-runtime');
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
  const openLabel = _nullishCoalesce(_optionalChain([labels, 'optionalAccess', _ => _.open]), () => ( "Open pipeline"));
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _panelsection.PanelSection, { "data-slot": "candidate-pipeline-list", border, ...props, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sectionheader.SectionHeader, { label: title, count: loading ? void 0 : rows.length, action }),
    loading ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "vertical", gap: "sm", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _skeleton.Skeleton, { preset: "control" }) }) : rows.length === 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _emptystate.EmptyState,
      {
        variant: "empty",
        size: "inline",
        icon: _lucidereact.Briefcase,
        title: empty.title,
        description: empty.description
      }
    ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "vertical", gap: "sm", children: rows.map((row) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
      _stack.Stack,
      {
        direction: "vertical",
        gap: "xs",
        radius: "md",
        surface: "muted",
        padding: "sm",
        interaction: "group-hover-accent",
        children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "center", children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              _button.Button,
              {
                type: "button",
                variant: "ghost",
                onClick: () => _optionalChain([row, 'access', _2 => _2.onOpen, 'optionalCall', _3 => _3()]),
                size: "bare",
                minWidth: "zero",
                grow: true,
                align: "start",
                textAlign: "start",
                title: openLabel,
                children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "none", width: "full", children: [
                  /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { size: "sm", weight: "medium", truncate: true, display: "inline-flex", children: [
                    row.title,
                    row.grade,
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.ChevronRight, size: "xs", tone: "muted", visibility: "parent-hover" })
                  ] }),
                  present(row.subtitle) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "xs", tone: "muted", truncate: true, children: row.subtitle })
                ] })
              }
            ),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              _chunkHUCMR5O6cjs.CandidateStageSelect,
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
  generating: "Generating\u2026"
};
function CandidateSummaryBullets({
  bullets,
  onGenerate,
  generating = false,
  generated = false,
  error,
  labels,
  ...props
}) {
  const wording = { ...BULLET_LABELS, ...labels };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { "data-slot": "candidate-summary-bullets", gap: "none", ...props, children: [
    bullets.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _list.List, { spacing: "normal", inset: "xs", children: bullets.map((bullet, index) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _list.ListItem, { layout: "row", textSize: "xs", tone: "soft", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sentimentdot.SentimentDot, { sentiment: bullet.sentiment }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "inherit", as: "span", grow: true, children: bullet.text })
    ] }, index)) }) : null,
    onGenerate && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
      _button.Button,
      {
        type: "button",
        variant: "link-muted",
        size: "bare",
        marginTop: "xs",
        gap: "xs",
        onClick: () => onGenerate(),
        disabled: generating,
        children: [
          generating ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Loader2, size: "xs", spin: true }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Sparkles, size: "xs" }),
          generating ? wording.generating : generated ? wording.refresh : wording.generate
        ]
      }
    ),
    present(error) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "micro", tone: "destructive", marginTop: "tight", children: error })
  ] });
}




exports.CandidatePipelineList = CandidatePipelineList; exports.CandidateSummaryBullets = CandidateSummaryBullets;
