"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/candidate-shortlist-note.tsx
var _card = require('@epicbagel/saas-kit/primitives/card');
var _flexitem = require('@epicbagel/saas-kit/primitives/flex-item');
var _heading = require('@epicbagel/saas-kit/primitives/heading');
var _richtext = require('@epicbagel/saas-kit/primitives/rich-text');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _jsxruntime = require('react/jsx-runtime');
function CandidateShortlistNote({
  title,
  titleLevel = 2,
  avatar,
  meta,
  message,
  media,
  signature,
  action,
  ...props
}) {
  const hasAvatar = avatar != null && avatar !== false;
  const hasMeta = meta != null && meta !== false && meta !== "";
  const hasSignature = signature != null && signature !== false && signature !== "";
  const hasAction = action != null && action !== false;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _card.Card, { padding: "md", ...props, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "md", children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "md", align: "start", children: [
      hasAvatar ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _flexitem.FlexItem, { shrink: false, children: avatar }) : null,
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _flexitem.FlexItem, { grow: true, minWidth: "zero", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _heading.Heading, { level: 2, as: `h${titleLevel}`, className: "text-xl md:text-2xl", children: title }),
        hasMeta ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "horizontal", align: "center", wrap: true, className: "mt-1.5 gap-1.5", children: meta }) : null
      ] })
    ] }),
    message != null && message !== false && message !== "" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _richtext.RichText, { children: message }) : null,
    media,
    hasSignature || hasAction ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "md", align: "center", wrap: true, children: [
      hasSignature ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "caption", children: signature }) : null,
      action
    ] }) : null
  ] }) });
}



exports.CandidateShortlistNote = CandidateShortlistNote;
