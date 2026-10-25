"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunk4OKOQUKVcjs = require('./chunk-4OKOQUKV.cjs');

// src/recruit/candidate-profile.tsx
var _utils = require('@epicbagel/saas-kit/lib/utils');
var _contactheader = require('@epicbagel/saas-kit/primitives/contact-header');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _jsxruntime = require('react/jsx-runtime');
function CandidateProfile({
  header,
  children,
  footer,
  className,
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _stack.Stack,
    {
      as: "article",
      "data-slot": "candidate-profile",
      gap: "none",
      surface: "card",
      radius: "xl",
      overflow: "hidden",
      className,
      ...props,
      children: [
        header,
        children,
        footer
      ]
    }
  );
}
function CandidateProfileHeader({
  name,
  avatar,
  cover,
  eyebrow,
  status,
  meta,
  summary,
  actions,
  className,
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunk4OKOQUKVcjs.CandidateCoverHeader,
    {
      cover,
      padding: "lg",
      "data-slot": "candidate-profile-header",
      className,
      ...props,
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "sm", children: [
        eyebrow != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "eyebrow", children: eyebrow }) : null,
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _contactheader.ContactHeader,
          {
            avatar,
            name,
            status,
            meta,
            actions,
            spacing: "none"
          }
        ),
        summary != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "muted", size: "sm", children: summary }) : null
      ] })
    }
  );
}
function CandidateProfileBody({
  children,
  divided = false,
  className,
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _panelsection.PanelSection,
    {
      as: "div",
      "data-slot": "candidate-profile-body",
      border: "top",
      className: _utils.cn.call(void 0, divided && "divide-y", className),
      ...props,
      children
    }
  );
}
function CandidateProfileFooter({
  children,
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _panelsection.PanelSection,
    {
      as: "footer",
      "data-slot": "candidate-profile-footer",
      border: "top",
      layout: "row",
      gap: "sm",
      ...props,
      children
    }
  );
}






exports.CandidateProfile = CandidateProfile; exports.CandidateProfileHeader = CandidateProfileHeader; exports.CandidateProfileBody = CandidateProfileBody; exports.CandidateProfileFooter = CandidateProfileFooter;
