"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/candidate-call-list.tsx
var _emptystate = require('@epicbagel/saas-kit/primitives/empty-state');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _sectionheader = require('@epicbagel/saas-kit/primitives/section-header');
var _skeleton = require('@epicbagel/saas-kit/primitives/skeleton');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _lucidereact = require('lucide-react');
var _jsxruntime = require('react/jsx-runtime');
function CandidateCallList({
  count,
  loading = false,
  title = "Calls",
  empty = { title: "No calls yet" },
  children,
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _panelsection.PanelSection, { "data-slot": "candidate-call-list", ...props, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sectionheader.SectionHeader, { label: title, count: loading ? void 0 : count }),
    loading ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "vertical", gap: "sm", marginTop: "md", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _skeleton.Skeleton, { preset: "card-sm", radius: "xl" }) }) : count === 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _emptystate.EmptyState,
      {
        variant: "empty",
        size: "inline",
        icon: _lucidereact.Phone,
        title: empty.title,
        description: empty.description
      }
    ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "vertical", gap: "sm", marginTop: "md", children })
  ] });
}



exports.CandidateCallList = CandidateCallList;
