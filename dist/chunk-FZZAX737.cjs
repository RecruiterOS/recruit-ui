"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/candidate-decision-reason-dialog.tsx
var _badge = require('@epicbagel/saas-kit/primitives/badge');
var _button = require('@epicbagel/saas-kit/primitives/button');






var _dialog = require('@epicbagel/saas-kit/primitives/dialog');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _label = require('@epicbagel/saas-kit/primitives/label');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _textarea = require('@epicbagel/saas-kit/primitives/textarea');
var _lucidereact = require('lucide-react');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var DEFAULT_LABELS = {
  suggestions: "Tap a signal to use it as the reason",
  reason: "Why?",
  cancel: "Cancel"
};
var SUGGESTION_SEPARATOR = " \xB7 ";
function CandidateDecisionReasonDialog(props) {
  return props.id ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ReasonDialog, { ...props, id: props.id }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ReasonDialogWithGeneratedId, { ...props });
}
function ReasonDialogWithGeneratedId(props) {
  const id = _react.useId.call(void 0, );
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ReasonDialog, { ...props, id });
}
function ReasonDialog({
  open,
  title,
  suggestions = [],
  placeholder,
  confirmLabel,
  confirmTone = "default",
  onSubmit,
  onClose,
  labels,
  id
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [reason, setReason] = _react.useState.call(void 0, "");
  const [submitting, setSubmitting] = _react.useState.call(void 0, false);
  _react.useEffect.call(void 0, () => {
    if (!open) return;
    setReason("");
    setSubmitting(false);
  }, [open]);
  const submit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(reason.trim());
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _dialog.Dialog, { open, onOpenChange: (next) => !next && onClose(), children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _dialog.DialogContent, { size: "sm", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _dialog.DialogHeader, { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _dialog.DialogTitle, { size: "base", children: title }) }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "vertical", gap: "sm", children: [
      suggestions.length > 0 && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "none", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "div", variant: "eyebrow", marginBottom: "sm", children: text.suggestions }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "horizontal", gap: "xs", wrap: true, children: suggestions.map((suggestion, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _badge.Badge,
          {
            variant: "outline",
            size: "micro",
            weight: "normal",
            interactive: true,
            onClick: () => setReason((current) => current ? `${current}${SUGGESTION_SEPARATOR}${suggestion}` : suggestion),
            children: suggestion
          },
          index
        )) })
      ] }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _label.Label, { htmlFor: id, appearance: "eyebrow", children: text.reason }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _textarea.Textarea,
          {
            id,
            value: reason,
            onChange: (event) => setReason(event.target.value),
            rows: 3,
            placeholder,
            autoFocus: true
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _dialog.DialogFooter, { children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { variant: "ghost", onClick: onClose, disabled: submitting, children: text.cancel }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
        _button.Button,
        {
          onClick: submit,
          disabled: submitting || reason.trim().length === 0,
          variant: confirmTone,
          children: [
            submitting ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Loader2, size: "md", spin: true }) : null,
            confirmLabel
          ]
        }
      )
    ] })
  ] }) });
}



exports.CandidateDecisionReasonDialog = CandidateDecisionReasonDialog;
