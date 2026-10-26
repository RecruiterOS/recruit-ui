"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkDUEGVK55cjs = require('./chunk-DUEGVK55.cjs');

// src/recruit/candidate-profile.tsx
var _utils = require('@epicbagel/saas-kit/lib/utils');
var _contactheader = require('@epicbagel/saas-kit/primitives/contact-header');
var _flexitem = require('@epicbagel/saas-kit/primitives/flex-item');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _jsxruntime = require('react/jsx-runtime');
function CandidateProfile({
  header,
  children,
  footer,
  printMode = "default",
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
      className: _utils.cn.call(void 0, printMode === "flat" && "print:border-0 print:shadow-none", className),
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
  actionsPlacement = "name",
  padding = "lg",
  className,
  ...props
}) {
  const aside = actionsPlacement === "aside" && actions != null;
  const identity = /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _contactheader.ContactHeader,
    {
      avatar,
      name,
      status,
      meta,
      actions: aside ? void 0 : actions,
      spacing: "none"
    }
  );
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunkDUEGVK55cjs.CandidateCoverHeader,
    {
      cover,
      padding,
      "data-slot": "candidate-profile-header",
      className,
      ...props,
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "sm", children: [
        eyebrow != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "eyebrow", children: eyebrow }) : null,
        aside ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "start", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _flexitem.FlexItem, { grow: true, minWidth: "zero", children: identity }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _stack.Stack,
            {
              "data-slot": "candidate-profile-header-actions",
              direction: "horizontal",
              gap: "xs",
              align: "center",
              shrink: false,
              children: actions
            }
          )
        ] }) : identity,
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
var FOOTER_JUSTIFY = {
  start: "",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between"
};
function CandidateProfileFooter({
  children,
  justify = "start",
  padding = "default",
  printVisibility = "visible",
  className,
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
      padding,
      className: _utils.cn.call(void 0,
        FOOTER_JUSTIFY[justify],
        printVisibility === "hidden" && "print:hidden",
        className
      ),
      ...props,
      children
    }
  );
}






exports.CandidateProfile = CandidateProfile; exports.CandidateProfileHeader = CandidateProfileHeader; exports.CandidateProfileBody = CandidateProfileBody; exports.CandidateProfileFooter = CandidateProfileFooter;
