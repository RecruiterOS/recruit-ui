"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }// src/recruit/job-client-badge.tsx
var _badge = require('@epicbagel/saas-kit/primitives/badge');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _jsxruntime = require('react/jsx-runtime');
function JobClientBadge({ name, title, ...props }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _badge.Badge,
    {
      as: "span",
      variant: "secondary",
      title: _nullishCoalesce(title, () => ( (typeof name === "string" ? name : void 0))),
      ...props,
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "span", variant: "inherit", truncate: true, minWidth: "zero", children: name })
    }
  );
}



exports.JobClientBadge = JobClientBadge;
