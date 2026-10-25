"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/recruit/candidate-quote.tsx
var _button = require('@epicbagel/saas-kit/primitives/button');
var _flexitem = require('@epicbagel/saas-kit/primitives/flex-item');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
function CandidateQuote({
  children,
  attribution,
  action,
  lineClamp,
  collapsible,
  ...props
}) {
  const [expanded, setExpanded] = _react.useState.call(void 0, false);
  const canExpand = _optionalChain([collapsible, 'optionalAccess', _ => _.threshold]) == null || typeof children !== "string" || children.length > collapsible.threshold;
  const clamp = collapsible ? expanded ? void 0 : collapsible.lines : lineClamp;
  const toggle = collapsible != null && canExpand ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _button.Button,
    {
      type: "button",
      variant: "link",
      size: "bare",
      shrink: true,
      onClick: (event) => {
        event.stopPropagation();
        setExpanded((value) => !value);
      },
      children: expanded ? collapsible.lessLabel : collapsible.moreLabel
    }
  ) : null;
  const actions = action != null && toggle != null ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    action,
    toggle
  ] }) : _nullishCoalesce(action, () => ( toggle));
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _panelsection.PanelSection,
    {
      as: "blockquote",
      "data-slot": "candidate-quote",
      padding: "default",
      ...props,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { as: "div", variant: "muted", size: "sm", italic: true, lineClamp: clamp, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": true, children: "\u201C" }),
          children,
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": true, children: "\u201D" })
        ] }),
        attribution != null || actions != null ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "compact", align: "center", marginTop: "sm", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _flexitem.FlexItem, { grow: true, minWidth: "zero", children: attribution != null ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { as: "span", variant: "caption", size: "xs", tone: "subtle", children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": true, children: "\u2014 " }),
            attribution
          ] }) : null }),
          actions
        ] }) : null
      ]
    }
  );
}



exports.CandidateQuote = CandidateQuote;
