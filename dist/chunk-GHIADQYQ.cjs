"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }// src/recruit/candidate-call-card.tsx
var _badge = require('@epicbagel/saas-kit/primitives/badge');
var _button = require('@epicbagel/saas-kit/primitives/button');
var _callcard = require('@epicbagel/saas-kit/primitives/call-card');
var _deleteconfirmationdialog = require('@epicbagel/saas-kit/primitives/delete-confirmation-dialog');
var _emptystate = require('@epicbagel/saas-kit/primitives/empty-state');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var DEFAULT_LABELS = {
  untitled: "Untitled call",
  showTranscript: "Show transcript",
  unlink: "Unlink",
  unlinkTitle: "Unlink this call?",
  unlinkDescription: "The call will be removed from this person. Its transcript is kept.",
  unlinkItem: "this call",
  unlinkConfirm: "Unlink call",
  check: "Check against open jobs",
  recheck: "Recheck against open jobs",
  checking: "Checking\u2026",
  noRolesTitle: "No suggested roles yet",
  noRolesDescription: "No other live role fits this person from this call."
};
var isShown = (node) => node != null && node !== false && node !== "";
function CandidateCallCard({
  title,
  source,
  timestamp,
  participants,
  segments,
  transcript,
  confidence,
  onUnlink,
  insights,
  roleMatches,
  labels,
  className
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [confirmUnlink, setConfirmUnlink] = _react.useState.call(void 0, false);
  const [unlinking, setUnlinking] = _react.useState.call(void 0, false);
  const ready = insights.status === "ready";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _callcard.CallCard,
      {
        className,
        title: title || text.untitled,
        source,
        timestamp,
        participants,
        segments: _nullishCoalesce(segments, () => ( void 0)),
        transcript,
        transcriptLabel: text.showTranscript,
        headerAside: isShown(confidence) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _badge.Badge, { variant: "secondary", size: "micro", titleCase: "capitalize", children: confidence }) : void 0,
        actions: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "sm", width: "full", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { variant: "ghost", size: "sm", disabled: unlinking, onClick: () => setConfirmUnlink(true), children: unlinking ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Loader2, size: "sm", spin: true }) : text.unlink }),
          ready ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "sm", children: [
            isShown(roleMatches) ? roleMatches : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              _emptystate.EmptyState,
              {
                variant: "empty",
                size: "inline",
                icon: _lucidereact.BriefcaseBusiness,
                title: text.noRolesTitle,
                description: text.noRolesDescription
              }
            ),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { variant: "ghost", size: "sm", onClick: () => insights.onGenerate(true), disabled: insights.generating, children: insights.generating ? text.checking : text.recheck })
          ] }) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", children: [
            insights.error && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "xs", tone: "destructive", children: insights.error }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { variant: "outline", size: "sm", onClick: () => insights.onGenerate(false), disabled: insights.generating, children: insights.generating ? text.checking : text.check })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _deleteconfirmationdialog.DeleteConfirmationDialog,
      {
        open: confirmUnlink,
        onOpenChange: setConfirmUnlink,
        title: text.unlinkTitle,
        description: text.unlinkDescription,
        itemName: title || text.unlinkItem,
        confirmText: text.unlinkConfirm,
        onConfirm: () => {
          setConfirmUnlink(false);
          setUnlinking(true);
          void onUnlink().finally(() => setUnlinking(false));
        }
      }
    )
  ] });
}



exports.CandidateCallCard = CandidateCallCard;
