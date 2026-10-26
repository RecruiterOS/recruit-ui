"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }

var _chunkGVQPJCZ6cjs = require('./chunk-GVQPJCZ6.cjs');

// src/recruit/candidate-outreach-drafts.tsx
var _badge = require('@epicbagel/saas-kit/primitives/badge');
var _button = require('@epicbagel/saas-kit/primitives/button');
var _copybutton = require('@epicbagel/saas-kit/primitives/copy-button');
var _emptystate = require('@epicbagel/saas-kit/primitives/empty-state');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _sectionheader = require('@epicbagel/saas-kit/primitives/section-header');
var _skeleton = require('@epicbagel/saas-kit/primitives/skeleton');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var NO_ACTIONS = [];
var DRAFT_ACTIONS = ["approve", "dismiss"];
var APPROVED_ACTIONS = ["markSent"];
function defaultOutreachDraftActions(draft) {
  if (draft.status === "draft") return DRAFT_ACTIONS;
  if (draft.status === "approved") return APPROVED_ACTIONS;
  return NO_ACTIONS;
}
var ACTION_NAME = {
  copy: (channel) => `Copy ${channel} draft`,
  approve: (channel) => `Approve ${channel} draft`,
  dismiss: (channel) => `Dismiss ${channel} draft`,
  markSent: (channel) => `Mark ${channel} draft sent`
};
var LABELS = {
  status: { draft: "draft", approved: "approved", sent: "sent", dismissed: "dismissed" },
  approve: "Approve",
  dismiss: "Dismiss",
  markSent: "Mark sent",
  actionName: (action, channel) => ACTION_NAME[action](channel)
};
function outreachDraftCopyText(draft) {
  return draft.subject ? `Subject: ${draft.subject}

${draft.body}` : draft.body;
}
function CandidateOutreachDraftCard({
  draft,
  onApprove,
  onDismiss,
  onMarkSent,
  availableActions,
  copyText = outreachDraftCopyText,
  labels,
  ...props
}) {
  const copy = { ...LABELS, ...labels };
  const channel = draft.channel.label;
  const offered = availableActions(draft);
  const [approving, approve] = _chunkGVQPJCZ6cjs.usePendingAction.call(void 0, onApprove && (() => onApprove(draft)));
  const [dismissing, dismiss] = _chunkGVQPJCZ6cjs.usePendingAction.call(void 0, onDismiss && (() => onDismiss(draft)));
  const [sending, markSent] = _chunkGVQPJCZ6cjs.usePendingAction.call(void 0, onMarkSent && (() => onMarkSent(draft)));
  const busy = approving || dismissing || sending;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _stack.Stack,
    {
      "data-slot": "candidate-outreach-draft",
      direction: "vertical",
      gap: "sm",
      surface: "card",
      radius: "md",
      padding: "compact",
      ...props,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "center", justify: "between", children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "center", minWidth: "zero", children: [
            draft.channel.icon ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: draft.channel.icon, size: "md", tone: "muted" }) : null,
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "inherit", as: "span", size: "sm", weight: "medium", children: channel }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _badge.Badge, { variant: draft.status === "draft" ? "secondary" : "outline", size: "micro", children: copy.status[draft.status] })
          ] }),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "xs", shrink: false, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _copybutton.CopyButton, { text: copyText(draft), "aria-label": copy.actionName("copy", channel) }),
            offered.includes("approve") && onApprove ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              _button.Button,
              {
                type: "button",
                variant: "ghost",
                size: "icon",
                title: copy.approve,
                "aria-label": copy.actionName("approve", channel),
                disabled: busy,
                onClick: approve,
                children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: approving ? _lucidereact.Loader2 : _lucidereact.Check, size: "sm", spin: approving })
              }
            ) : null,
            offered.includes("dismiss") && onDismiss ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              _button.Button,
              {
                type: "button",
                variant: "ghost",
                size: "icon",
                title: copy.dismiss,
                "aria-label": copy.actionName("dismiss", channel),
                disabled: busy,
                onClick: dismiss,
                children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: dismissing ? _lucidereact.Loader2 : _lucidereact.X, size: "sm", spin: dismissing })
              }
            ) : null,
            offered.includes("markSent") && onMarkSent ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              _button.Button,
              {
                type: "button",
                variant: "ghost",
                size: "icon",
                title: copy.markSent,
                "aria-label": copy.actionName("markSent", channel),
                disabled: busy,
                onClick: markSent,
                children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: sending ? _lucidereact.Loader2 : _lucidereact.Send, size: "sm", spin: sending })
              }
            ) : null
          ] })
        ] }),
        draft.subject ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "xs", weight: "medium", children: draft.subject }) : null,
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", whitespace: "pre-wrap", tone: "soft", children: draft.body })
      ]
    }
  );
}
function CandidateOutreachDraftList({
  drafts,
  loading = false,
  title = "Outreach drafts",
  empty = { title: "No outreach drafts yet" },
  onApprove,
  onDismiss,
  onMarkSent,
  availableActions = defaultOutreachDraftActions,
  copyText,
  border = "bottom",
  labels,
  ...props
}) {
  const titleId = _react.useId.call(void 0, );
  const count = drafts.length;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _panelsection.PanelSection,
    {
      "data-slot": "candidate-outreach-draft-list",
      "aria-labelledby": titleId,
      border,
      ...props,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sectionheader.SectionHeader, { id: titleId, label: title, count: !loading && count > 0 ? count : void 0 }),
        loading && count === 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "vertical", gap: "sm", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _skeleton.Skeleton, { preset: "row" }) }) : count === 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _emptystate.EmptyState,
          {
            variant: "empty",
            size: "inline",
            icon: _lucidereact.Send,
            title: empty.title,
            description: _nullishCoalesce(empty.description, () => ( ""))
          }
        ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "vertical", gap: "sm", children: drafts.map((draft) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          CandidateOutreachDraftCard,
          {
            draft,
            onApprove,
            onDismiss,
            onMarkSent,
            availableActions,
            copyText,
            labels
          },
          draft.id
        )) })
      ]
    }
  );
}





exports.defaultOutreachDraftActions = defaultOutreachDraftActions; exports.outreachDraftCopyText = outreachDraftCopyText; exports.CandidateOutreachDraftList = CandidateOutreachDraftList;
