"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";

// src/recruit/call-reconcile-dialogs.tsx
var _button = require('@epicbagel/saas-kit/primitives/button');
var _flexitem = require('@epicbagel/saas-kit/primitives/flex-item');
var _input = require('@epicbagel/saas-kit/primitives/input');






var _responsivedialog = require('@epicbagel/saas-kit/primitives/responsive-dialog');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _jsxruntime = require('react/jsx-runtime');
function CallReconcileDialogs({ labels: text, participants, create, preview }) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialog, { open: create.open, onOpenChange: create.onOpenChange, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _responsivedialog.ResponsiveDialogContent, { children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogHeader, { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogTitle, { children: text.createTitle }) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogBody, { children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "sm", children: [
        participants.length > 0 && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "small", tone: "muted", children: text.useParticipant }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", wrap: true, children: participants.map((participant, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _button.Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => {
                create.onNameChange(_nullishCoalesce(participant.name, () => ( "")));
                create.onEmailChange(_nullishCoalesce(participant.email, () => ( "")));
              },
              children: participant.name || participant.email
            },
            `${_nullishCoalesce(participant.email, () => ( participant.name))}-${index}`
          )) })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "small", tone: "muted", children: text.name }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _input.Input, { value: create.name, onChange: (event) => create.onNameChange(event.target.value), placeholder: text.namePlaceholder })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "small", tone: "muted", children: text.email }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _input.Input, { type: "email", value: create.email, onChange: (event) => create.onEmailChange(event.target.value), placeholder: text.emailPlaceholder })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { size: "sm", disabled: !create.name.trim(), onClick: () => create.onSubmit(), children: text.createSubmit })
      ] }) })
    ] }) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialog, { open: preview.open, onOpenChange: (open) => !open && preview.onClose(), children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _responsivedialog.ResponsiveDialogContent, { presentation: "preview", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogHeader, { visibility: "screen-reader", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogTitle, { children: text.previewTitle }) }),
      preview.open && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "none", minHeight: "zero", grow: true, children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _flexitem.FlexItem, { grow: true, minHeight: "zero", overflow: "hidden", children: preview.content }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "center", justify: "end", border: "top", surface: "background", padding: "action-row", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { variant: "outline", size: "sm", onClick: preview.onClose, children: text.cancel }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { size: "sm", onClick: () => preview.onAttach(), children: text.attach })
        ] })
      ] })
    ] }) })
  ] });
}


exports.CallReconcileDialogs = CallReconcileDialogs;
