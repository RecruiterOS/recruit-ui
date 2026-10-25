"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/recruit/candidate-role-matches.tsx
var _anchor = require('@epicbagel/saas-kit/primitives/anchor');
var _badge = require('@epicbagel/saas-kit/primitives/badge');
var _button = require('@epicbagel/saas-kit/primitives/button');
var _confirmbar = require('@epicbagel/saas-kit/primitives/confirm-bar');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
function CandidateRoleMatchSummary({
  matches,
  onOpen,
  ...props
}) {
  if (!matches.length) return null;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { gap: "xs", width: "full", "data-slot": "candidate-role-match-summary", ...props, children: matches.map((match) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _button.Button,
    {
      variant: "ghost",
      size: "sm",
      width: "full",
      align: "start",
      onClick: () => onOpen(match.id),
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "center", justify: "between", width: "full", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", weight: "medium", truncate: true, children: match.title }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "center", shrink: false, children: [
          match.grade,
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.ChevronRight, size: "sm", tone: "muted" })
        ] })
      ] })
    },
    match.id
  )) });
}
var DEFAULT_LIST_LABELS = {
  add: "Add to role",
  added: "Added",
  cancel: "Cancel"
};
function CandidateRoleMatchList({
  heading,
  matches,
  onOpen,
  onAddToRole,
  confirm,
  labels,
  ...props
}) {
  const text = { ...DEFAULT_LIST_LABELS, ...labels };
  const [added, setAdded] = _react.useState.call(void 0, []);
  const [confirmMatch, setConfirmMatch] = _react.useState.call(void 0, null);
  if (!matches.length) return null;
  const add = async (match) => {
    if (!onAddToRole) return;
    try {
      await onAddToRole(match.id);
      setAdded((current) => [...current, match.id]);
    } catch (e) {
    }
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "md", padding: "md", border: "top", "data-slot": "candidate-role-match-list", ...props, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "eyebrow", children: heading }),
    matches.map((match) => {
      const isAdded = !!match.added || added.includes(match.id);
      return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "sm", align: "start", paddingBottom: "md", border: "bottom", children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", justify: "between", align: "start", width: "full", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { grow: true, minWidth: "zero", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _anchor.Anchor,
            {
              size: "sm",
              weight: "medium",
              href: match.href,
              onClick: (event) => {
                event.stopPropagation();
                if (onOpen) {
                  event.preventDefault();
                  onOpen(match.id);
                }
              },
              children: match.title
            }
          ) }),
          match.grade
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "muted", children: match.reason }),
        isAdded ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _badge.Badge, { variant: "success", size: "compact", children: _nullishCoalesce(match.addedLabel, () => ( text.added)) }) : onAddToRole && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          _button.Button,
          {
            size: "sm",
            onClick: (event) => {
              event.stopPropagation();
              setConfirmMatch(match);
            },
            children: [
              text.add,
              " ",
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.ArrowRight, size: "sm" })
            ]
          }
        )
      ] }, match.id);
    }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _confirmbar.ConfirmBar,
      {
        open: confirmMatch !== null,
        title: confirmMatch ? confirm.title(confirmMatch) : null,
        description: confirmMatch ? _optionalChain([confirm, 'access', _ => _.description, 'optionalCall', _2 => _2(confirmMatch)]) : void 0,
        confirmLabel: text.add,
        cancelLabel: text.cancel,
        onCancel: () => setConfirmMatch(null),
        onConfirm: () => {
          if (!confirmMatch) return;
          const match = confirmMatch;
          setConfirmMatch(null);
          void add(match);
        }
      }
    )
  ] });
}




exports.CandidateRoleMatchSummary = CandidateRoleMatchSummary; exports.CandidateRoleMatchList = CandidateRoleMatchList;
