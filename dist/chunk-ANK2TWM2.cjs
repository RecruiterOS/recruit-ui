"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkVVPSU63Ncjs = require('./chunk-VVPSU63N.cjs');


var _chunk6Y2YAKPUcjs = require('./chunk-6Y2YAKPU.cjs');


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
function SheetUnavailable({ onUnavailable }) {
  _react.useEffect.call(void 0, () => onUnavailable(), [onUnavailable]);
  return null;
}
var CandidateDecisionReasonSheet = _react.lazy.call(void 0,
  () => Promise.resolve().then(() => _interopRequireWildcard(require("./recruit/candidate-decision-reason-sheet.cjs"))).then(
    (module) => ({ default: module.CandidateDecisionReasonSheet }),
    () => ({ default: SheetUnavailable })
  )
);
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
  reasonPrompt = "dialog",
  reasonSheet,
  readOnly = false,
  disabled = false,
  padding = "default",
  labels
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [asking, setAsking] = _react.useState.call(void 0, null);
  const [changing, setChanging] = _react.useState.call(void 0, false);
  const [failure, setFailure] = _react.useState.call(void 0, null);
  const failed = failure !== null;
  const [sheetUnavailable, setSheetUnavailable] = _react.useState.call(void 0, false);
  const [saving, setSaving] = _react.useState.call(void 0, false);
  const askingNow = _react.useRef.call(void 0, asking);
  askingNow.current = asking;
  _react.useEffect.call(void 0, () => {
    if (disabled) setAsking(null);
  }, [disabled]);
  const submit = async (why) => {
    if (!asking) return;
    setFailure(null);
    setSaving(true);
    try {
      await onDecide(asking, why);
      setAsking(null);
      setChanging(false);
    } catch (cause) {
      setAsking(null);
      setFailure({ cause });
    } finally {
      setSaving(false);
    }
  };
  const close = () => {
    setAsking(null);
    setFailure(null);
  };
  const sheet = typeof reasonSheet === "function" ? asking ? reasonSheet(asking) : void 0 : reasonSheet;
  const held = disabled || saving;
  const prompt = reasonPrompt === "sheet" && !sheetUnavailable ? (
    // Fetched as the row mounts, so a press opens the sheet at once.
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _react.Suspense, { fallback: null, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      CandidateDecisionReasonSheet,
      {
        open: asking !== null,
        decision: _nullishCoalesce(asking, () => ( void 0)),
        candidateName,
        reasons: asking === "no" ? _optionalChain([suggestions, 'optionalAccess', _ => _.no]) : _optionalChain([suggestions, 'optionalAccess', _2 => _2.yes]),
        reasonRequired: !reasonOptional,
        title: _optionalChain([sheet, 'optionalAccess', _3 => _3.title]),
        subtitle: _optionalChain([sheet, 'optionalAccess', _4 => _4.subtitle]),
        voiceTitle: _optionalChain([sheet, 'optionalAccess', _5 => _5.voiceTitle]),
        skipLabel: _optionalChain([sheet, 'optionalAccess', _6 => _6.skipLabel]),
        footer: _optionalChain([sheet, 'optionalAccess', _7 => _7.footer]),
        actions: _optionalChain([sheet, 'optionalAccess', _8 => _8.actions]),
        voice: _optionalChain([sheet, 'optionalAccess', _9 => _9.voice]),
        voiceLang: _optionalChain([sheet, 'optionalAccess', _10 => _10.voiceLang]),
        labels: _optionalChain([sheet, 'optionalAccess', _11 => _11.labels]),
        onUnavailable: () => setSheetUnavailable(true),
        onConfirm: async (why) => {
          if (!asking) return;
          setSaving(true);
          try {
            await onDecide(asking, _nullishCoalesce(why, () => ( "")));
            setAsking(null);
            setChanging(false);
          } catch (cause) {
            if (askingNow.current === null) setFailure({ cause });
            throw cause;
          } finally {
            setSaving(false);
          }
        },
        onClose: close
      }
    ) })
  ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunkUSK6QY5Zcjs.CandidateDecisionReasonDialog,
    {
      open: asking !== null,
      title: asking === "no" ? text.noTitle(candidateName) : text.yesTitle(candidateName),
      suggestions: asking === "no" ? _optionalChain([suggestions, 'optionalAccess', _12 => _12.no]) : _optionalChain([suggestions, 'optionalAccess', _13 => _13.yes]),
      placeholder: asking === "no" ? text.noPlaceholder : text.yesPlaceholder,
      confirmLabel: asking === "no" ? text.confirmNo : text.confirmYes,
      reasonOptional,
      onSubmit: submit,
      onClose: close,
      labels: _optionalChain([labels, 'optionalAccess', _14 => _14.reason]) === void 0 ? void 0 : { reason: labels.reason }
    }
  );
  const recorded = decision !== null && (readOnly || !changing && !failed);
  const said = decision === "yes" ? readOnly ? text.readOnlyYes : text.saidYes : readOnly ? text.readOnlyNo : text.saidNo;
  const content = recorded ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _flexitem.FlexItem, { grow: true, minWidth: "zero", children: [
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "center", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: decision === "yes" ? _lucidereact.ThumbsUp : _lucidereact.ThumbsDown, size: "sm" }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "span", size: "sm", weight: "semibold", children: said })
      ] }),
      reason != null && reason !== "" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "muted", marginTop: "xs", children: reason }) : null
    ] }),
    readOnly ? null : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { type: "button", variant: "ghost", size: "sm", disabled: held, onClick: () => setChanging(true), children: text.change })
  ] }) : readOnly ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "muted", children: text.unanswered }) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _flexitem.FlexItem, { grow: true, minWidth: "zero", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _chunk6Y2YAKPUcjs.CandidateDecisionButtons,
      {
        stretch: true,
        disabled: held,
        labels: { yes: text.yes, no: text.no },
        onChoose: (choice) => {
          setFailure(null);
          setAsking(choice);
        },
        children: prompt
      }
    ),
    failure ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "destructive", marginTop: "xs", role: "alert", children: typeof text.failed === "function" ? text.failed(failure.cause) : text.failed }) : null
  ] });
  const marks = {
    "data-slot": "candidate-client-decision",
    "data-decision": _nullishCoalesce(decision, () => ( "none")),
    "data-read-only": readOnly || void 0
  };
  if (padding === "none") {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _stack.Stack,
      {
        ...marks,
        direction: "horizontal",
        gap: "sm",
        align: "center",
        wrap: true,
        onClick: (event) => event.stopPropagation(),
        children: content
      }
    );
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVVPSU63Ncjs.CandidateReviewActionRow, { ...marks, isolateClicks: true, children: content });
}



exports.CandidateClientDecision = CandidateClientDecision;
