"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkLIC3YNUNcjs = require('./chunk-LIC3YNUN.cjs');


var _chunkL2JVZDKScjs = require('./chunk-L2JVZDKS.cjs');

// src/recruit/candidate-decision-reason-sheet.tsx
var _button = require('@epicbagel/saas-kit/primitives/button');
var _chat = require('@epicbagel/saas-kit/primitives/chat');





var _dialog = require('@epicbagel/saas-kit/primitives/dialog');
var _emptystate = require('@epicbagel/saas-kit/primitives/empty-state');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _suggestion = require('@epicbagel/saas-kit/primitives/suggestion');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var REASON_SEPARATOR = "; ";
var SELECTION_KEY = "recruit-ui:decision-reason-selection";
function rememberedSelection() {
  try {
    const stored = window.sessionStorage.getItem(SELECTION_KEY);
    return stored === "single" || stored === "multiple" ? stored : null;
  } catch (e) {
    return null;
  }
}
function rememberSelection(selection) {
  try {
    window.sessionStorage.setItem(SELECTION_KEY, selection);
  } catch (e2) {
  }
}
var TICKED_REASON = "aria-pressed:border-primary aria-pressed:bg-primary/10";
var DEFAULT_LABELS = {
  cancel: "Cancel",
  speak: "Tap to speak",
  typeInstead: "or type instead",
  reasons: "or pick a reason",
  selection: "How many reasons",
  single: "Single",
  multiple: "Multiple",
  placeholder: "Type a reason\u2026",
  saving: "Saving\u2026",
  failed: "That didn't save. Try again."
};
function isPromiseLike(value) {
  return value != null && typeof value.then === "function";
}
function shown(node) {
  return node != null && node !== false && node !== "";
}
function defaultTitle(decision) {
  if (decision === "yes") return "Why yes?";
  if (decision === "no") return "Why no?";
  return "Why?";
}
function defaultSubtitle(candidateName, hasReasons, selection) {
  const whose = candidateName ? ` for ${candidateName}` : "";
  if (!hasReasons) return `Give your reason${whose}.`;
  return selection === "multiple" ? `Give your reason${whose}, or pick one or more.` : `Give your reason${whose}, or pick one.`;
}
function defaultVoiceTitle(decision, candidateName, title) {
  if (decision && candidateName) return `Why ${decision} on ${candidateName}?`;
  return typeof title === "string" ? title : defaultTitle(decision);
}
function defaultSkipLabel(decision) {
  if (decision === "yes") return "Skip \u2014 just mark Yes";
  if (decision === "no") return "Skip \u2014 just mark No";
  return "Skip";
}
function defaultConfirmLabel(decision) {
  if (decision === "yes") return "Mark Yes";
  if (decision === "no") return "Mark No";
  return "Confirm";
}
function CandidateDecisionReasonSheet({ open, ...sheet }) {
  if (!open) return null;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, OpenReasonSheet, { ...sheet });
}
function OpenReasonSheet({
  onClose,
  decision,
  candidateName,
  title,
  subtitle,
  voiceTitle,
  reasons = [],
  multipleReasons = true,
  reasonSelection,
  defaultReasonSelection = "single",
  onReasonSelectionChange,
  onConfirm,
  reasonRequired = false,
  skipLabel,
  confirmLabel,
  outcome,
  footer,
  actions,
  voice = true,
  voiceLang,
  labels
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const dictation = _chunkLIC3YNUNcjs.useDictationSupport.call(void 0, );
  const reasonsLabelId = _react.useId.call(void 0, );
  const opener = _react.useRef.call(void 0, null);
  const [saving, setSaving] = _react.useState.call(void 0, false);
  const [failure, setFailure] = _react.useState.call(void 0, null);
  const inFlight = _react.useRef.call(void 0, false);
  const [ownSelection, setOwnSelection] = _react.useState.call(void 0,
    () => _nullishCoalesce(rememberedSelection(), () => ( defaultReasonSelection))
  );
  const [ticked, setTicked] = _react.useState.call(void 0, () => /* @__PURE__ */ new Set());
  const chips = [...new Set(reasons.map((reason) => reason.trim()).filter(Boolean))];
  const selectable = multipleReasons && chips.length > 1;
  const selection = selectable ? _nullishCoalesce(reasonSelection, () => ( ownSelection)) : "single";
  const picked = selection === "multiple" ? chips.filter((reason) => ticked.has(reason)) : [];
  const heading = shown(title) ? title : defaultTitle(decision);
  const description = typeof subtitle === "function" ? subtitle(selection) : subtitle === void 0 ? defaultSubtitle(candidateName, chips.length > 0, selection) : subtitle;
  const described = shown(description);
  const changeSelection = (next) => {
    if (next === "single") setTicked(/* @__PURE__ */ new Set());
    if (reasonSelection === void 0) {
      setOwnSelection(next);
      rememberSelection(next);
    }
    _optionalChain([onReasonSelectionChange, 'optionalCall', _ => _(next)]);
  };
  const toggle = (reason) => {
    setTicked((current) => {
      const next = new Set(current);
      if (!next.delete(reason)) next.add(reason);
      return next;
    });
  };
  const confirm = async (words) => {
    if (inFlight.current) return;
    setFailure(null);
    const given = words && !picked.includes(words) ? [...picked, words] : picked;
    try {
      const result = onConfirm(given.length > 0 ? given.join(REASON_SEPARATOR) : void 0, { reasons: given });
      if (isPromiseLike(result)) {
        inFlight.current = true;
        setSaving(true);
        await result;
      }
    } catch (cause) {
      setFailure({ cause });
      throw cause;
    } finally {
      inFlight.current = false;
      setSaving(false);
    }
  };
  const armed = picked.length > 0;
  const hasBottomButton = !reasonRequired || selection === "multiple";
  const hasBottomRow = shown(actions) || hasBottomButton;
  const confirmWords = typeof confirmLabel === "function" ? confirmLabel(picked) : confirmLabel;
  const reasonChips = chips.length > 0 ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { "data-slot": "candidate-decision-reason-sheet-reasons", "data-selection": selection, gap: "sm", children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
      _stack.Stack,
      {
        direction: "horizontal",
        gap: "sm",
        align: "center",
        justify: "between",
        wrap: true,
        ...selectable ? { border: "bottom", paddingBottom: "sm" } : {},
        children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "p", id: reasonsLabelId, size: "xs", tone: "muted", children: text.reasons }),
          selectable ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _chunkL2JVZDKScjs.ChoiceChips,
            {
              "aria-label": text.selection,
              chips: [
                { id: "single", label: text.single },
                { id: "multiple", label: text.multiple }
              ],
              value: selection,
              onChange: (id) => changeSelection(id === "multiple" ? "multiple" : "single")
            }
          ) : null
        ]
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _suggestion.Suggestions, { role: "group", "aria-labelledby": reasonsLabelId, layout: "wrap", children: chips.map((reason) => selection === "multiple" ? (
      // A toggle: ticked reasons wait for the bottom button.
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
        _suggestion.Suggestion,
        {
          suggestion: reason,
          "aria-pressed": ticked.has(reason),
          className: TICKED_REASON,
          onClick: toggle,
          children: [
            reason,
            ticked.has(reason) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Check, size: "sm" }) : null
          ]
        },
        reason
      )
    ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _suggestion.Suggestion,
      {
        suggestion: reason,
        onClick: (tapped) => void confirm(tapped).catch(() => void 0)
      },
      reason
    )) })
  ] }) : null;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _dialog.Dialog, { open: true, onOpenChange: (next) => {
    if (!next) onClose();
  }, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _dialog.DialogContent,
    {
      size: "wide",
      height: "viewport-lg",
      layout: "column",
      padding: "none",
      overflow: "hidden",
      hideClose: true,
      ...described ? {} : { "aria-describedby": void 0 },
      onOpenAutoFocus: () => {
        opener.current = document.activeElement;
      },
      onCloseAutoFocus: (event) => {
        const from = opener.current;
        if (!(from instanceof HTMLElement) || !from.isConnected) return;
        event.preventDefault();
        from.focus();
      },
      onClick: (event) => event.stopPropagation(),
      onKeyDown: (event) => event.stopPropagation(),
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _dialog.DialogTitle, { visuallyHidden: true, asChild: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", children: heading }) }),
        described ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _dialog.DialogDescription, { visuallyHidden: true, asChild: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", children: description }) }) : null,
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          _stack.Stack,
          {
            "data-slot": "candidate-decision-reason-sheet",
            "data-decision": decision,
            direction: "vertical",
            gap: "none",
            grow: true,
            minHeight: "zero",
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                _stack.Stack,
                {
                  direction: "horizontal",
                  gap: "none",
                  align: "center",
                  justify: "end",
                  paddingX: "md",
                  paddingTop: "safe",
                  paddingBottom: "sm",
                  children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { type: "button", variant: "ghost", size: "icon-md", title: text.cancel, onClick: onClose, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.X, size: "lg" }) })
                }
              ),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "vertical", gap: "none", justify: "center", grow: true, overflow: "y-auto", paddingX: "md", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { gap: "none", centered: true, width: "full", maxWidth: "xl", children: dictation === null ? null : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                _chat.Chat,
                {
                  messages: [],
                  onSend: (reason) => confirm(reason.trim() || void 0),
                  onSendError: () => void 0,
                  pending: saving,
                  emptyPendingContent: (
                    // The composer is gone while this shows, so it is said aloud.
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { role: "status", gap: "none", width: "full", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                      _emptystate.EmptyState,
                      {
                        variant: "empty",
                        size: "md",
                        icon: _lucidereact.Loader2,
                        iconMotion: "spin",
                        surface: "plain",
                        title: text.saving,
                        description: ""
                      }
                    ) })
                  ),
                  error: failure ? typeof text.failed === "function" ? text.failed(failure.cause) : text.failed : null,
                  defaultMode: voice && dictation ? "voice" : "text",
                  voice,
                  voiceLang,
                  voiceTitle: _nullishCoalesce(voiceTitle, () => ( defaultVoiceTitle(decision, candidateName, heading))),
                  voiceHeroLabel: text.speak,
                  voiceHeroSwitchLabel: text.typeInstead,
                  emptyTitle: heading,
                  emptySubtitle: described ? description : void 0,
                  placeholder: text.placeholder,
                  emptyFooter: reasonChips || shown(outcome) ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "md", children: [
                    reasonChips,
                    shown(outcome) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { "data-slot": "candidate-decision-reason-sheet-outcome", border: "top", paddingTop: "md", children: outcome }) : null
                  ] }) : void 0
                }
              ) }) }),
              shown(footer) || hasBottomRow ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                _stack.Stack,
                {
                  "data-slot": "candidate-decision-reason-sheet-footer",
                  direction: "vertical",
                  gap: "sm",
                  align: "center",
                  border: "top",
                  paddingX: "lg",
                  paddingY: "md",
                  children: [
                    footer,
                    hasBottomRow ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "center", justify: "center", wrap: true, children: [
                      actions,
                      hasBottomButton ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                        _button.Button,
                        {
                          type: "button",
                          variant: armed ? "default" : "outline",
                          size: "lg",
                          disabled: saving || reasonRequired && !armed,
                          onClick: () => void confirm().catch(() => void 0),
                          children: [
                            armed || reasonRequired ? shown(confirmWords) ? confirmWords : defaultConfirmLabel(decision) : shown(skipLabel) ? skipLabel : defaultSkipLabel(decision),
                            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.ArrowRight, size: "md", marginStart: "sm" })
                          ]
                        }
                      ) : null
                    ] }) : null
                  ]
                }
              ) : null
            ]
          }
        )
      ]
    }
  ) });
}



exports.CandidateDecisionReasonSheet = CandidateDecisionReasonSheet;
