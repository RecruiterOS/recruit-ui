import {
  useDictationSupport
} from "./chunk-TR6R7XYB.js";
import {
  ChoiceChips
} from "./chunk-P5VLMURO.js";

// src/recruit/candidate-decision-reason-sheet.tsx
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Chat } from "@epicbagel/saas-kit/primitives/chat";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@epicbagel/saas-kit/primitives/dialog";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Suggestion, Suggestions } from "@epicbagel/saas-kit/primitives/suggestion";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { ArrowRight, Check, Loader2, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var REASON_SEPARATOR = "; ";
var SELECTION_KEY = "recruit-ui:decision-reason-selection";
function rememberedSelection() {
  try {
    const stored = window.sessionStorage.getItem(SELECTION_KEY);
    return stored === "single" || stored === "multiple" ? stored : null;
  } catch {
    return null;
  }
}
function rememberSelection(selection) {
  try {
    window.sessionStorage.setItem(SELECTION_KEY, selection);
  } catch {
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
  return /* @__PURE__ */ jsx(OpenReasonSheet, { ...sheet });
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
  const dictation = useDictationSupport();
  const reasonsLabelId = useId();
  const opener = useRef(null);
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState(null);
  const inFlight = useRef(false);
  const [ownSelection, setOwnSelection] = useState(
    () => rememberedSelection() ?? defaultReasonSelection
  );
  const [ticked, setTicked] = useState(() => /* @__PURE__ */ new Set());
  const chips = [...new Set(reasons.map((reason) => reason.trim()).filter(Boolean))];
  const selectable = multipleReasons && chips.length > 1;
  const selection = selectable ? reasonSelection ?? ownSelection : "single";
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
    onReasonSelectionChange?.(next);
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
  const reasonChips = chips.length > 0 ? /* @__PURE__ */ jsxs(Stack, { "data-slot": "candidate-decision-reason-sheet-reasons", "data-selection": selection, gap: "sm", children: [
    /* @__PURE__ */ jsxs(
      Stack,
      {
        direction: "horizontal",
        gap: "sm",
        align: "center",
        justify: "between",
        wrap: true,
        ...selectable ? { border: "bottom", paddingBottom: "sm" } : {},
        children: [
          /* @__PURE__ */ jsx(Text, { as: "p", id: reasonsLabelId, size: "xs", tone: "muted", children: text.reasons }),
          selectable ? /* @__PURE__ */ jsx(
            ChoiceChips,
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
    /* @__PURE__ */ jsx(Suggestions, { role: "group", "aria-labelledby": reasonsLabelId, layout: "wrap", children: chips.map((reason) => selection === "multiple" ? (
      // A toggle: ticked reasons wait for the bottom button.
      /* @__PURE__ */ jsxs(
        Suggestion,
        {
          suggestion: reason,
          "aria-pressed": ticked.has(reason),
          className: TICKED_REASON,
          onClick: toggle,
          children: [
            reason,
            ticked.has(reason) ? /* @__PURE__ */ jsx(Icon, { icon: Check, size: "sm" }) : null
          ]
        },
        reason
      )
    ) : /* @__PURE__ */ jsx(
      Suggestion,
      {
        suggestion: reason,
        onClick: (tapped) => void confirm(tapped).catch(() => void 0)
      },
      reason
    )) })
  ] }) : null;
  return /* @__PURE__ */ jsx(Dialog, { open: true, onOpenChange: (next) => {
    if (!next) onClose();
  }, children: /* @__PURE__ */ jsxs(
    DialogContent,
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
        /* @__PURE__ */ jsx(DialogTitle, { visuallyHidden: true, asChild: true, children: /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: heading }) }),
        described ? /* @__PURE__ */ jsx(DialogDescription, { visuallyHidden: true, asChild: true, children: /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: description }) }) : null,
        /* @__PURE__ */ jsxs(
          Stack,
          {
            "data-slot": "candidate-decision-reason-sheet",
            "data-decision": decision,
            direction: "vertical",
            gap: "none",
            grow: true,
            minHeight: "zero",
            children: [
              /* @__PURE__ */ jsx(
                Stack,
                {
                  direction: "horizontal",
                  gap: "none",
                  align: "center",
                  justify: "end",
                  paddingX: "md",
                  paddingTop: "safe",
                  paddingBottom: "sm",
                  children: /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "icon-md", title: text.cancel, onClick: onClose, children: /* @__PURE__ */ jsx(Icon, { icon: X, size: "lg" }) })
                }
              ),
              /* @__PURE__ */ jsx(Stack, { direction: "vertical", gap: "none", grow: true, overflow: "y-auto", paddingX: "md", children: /* @__PURE__ */ jsx(Stack, { gap: "none", centered: true, width: "full", maxWidth: "xl", paddingBottom: "md", className: "my-auto", children: dictation === null ? null : /* @__PURE__ */ jsx(
                Chat,
                {
                  messages: [],
                  onSend: (reason) => confirm(reason.trim() || void 0),
                  onSendError: () => void 0,
                  pending: saving,
                  emptyPendingContent: (
                    // The composer is gone while this shows, so it is said aloud.
                    /* @__PURE__ */ jsx(Stack, { role: "status", gap: "none", width: "full", children: /* @__PURE__ */ jsx(
                      EmptyState,
                      {
                        variant: "empty",
                        size: "md",
                        icon: Loader2,
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
                  voiceTitle: voiceTitle ?? defaultVoiceTitle(decision, candidateName, heading),
                  voiceHeroLabel: text.speak,
                  voiceHeroSwitchLabel: text.typeInstead,
                  emptyTitle: heading,
                  emptySubtitle: described ? description : void 0,
                  placeholder: text.placeholder,
                  emptyFooter: reasonChips || shown(outcome) ? /* @__PURE__ */ jsxs(Stack, { gap: "md", children: [
                    reasonChips,
                    shown(outcome) ? /* @__PURE__ */ jsx(Stack, { "data-slot": "candidate-decision-reason-sheet-outcome", border: "top", paddingTop: "md", children: outcome }) : null
                  ] }) : void 0
                }
              ) }) }),
              shown(footer) || hasBottomRow ? /* @__PURE__ */ jsxs(
                Stack,
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
                    hasBottomRow ? /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", justify: "center", wrap: true, children: [
                      actions,
                      hasBottomButton ? /* @__PURE__ */ jsxs(
                        Button,
                        {
                          type: "button",
                          variant: armed ? "default" : "outline",
                          size: "lg",
                          disabled: saving || reasonRequired && !armed,
                          onClick: () => void confirm().catch(() => void 0),
                          children: [
                            armed || reasonRequired ? shown(confirmWords) ? confirmWords : defaultConfirmLabel(decision) : shown(skipLabel) ? skipLabel : defaultSkipLabel(decision),
                            /* @__PURE__ */ jsx(Icon, { icon: ArrowRight, size: "md", marginStart: "sm" })
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

export {
  CandidateDecisionReasonSheet
};
