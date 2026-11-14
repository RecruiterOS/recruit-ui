"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkVVPSU63Ncjs = require('./chunk-VVPSU63N.cjs');


var _chunkOFF5LAYRcjs = require('./chunk-OFF5LAYR.cjs');


var _chunkUSK6QY5Zcjs = require('./chunk-USK6QY5Z.cjs');

// src/recruit/candidate-client-decision.tsx
var _button = require('@epicbagel/saas-kit/primitives/button');
var _flexitem = require('@epicbagel/saas-kit/primitives/flex-item');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var DEFAULT_LABELS = {
  yes: "Yes",
  no: "No",
  saidYes: "You said Yes",
  saidNo: "You said No",
  change: "Change",
  yesTitle: (name) => `Yes to ${name}`,
  noTitle: (name) => `No to ${name}`,
  yesPlaceholder: "What stands out?",
  noPlaceholder: "What's missing?",
  confirmYes: "Save Yes",
  confirmNo: "Save No",
  reason: "Why?",
  failed: "That didn't save. Try again.",
  readOnlyYes: "Said Yes",
  readOnlyNo: "Said No",
  unanswered: "No answer yet"
};
function CandidateClientDecision({
  candidateName,
  decision = null,
  reason,
  onDecide,
  suggestions,
  reasonOptional = false,
  readOnly = false,
  labels
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [asking, setAsking] = _react.useState.call(void 0, null);
  const [changing, setChanging] = _react.useState.call(void 0, false);
  const [failed, setFailed] = _react.useState.call(void 0, false);
  const submit = async (why) => {
    if (!asking) return;
    setFailed(false);
    try {
      await onDecide(asking, why);
      setAsking(null);
      setChanging(false);
    } catch (e) {
      setAsking(null);
      setFailed(true);
    }
  };
  const dialog = /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunkUSK6QY5Zcjs.CandidateDecisionReasonDialog,
    {
      open: asking !== null,
      title: asking === "no" ? text.noTitle(candidateName) : text.yesTitle(candidateName),
      suggestions: asking === "no" ? _optionalChain([suggestions, 'optionalAccess', _ => _.no]) : _optionalChain([suggestions, 'optionalAccess', _2 => _2.yes]),
      placeholder: asking === "no" ? text.noPlaceholder : text.yesPlaceholder,
      confirmLabel: asking === "no" ? text.confirmNo : text.confirmYes,
      reasonOptional,
      onSubmit: submit,
      onClose: () => {
        setAsking(null);
        setFailed(false);
      },
      labels: _optionalChain([labels, 'optionalAccess', _3 => _3.reason]) === void 0 ? void 0 : { reason: labels.reason }
    }
  );
  const recorded = decision !== null && (readOnly || !changing && !failed);
  const said = decision === "yes" ? readOnly ? text.readOnlyYes : text.saidYes : readOnly ? text.readOnlyNo : text.saidNo;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunkVVPSU63Ncjs.CandidateReviewActionRow,
    {
      "data-slot": "candidate-client-decision",
      "data-decision": _nullishCoalesce(decision, () => ( "none")),
      "data-read-only": readOnly || void 0,
      isolateClicks: true,
      children: recorded ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _flexitem.FlexItem, { grow: true, minWidth: "zero", children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "center", children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: decision === "yes" ? _lucidereact.ThumbsUp : _lucidereact.ThumbsDown, size: "sm" }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "span", size: "sm", weight: "semibold", children: said })
          ] }),
          reason != null && reason !== "" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "muted", marginTop: "xs", children: reason }) : null
        ] }),
        readOnly ? null : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setChanging(true), children: text.change })
      ] }) : readOnly ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "muted", children: text.unanswered }) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _flexitem.FlexItem, { grow: true, minWidth: "zero", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkOFF5LAYRcjs.CandidateDecisionButtons,
          {
            stretch: true,
            labels: { yes: text.yes, no: text.no },
            onChoose: (choice) => {
              setFailed(false);
              setAsking(choice);
            },
            children: dialog
          }
        ),
        failed ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "destructive", marginTop: "xs", role: "alert", children: text.failed }) : null
      ] })
    }
  );
}



exports.CandidateClientDecision = CandidateClientDecision;
