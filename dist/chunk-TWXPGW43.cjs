"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/candidate-suggested-roles-panel.tsx
var _emptystate = require('@epicbagel/saas-kit/primitives/empty-state');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _sectionheader = require('@epicbagel/saas-kit/primitives/section-header');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
var _jsxruntime = require('react/jsx-runtime');
function CandidateSuggestedRolesPanel({
  count,
  title = "Suggested roles",
  description,
  empty = { title: "No suggested roles yet" },
  children,
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _panelsection.PanelSection, { "data-slot": "candidate-suggested-roles-panel", ...props, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sectionheader.SectionHeader, { label: title, count }),
    description != null && description !== false && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "muted", marginBottom: "md", children: description }),
    count > 0 ? children : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _emptystate.EmptyState,
      {
        variant: "empty",
        size: "inline",
        icon: _lucidereact.BriefcaseBusiness,
        title: empty.title,
        description: empty.description
      }
    )
  ] });
}



exports.CandidateSuggestedRolesPanel = CandidateSuggestedRolesPanel;
