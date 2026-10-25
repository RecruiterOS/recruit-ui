"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkVE3ICFAVcjs = require('./chunk-VE3ICFAV.cjs');

// src/recruit/candidate-career-history-panel.tsx
var _scrollarea = require('@epicbagel/saas-kit/primitives/scroll-area');
var _sectionheader = require('@epicbagel/saas-kit/primitives/section-header');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _jsxruntime = require('react/jsx-runtime');
function CandidateCareerHistoryPanel({
  title = "Career history",
  items,
  loading = false,
  empty,
  detailedCompanyGroups,
  locale,
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "vertical", gap: "md", "data-slot": "candidate-career-history-panel", ...props, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sectionheader.SectionHeader, { label: title, count: loading ? void 0 : items.length }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _scrollarea.ScrollArea, { "data-slot": "career-history-scroll", maxHeight: "viewport", paddingEnd: "sm", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _chunkVE3ICFAVcjs.CandidateCareerHistoryTimeline,
      {
        items,
        loading,
        empty,
        detailedCompanyGroups,
        locale
      }
    ) })
  ] });
}



exports.CandidateCareerHistoryPanel = CandidateCareerHistoryPanel;
