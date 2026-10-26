"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }// src/recruit/candidate-shortlist.tsx
var _emptystate = require('@epicbagel/saas-kit/primitives/empty-state');
var _flexitem = require('@epicbagel/saas-kit/primitives/flex-item');
var _heading = require('@epicbagel/saas-kit/primitives/heading');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
function CandidateShortlist({
  title,
  eyebrow,
  description,
  status,
  count,
  children,
  footer,
  empty = { title: "No candidates shortlisted yet" },
  emptySize = "inline",
  ...props
}) {
  const titleId = _react.useId.call(void 0, );
  const isEmpty = count === void 0 ? _react.Children.toArray(children).length === 0 : count === 0;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _stack.Stack,
    {
      as: "section",
      "data-slot": "candidate-shortlist",
      "aria-labelledby": titleId,
      gap: "md",
      width: "full",
      ...props,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "md", align: "start", justify: "between", children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", children: [
            eyebrow ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "eyebrow", children: eyebrow }) : null,
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _heading.Heading, { id: titleId, level: 2, children: title }),
            description ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "muted", children: description }) : null
          ] }),
          status != null && status !== false ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _flexitem.FlexItem, { shrink: false, children: status }) : null
        ] }),
        isEmpty ? emptySize === "md" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _emptystate.EmptyState,
          {
            variant: "empty",
            size: "md",
            icon: _lucidereact.UsersRound,
            title: empty.title,
            description: _nullishCoalesce(empty.description, () => ( ""))
          }
        ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _emptystate.EmptyState,
          {
            variant: "empty",
            size: "inline",
            icon: _lucidereact.UsersRound,
            title: empty.title,
            description: _nullishCoalesce(empty.description, () => ( ""))
          }
        ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { gap: "md", children }),
        isEmpty ? null : footer
      ]
    }
  );
}



exports.CandidateShortlist = CandidateShortlist;
